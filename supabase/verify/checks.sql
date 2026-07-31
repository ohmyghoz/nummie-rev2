-- Nummi — pemeriksaan perilaku migrasi 0019–0021 di Postgres lokal.
--
-- Dijalankan `tools/verify-migrations.sh` SETELAH seluruh migrasi masuk. Setiap pemeriksaan
-- gagal keras (`raise exception`), jadi skripnya berhenti di kegagalan pertama alih-alih
-- mencetak tabel yang harus dibaca orang dengan teliti.
--
-- Yang diuji di sini adalah yang tidak bisa dijamin sintaks: apakah trigger sign up benar-benar
-- melahirkan tiga baris, apakah aturan PIN benar-benar menolak, dan apakah RLS `parent_profiles`
-- benar-benar memisahkan dua ortu.

\set ON_ERROR_STOP on

do $$
declare
  v_a uuid; v_b uuid; v_family uuid; v_code text; v_n int; v_child uuid;
begin
  -- ── 0020: sign up melahirkan keluarga ──────────────────────────────────────
  insert into auth.users (email, raw_user_meta_data)
  values ('sinta@verify.local',
          '{"full_name":"Bu Sinta","phone":"+628123","province":"Jawa Barat","city":"Kota Bandung"}')
  returning id into v_a;

  select p.family_id into v_family from parents p where p.id = v_a;
  if v_family is null then
    raise exception 'GAGAL 0020: sign up tidak membuat baris parents';
  end if;

  if not exists (select 1 from parent_profiles where parent_id = v_a and full_name = 'Bu Sinta'
                   and phone = '+628123' and country = 'ID' and city = 'Kota Bandung') then
    raise exception 'GAGAL 0020: parent_profiles tidak terisi dari raw_user_meta_data';
  end if;

  if not exists (select 1 from parents where id = v_a and is_primary) then
    raise exception 'GAGAL 0020: ortu pendaftar bukan is_primary';
  end if;

  -- ── 0020: bentuk family_code (ADR-0023) ────────────────────────────────────
  select family_code into v_code from families where id = v_family;
  if v_code !~ '^[23456789ABCDEFGHJKMNPQRTUVWXYZ]{6}$' then
    raise exception 'GAGAL 0020: family_code % di luar alfabet tanpa-ambigu 6 karakter', v_code;
  end if;

  -- ── 0019: country default saat metadata kosong ─────────────────────────────
  insert into auth.users (email, raw_user_meta_data)
  values ('kosong@verify.local', '{}') returning id into v_b;

  if not exists (select 1 from parent_profiles where parent_id = v_b and country = 'ID') then
    raise exception 'GAGAL 0019: country tidak jatuh ke default ID';
  end if;

  select count(distinct family_code) into v_n from families;
  if v_n < 2 then
    raise exception 'GAGAL 0020: dua pendaftaran tidak menghasilkan dua kode keluarga berbeda';
  end if;

  -- ── 0021: aturan PIN saat anak DIBUAT ──────────────────────────────────────
  begin
    perform create_child(v_family, 'PinPendek', 5, 2015, 'middle', '1234', '[]'::jsonb);
    raise exception 'GAGAL 0021: PIN 4 digit DITERIMA create_child';
  exception when others then
    if sqlerrm not like '%PIN harus 6 digit%' then raise; end if;
  end;

  select create_child(
    v_family, 'Arthur', 5, 2015, 'middle', '135790',
    '[{"name":"Unsorted","category":"unsorted","kind":"unsorted"},
      {"name":"Snacks","category":"spend","kind":"envelope"},
      {"name":"Free savings","category":"save","kind":"free_savings"},
      {"name":"Give","category":"give","kind":"give_pool"}]'::jsonb
  ) into v_child;
  if v_child is null then raise exception 'GAGAL 0021: PIN 6 digit yang sah ikut ditolak'; end if;

  begin
    perform create_child(v_family, 'Bima', 3, 2017, 'middle', '135790', '[]'::jsonb);
    raise exception 'GAGAL 0021: PIN kembar dalam satu keluarga DITERIMA (ADR-0012 A2)';
  exception when others then
    if sqlerrm not like '%sudah dipakai anggota keluarga lain%' then raise; end if;
  end;

  -- PIN sama di keluarga LAIN harus tetap boleh — keunikannya per keluarga, bukan global.
  if create_child(
       (select family_id from parents where id = v_b), 'Citra', 7, 2016, 'middle', '135790',
       '[{"name":"Unsorted","category":"unsorted","kind":"unsorted"},
         {"name":"Snacks","category":"spend","kind":"envelope"},
         {"name":"Free savings","category":"save","kind":"free_savings"},
         {"name":"Give","category":"give","kind":"give_pool"}]'::jsonb
     ) is null then
    raise exception 'GAGAL 0021: PIN sama di keluarga lain ikut ditolak';
  end if;

  raise notice 'OK  0019/0020/0021 — sign up, family_code, dan aturan PIN';
end $$;

-- ── 0022: login anak lewat EMAIL ORTU (ADR-0024) ─────────────────────────────
--
-- Blok terpisah supaya ia berdiri di atas keluarga yang sudah dibuat di atas: keluarga A
-- (sinta@verify.local) punya Arthur ber-PIN 135790; keluarga B (kosong@verify.local) punya Citra
-- dengan PIN yang sama — pasangan itu yang membuktikan pencarian benar-benar dipagari keluarga.

do $$
declare
  v_family_a uuid; v_second_parent uuid; v_n int; v_child uuid;
begin
  select family_id into v_family_a from parents
    where id = (select id from auth.users where email = 'sinta@verify.local');

  -- 1. Jalur bahagia.
  select count(*) into v_n from find_child_by_parent_email('sinta@verify.local', '135790');
  if v_n <> 1 then
    raise exception 'GAGAL 0022: email ortu + PIN benar mengembalikan % baris, harus 1', v_n;
  end if;

  select child_id into v_child from find_child_by_parent_email('sinta@verify.local', '135790');
  if (select family_id from children where id = v_child) <> v_family_a then
    raise exception 'GAGAL 0022: anak yang ditemukan bukan milik keluarga email itu';
  end if;

  -- 2. Normalisasi. Anak mengetik di keyboard HP yang gemar mengapitalkan huruf pertama.
  if (select count(*) from find_child_by_parent_email('  Sinta@Verify.Local  ', '135790')) <> 1 then
    raise exception 'GAGAL 0022: email tidak dinormalisasi (huruf besar / spasi)';
  end if;

  -- 3. Email tak dikenal → NOL BARIS, bukan galat. Bedanya penting: galat memberi tahu penebak
  --    bahwa ia menyentuh cabang yang berbeda.
  if (select count(*) from find_child_by_parent_email('tidakada@verify.local', '135790')) <> 0 then
    raise exception 'GAGAL 0022: email tak dikenal tidak menghasilkan nol baris';
  end if;

  -- 4. PIN salah pada email yang benar → nol baris juga.
  if (select count(*) from find_child_by_parent_email('sinta@verify.local', '000000')) <> 0 then
    raise exception 'GAGAL 0022: PIN salah tetap mengembalikan baris';
  end if;

  -- 5. PIN keluarga LAIN tidak boleh membuka keluarga ini. Citra memakai PIN yang sama persis,
  --    jadi tanpa pagar keluarga, uji ini yang akan menangkapnya.
  if (select count(*) from find_child_by_parent_email('kosong@verify.local', '135790')) <> 1 then
    raise exception 'GAGAL 0022: pencarian tidak dipagari keluarga';
  end if;

  -- 6. ORTU KEDUA di keluarga yang sama juga harus berlaku (ADR-0024: "ortu mana pun").
  --    Ortu kedua tidak lahir dari trigger sign up — ia diundang, jadi barisnya dibuat langsung
  --    di sini, persis seperti alur "undang ortu kedua" Tahap 2 no.10.
  insert into auth.users (email, raw_user_meta_data)
    values ('ayah@verify.local', '{"full_name":"Pak Ayah"}') returning id into v_second_parent;
  -- Trigger 0020 sudah membuatkannya keluarga sendiri; pindahkan ke keluarga A, seperti undangan.
  delete from families where id = (select family_id from parents where id = v_second_parent);
  insert into parents (id, family_id, display_name, is_primary)
    values (v_second_parent, v_family_a, 'Pak Ayah', false)
    on conflict (id) do update set family_id = excluded.family_id, is_primary = false;

  if (select count(*) from find_child_by_parent_email('ayah@verify.local', '135790')) <> 1 then
    raise exception 'GAGAL 0022: email ortu KEDUA tidak bisa dipakai anak masuk';
  end if;

  -- 7. Resolusi keluarga untuk rate limit — dipanggil SEBELUM hash disentuh.
  if find_family_by_parent_email('sinta@verify.local') <> v_family_a then
    raise exception 'GAGAL 0022: find_family_by_parent_email menunjuk keluarga yang salah';
  end if;
  if find_family_by_parent_email('tidakada@verify.local') is not null then
    raise exception 'GAGAL 0022: email tak dikenal harus menghasilkan null, bukan keluarga';
  end if;

  -- 8. Pintu lama benar-benar tertutup (ADR-0024 §Konsekuensi 4).
  if exists (
    select 1 from pg_proc where proname = 'find_child_by_pin'
  ) then
    raise exception 'GAGAL 0022: find_child_by_pin masih ada — dua pintu autentikasi';
  end if;

  raise notice 'OK  0022 — login anak lewat email ortu, termasuk ortu kedua & pagar keluarga';
end $$;

-- 9. PIN kembar tetap gagal TERTUTUP lewat jalur baru. Di luar blok DO karena ia butuh
--    `create_child` yang sengaja dilanggar aturannya — dan aturan itu justru yang menghalangi.
--    Anak kedua ber-PIN sama disisipkan langsung, meniru data yang sudah terlanjur ada sebelum
--    migrasi 0021 dipasang.
do $$
declare v_family_a uuid;
begin
  select family_id into v_family_a from parents
    where id = (select id from auth.users where email = 'sinta@verify.local');

  -- `extensions.` eksplisit: pgcrypto tidak dipasang di `public`, dan sesi psql biasa tidak
  -- punya `extensions` di search_path-nya (fungsi-fungsi migrasi menyetelnya sendiri).
  insert into children (family_id, name, birth_month, birth_year, tier, pin_hash)
  values (v_family_a, 'Kembar', 1, 2016, 'middle',
          extensions.crypt('135790', extensions.gen_salt('bf', 10)));

  if (select count(*) from find_child_by_parent_email('sinta@verify.local', '135790')) <> 0 then
    raise exception 'GAGAL 0022: dua anak ber-PIN sama TIDAK gagal tertutup — server menebak';
  end if;

  raise notice 'OK  0022 — PIN kembar gagal tertutup (penutup count(*) = 1 ikut terbawa)';
end $$;

-- ── 0019: RLS parent_profiles ───────────────────────────────────────────────
-- Di luar blok DO: `set local role` butuh transaksi eksplisit, dan RLS tidak berlaku bagi
-- superuser — jadi perannya harus benar-benar ditukar, bukan disimulasikan.

grant usage on schema public to authenticated;
grant select, update on parent_profiles to authenticated;

\set ON_ERROR_STOP off

begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"__A__","role":"authenticated"}';
  select case
    when (select count(*) from parent_profiles) = 1 then 'OK  RLS baca: 1 baris (miliknya saja)'
    else 'GAGAL RLS baca: ' || (select count(*) from parent_profiles)::text || ' baris terlihat'
  end as hasil;
commit;

begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"__A__","role":"authenticated"}';
  update parent_profiles set phone = 'DIBAJAK' where parent_id = '__B__';
  select case when not exists (select 1 from parent_profiles where phone = 'DIBAJAK')
    then 'OK  RLS tulis: profil ortu lain tidak tersentuh'
    else 'GAGAL RLS tulis: profil ortu lain BERUBAH' end as hasil;
commit;

begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"__A__","role":"authenticated"}';
  insert into parent_profiles (parent_id, full_name) values ('__A__', 'coba-sisip');
rollback;
\echo '(baris ERROR "permission denied for table parent_profiles" di atas = BENAR: tidak ada policy INSERT)'
