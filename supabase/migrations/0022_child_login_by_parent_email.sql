-- Nummi — login anak berpindah dari kode keluarga ke EMAIL ORANG TUA (ADR-0024).
--
-- Mockup menang atas ADR-0012 (AGENTS.md §0). Layar Login mockup ortu menyuruh anak mengetik
-- *"your grown-up's email"* + PIN 6 digit; konfliknya tercatat sebagai MR-6 di
-- `docs/mockup-review.md`, dan diputuskan Ghozy 31 Juli 2026.
--
-- Yang TIDAK berubah dari 0007, dan sengaja dicerminkan baris per baris:
--   · perbandingan bcrypt dikerjakan Postgres — `pin_hash` tidak pernah keluar dari database (0006)
--   · penutup `where (select count(*) from m) = 1` — dua anak cocok berarti login GAGAL, bukan
--     server menebak. Masuk sebagai "salah satu dari dua anak" jauh lebih buruk daripada tidak masuk
--   · keduanya oracle PIN → service_role saja; rate limiting hidup di Edge Function
--
-- SATU PINTU, BUKAN DUA. `find_child_by_pin()` dihapus di bawah, tidak dibiarkan berdampingan:
-- dua jalur autentikasi berarti dua permukaan serangan dan dua jalur rate limit, dan yang tidak
-- dipakai adalah yang tidak diuji. Pelajaran yang sama dengan 0009. Aman dilakukan sekarang karena
-- belum ada apa pun yang di-deploy dari repo ini.

-- ── Resolusi keluarga dari email ortu ────────────────────────────────────────
--
-- Dipanggil Edge Function SEBELUM menyentuh hash, supaya rate limit punya kunci. Urutan itu
-- diwarisi apa adanya dari jalur lama (0007 + fungsi `isRateLimited`), dan bukan detail: memeriksa
-- PIN lebih dulu berarti setiap percobaan membayar bcrypt, yang justru mengubah rate limiter jadi
-- alat menghabiskan CPU.
--
-- ORTU MANA PUN di keluarga itu berlaku. Keluarga bisa punya dua akun ortu, dan copy mockup
-- (*"Every child account belongs to a grown-up"*) tidak menunjuk salah satunya. Memaksa anak
-- mengingat "email ortu yang mana" menciptakan kegagalan yang tidak bisa dijelaskan layar.
--
-- `security definer` wajib: `auth.users` tidak terjangkau `authenticated`, apalagi `anon`.

create or replace function find_family_by_parent_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = public, extensions, auth, pg_temp
as $$
  select p.family_id
  from parents p
  join auth.users u on u.id = p.id
  -- Supabase menyimpan email lowercase, tapi yang mengetik adalah anak sembilan tahun di
  -- keyboard HP yang gemar mengapitalkan huruf pertama. Normalisasi di KEDUA sisi.
  where lower(trim(u.email)) = lower(trim(p_email))
  limit 1;
$$;

-- ── Pencarian anak ───────────────────────────────────────────────────────────

create or replace function find_child_by_parent_email(p_email text, p_pin text)
returns table (child_id uuid, family_id uuid, tier tier)
language sql
stable
security definer
-- `extensions` wajib: crypt() milik pgcrypto, dan pgcrypto tidak dipasang di `public`.
-- `auth` wajib: join ke auth.users.
set search_path = public, extensions, auth, pg_temp
as $$
  with m as (
    select c.id, c.family_id, c.tier
    from children c
    join parents p on p.family_id = c.family_id
    join auth.users u on u.id = p.id
    where lower(trim(u.email)) = lower(trim(p_email))
      and c.pin_hash = crypt(p_pin, c.pin_hash)
  )
  select m.id, m.family_id, m.tier
  from m
  -- Nol baris berarti salah satu dari: email tak dikenal, PIN salah, atau DUA anak sama-sama
  -- cocok — dan ketiganya memang harus menghasilkan jawaban yang sama persis di Edge Function.
  where (select count(*) from m) = 1;
$$;

-- Oracle PIN, keduanya: siapa pun yang boleh memanggilnya boleh menebak sepuasnya, dan rate
-- limiting hidup di Edge Function. Sama seperti verify_child_pin (0006) dan find_child_by_pin (0007).
revoke execute on function find_family_by_parent_email(text)       from public, anon, authenticated;
revoke execute on function find_child_by_parent_email(text, text)  from public, anon, authenticated;
grant  execute on function find_family_by_parent_email(text)       to service_role;
grant  execute on function find_child_by_parent_email(text, text)  to service_role;

-- ── Pintu lama ditutup ───────────────────────────────────────────────────────
--
-- `family_pin_taken()` (0007) TIDAK ikut dihapus — ia bukan jalur login, melainkan penjaga
-- keunikan PIN yang dipakai `create_child()` sejak 0021. ADR-0012 §A2 tetap berlaku penuh.

drop function if exists find_child_by_pin(text, text);

-- ── Catatan tentang family_code ──────────────────────────────────────────────
--
-- `families.family_code` TETAP ada, tetap `not null unique` (0001), dan tetap digenerate
-- `gen_family_code()` (0020) dengan alfabet tanpa-ambigu dari ADR-0023. Ia hanya turun jadi
-- pengenal internal — dan sengaja tidak disederhanakan, karena ia tetap benar kalau kode keluarga
-- kelak dipakai sebagai faktor kedua (lihat ADR-0024 §Konsekuensi 1) atau ditampilkan di Settings.

comment on column families.family_code is
  'Pengenal internal keluarga. BUKAN lagi kredensial login anak sejak ADR-0024 (31 Juli 2026) — '
  'anak masuk dengan email ortu + PIN. Format dikunci ADR-0023: 6 karakter, alfabet tanpa-ambigu.';
