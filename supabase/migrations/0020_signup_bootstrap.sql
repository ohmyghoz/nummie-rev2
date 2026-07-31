-- Nummi — pendaftaran ortu membuat keluarganya sendiri (ADR-0023).
--
-- LUBANG YANG DITUTUP BERKAS INI:
--
-- `create_child()` ada sejak 0012. `create_family()` tidak pernah ada — dan tidak pernah perlu
-- ada, karena di dunia OTP `families` + `parents` diisi tangan lewat Admin API saat menyiapkan
-- keluarga uji. Pemeriksaan ADR-0022 mengonfirmasi bentuknya: 1 akun auth, 1 baris `parents`.
--
-- Pendaftaran publik tidak punya tangan. Tanpa berkas ini, sign up berhasil di Supabase Auth lalu
-- mendarat di app yang tidak mengenalnya: `auth_family_id()` (0002) mengembalikan null, setiap
-- policy RLS gagal tertutup, dan ortu melihat app kosong tanpa satu pun pesan galat.
--
-- SATU TRANSAKSI, dengan alasan yang sama seperti 0012: separuh jadi tidak boleh mungkin. Trigger
-- yang gagal di langkah ketiga akan meninggalkan akun auth tanpa keluarga — dan tidak ada
-- "coba lagi", karena email-nya sudah terpakai.

-- ── Generator kode keluarga ───────────────────────────────────────────────────
--
-- Formatnya dikunci ADR-0023: 6 karakter, alfabet tanpa-ambigu.
--
-- Yang DIBUANG dan kenapa: 0/O, 1/I/L, 5/S. Anak 9–12 yang menyalin kode dari layar ortu tidak
-- boleh bisa salah baca — dan konflik MR-6 (`docs/mockup-review.md`) yang menentukan apakah kode
-- ini benar-benar diketik anak MASIH TERBUKA. Alfabet tanpa-ambigu adalah harga nol yang aman di
-- kedua cabang: berguna kalau ia jadi terlihat, tidak merugikan kalau tidak.
--
-- Bukan berurut (`NUMMI1`, `NUMMI2`) — kode berurut bisa dihitung dari nol, dan ADR-0012 §Harga
-- mencatat siapa pun yang tahu kode keluarga bisa membebani rate limit keluarga itu. Itu harga
-- yang diambil sadar untuk kode yang harus DITEBAK, bukan untuk kode yang bisa DIURUTKAN.
--
-- 30^6 ≈ 729 juta. Bukan rahasia, dan tidak dimaksudkan jadi rahasia — PIN yang menjaga pintunya
-- (ADR-0012), kode keluarga hanya menunjuk keluarga mana.

create or replace function gen_family_code()
returns text
language plpgsql
volatile
set search_path = public, extensions, pg_temp
as $$
declare
  v_alphabet constant text := '23456789ABCDEFGHJKMNPQRTUVWXYZ';
  v_code text;
  v_try  int := 0;
begin
  loop
    v_code := '';
    for i in 1..6 loop
      -- `gen_random_bytes` (pgcrypto), bukan random(): random() bisa diprediksi dari seed-nya,
      -- dan kode yang bisa dihitung persis yang dihindari di atas.
      v_code := v_code || substr(
        v_alphabet,
        (get_byte(gen_random_bytes(1), 0) % length(v_alphabet)) + 1,
        1
      );
    end loop;

    exit when not exists (select 1 from families f where upper(f.family_code) = v_code);

    v_try := v_try + 1;
    -- Menyerah setelah 50 percobaan. Dengan 729 juta kombinasi ini tidak akan pernah tercapai
    -- oleh tabrakan wajar — kalau ia tercapai, yang rusak bukan keberuntungan, dan gagal keras
    -- lebih baik daripada berputar selamanya di dalam trigger pendaftaran.
    if v_try >= 50 then
      raise exception 'gen_family_code: gagal menemukan kode unik setelah % percobaan', v_try;
    end if;
  end loop;

  return v_code;
end;
$$;

-- ── Trigger pendaftaran ───────────────────────────────────────────────────────

create or replace function handle_new_parent_signup()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_family uuid;
  v_meta   jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_name   text  := nullif(trim(v_meta ->> 'full_name'), '');
begin
  -- Idempoten. Trigger `auth.users` bisa terpanggil ulang saat pemulihan atau impor, dan
  -- pendaftaran yang diulang tidak boleh melahirkan keluarga kedua untuk orang yang sama.
  if exists (select 1 from parents p where p.id = new.id) then
    return new;
  end if;

  insert into families (name, family_code)
  values (
    -- Nama keluarga bisa diganti ortu belakangan; yang penting ia tidak pernah kosong.
    coalesce(v_name, split_part(new.email, '@', 1)) || '''s family',
    gen_family_code()
  )
  returning id into v_family;

  insert into parents (id, family_id, display_name, is_primary)
  values (new.id, v_family, v_name, true);

  insert into parent_profiles (parent_id, full_name, phone, country, province, city)
  values (
    new.id,
    v_name,
    nullif(trim(v_meta ->> 'phone'), ''),
    -- Formulir sign up mengirim ini di `options.data`. Kalau tidak ada — mis. akun dibuat lewat
    -- Admin API atau `seed:dev` — default 'ID' milik kolomnya yang berlaku (0019).
    coalesce(nullif(trim(v_meta ->> 'country'), ''), 'ID'),
    nullif(trim(v_meta ->> 'province'), ''),
    nullif(trim(v_meta ->> 'city'), '')
  );

  return new;
end;
$$;

-- `after insert`, bukan `before`: `parents.id` mereferensikan `auth.users(id)` (0001), jadi
-- barisnya harus sudah ada sebelum kita menunjuknya.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_parent_signup();

-- Trigger dipanggil Supabase Auth atas nama pemiliknya sendiri, tidak pernah oleh klien.
-- Dibiarkan bisa dipanggil `authenticated` berarti siapa pun yang sudah masuk bisa mencoba
-- menjalankannya di luar konteks trigger.
revoke execute on function handle_new_parent_signup() from public, anon, authenticated;

-- `gen_family_code()` juga: ia bukan rahasia, tapi memanggilnya berulang-ulang membuat setiap
-- percobaan menyentuh `families`. Tidak ada alasan klien membutuhkannya.
revoke execute on function gen_family_code() from public, anon, authenticated;
grant  execute on function gen_family_code() to service_role;
