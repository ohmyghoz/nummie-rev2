-- Nummi — aturan PIN berlaku juga saat anak DIBUAT, bukan hanya saat PIN diganti.
--
-- CACAT YANG DITUTUP:
--
-- ADR-0012 §A2 mengunci dua aturan PIN: **6 digit tetap**, dan **unik dalam satu keluarga**.
-- `set_child_pin()` (0018) menegakkan keduanya. `create_child()` (0012, ditulis ulang di 0013)
-- **tidak menegakkan satu pun** — ia langsung `crypt(p_pin, gen_salt('bf', 10))`.
--
-- Jadi aturannya berlaku saat PIN DIGANTI dan bocor saat PIN DIBUAT. Arahnya persis terbalik dari
-- yang berguna: pembuatanlah yang jadi jalur onboarding (Tahap 2 no.4), dan penggantian yang jadi
-- jalur langka.
--
-- Sisa dunia lama yang membuktikan ini kelalaian, bukan pilihan: komentar `0001_init.sql`
-- masih berbunyi *"4 digit = 10.000 kombinasi"*, tertinggal dari sebelum K15 menyatukan angka
-- yang sempat ditulis 4, 4–6, dan 6 di tiga tempat berbeda. Skemanya sendiri tidak pernah
-- membatasi panjang — `pin_hash` menyimpan hash, dan hash tidak punya panjang asal.
--
-- AKIBAT PIN KEMBAR — diverifikasi, bukan diperkirakan (Postgres lokal, 31 Juli 2026):
--
--   `find_child_by_pin()` (0007) ditutup `where (select count(*) from m) = 1`. Ia sengaja
--   menolak kecocokan ganda, karena "kode keluarga + PIN" harus menunjuk tepat satu anak.
--
--   Jadi dua anak ber-PIN sama tidak menghasilkan login yang tertukar — menghasilkan **NOL baris**.
--   Keduanya terkunci permanen dari uangnya sendiri, dan layarnya cuma bisa bilang "PIN salah",
--   padahal PIN-nya benar. Ortu tidak bisa melihat PIN untuk membandingkan (`pin_hash` di-bcrypt,
--   0006) — persis pemulihan mustahil yang dicatat ADR-0022, kali ini dibuat oleh kita sendiri
--   di jalur pembuatan.
--
--   Itu yang menjadikan berkas ini penutup lubang, bukan kerapian.
--
-- Kenapa ini penting justru SEKARANG: sebelum ADR-0023, satu-satunya pemanggil `create_child()`
-- adalah tangan yang menyiapkan keluarga uji. Setelah pendaftaran publik, pemanggilnya adalah
-- formulir yang diisi ortu mana pun. Validasi `validateChild()` di packages/core memang ada — dan
-- itu justru bentuk kegagalan yang diperingatkan 0009 dan diulang 0018: aturan yang hanya dijaga
-- app akan bocor lewat jalur tulis berikutnya yang lupa memanggilnya.
--
-- BENTUKNYA: `create_child()` ditulis ulang UTUH dengan dua pemeriksaan di depan, sisanya sama
-- persis dengan versi 0013. Bukan karena menulis ulang itu bagus, tapi karena Postgres tidak
-- punya cara menyisipkan ke tengah badan fungsi — dan menambah fungsi pembungkus akan
-- meninggalkan dua pintu masuk, satu di antaranya tetap bocor.

create or replace function create_child(
  p_family_id   uuid,
  p_name        text,
  p_birth_month int,
  p_birth_year  int,
  p_tier        tier,
  p_pin         text,
  p_wallets     jsonb
)
returns uuid
language plpgsql
security definer
-- `extensions` wajib: crypt() & gen_salt() milik pgcrypto, yang tidak dipasang di `public`.
set search_path = public, extensions, pg_temp
as $$
declare
  v_child uuid;
begin
  -- ── BARU di 0021 ───────────────────────────────────────────────────────────
  -- Pesan galatnya sengaja bentuk yang sama dengan `set_child_pin()` (0018): satu aturan,
  -- satu cara mengatakannya. Layar yang menampilkan galat ini tidak perlu tahu lewat pintu
  -- mana ia datang.

  if p_pin !~ '^\d{6}$' then
    raise exception 'create_child: PIN harus 6 digit';
  end if;

  -- Keunikan per keluarga (ADR-0012 §A2). Tidak bisa jadi constraint: salt bcrypt berbeda tiap
  -- baris, jadi dua PIN sama menghasilkan hash berbeda.
  --
  -- `family_pin_taken()` dari 0007 — BUKAN `family_pin_taken_for_other()` dari 0018. Di sini
  -- belum ada anak yang perlu dikecualikan; anaknya baru akan lahir tiga baris di bawah. Itu
  -- persis pembedaan yang dibuat 0018, dipakai dari sisi sebaliknya.
  if family_pin_taken(p_family_id, p_pin) then
    raise exception 'create_child: PIN sudah dipakai anggota keluarga lain';
  end if;
  -- ───────────────────────────────────────────────────────────────────────────

  insert into children (family_id, name, birth_month, birth_year, tier, pin_hash)
  values (p_family_id, p_name, p_birth_month, p_birth_year, p_tier,
          crypt(p_pin, gen_salt('bf', 10)))
  returning id into v_child;

  insert into wallets (child_id, name, category, kind)
  select v_child, w->>'name', (w->>'category')::pocket, (w->>'kind')::wallet_kind
  from jsonb_array_elements(p_wallets) as w;

  -- Rasio memakai default kolom (40/40/20 kanonik). Tujuan diselesaikan DI SINI karena id
  -- wallet-nya baru lahir sedetik lalu — mencocokkannya lewat `kind`, tidak pernah lewat nama.
  insert into money_rules (child_id, mode, auto_split_enabled, destinations)
  values (
    v_child,
    -- Strict DEFAULT MATI (ADR-0005).
    'flexible', true,
    jsonb_strip_nulls(jsonb_build_object(
      'spend', (select id::text from wallets where child_id = v_child and kind = 'envelope'     limit 1),
      'save',  (select id::text from wallets where child_id = v_child and kind = 'free_savings' limit 1),
      'give',  (select id::text from wallets where child_id = v_child and kind = 'give_pool'    limit 1)
    ))
  );

  insert into child_economy (child_id) values (v_child);

  insert into allowance_schedules (child_id) values (v_child);

  -- Bunga bank milik KELUARGA, jadi cuma dibuat kalau belum ada — anak kedua tidak boleh
  -- menimpa rate yang sudah ditetapkan ortu untuk anak pertama.
  insert into bank_rates (family_id) values (p_family_id)
  on conflict (family_id) do nothing;

  return v_child;
end;
$$;

-- `create or replace` mempertahankan grant yang ada, tapi menuliskannya ulang membuat hak akses
-- fungsi ini terbaca di berkas yang mengubahnya — bukan hanya di 0013.
revoke execute on function create_child(uuid, text, int, int, tier, text, jsonb)
  from public, anon, authenticated;
grant execute on function create_child(uuid, text, int, int, tier, text, jsonb)
  to service_role;

-- ── Komentar usang di 0001 ────────────────────────────────────────────────────
-- `0001_init.sql` masih menyebut "4 digit" di dekat `failed_pin_attempts`. Migrasi lama tidak
-- disunting (ia riwayat yang sudah dijalankan orang lain), jadi koreksinya dipasang sebagai
-- komentar kolom — tempat yang benar-benar dibaca orang saat memeriksa skema.
comment on column children.pin_hash is
  'bcrypt (pgcrypto, cost 10). PIN = 6 digit tetap, unik dalam satu keluarga (ADR-0012 §A2). '
  'Ditegakkan create_child() sejak migrasi 0021 dan set_child_pin() sejak 0018. '
  'Komentar "4 digit" di 0001 sudah usang sejak K15.';
