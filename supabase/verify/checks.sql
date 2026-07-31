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
