-- Nummi — profil ortu, bahan pendaftaran publik (ADR-0023).
--
-- Di dunia OTP (ADR-0022, dibatalkan), `parents` cukup: akun dibuat tangan lewat Admin API, dan
-- satu-satunya yang perlu diketahui tentang seorang ortu adalah bahwa ia ada. Pendaftaran terbuka
-- mengubah itu — formulirnya menanyakan nama, telepon, dan wilayah, dan jawabannya harus punya
-- tempat tinggal.
--
-- KENAPA TABEL TERPISAH, BUKAN KOLOM DI `parents`:
--
-- `parents` adalah tabel KEANGGOTAAN — ia menjawab "akun auth mana milik keluarga mana, dan siapa
-- yang primer". Setiap barisnya dipakai `auth_family_id()` (0002/0004) di JALUR PANAS setiap
-- pemeriksaan RLS, untuk setiap query, oleh setiap pengguna.
--
-- Nama, telepon, dan wilayah tidak pernah ikut menentukan akses. Menaruhnya di `parents` berarti
-- menebalkan baris yang dibaca ribuan kali demi kolom yang dibaca saat membuka Settings.
--
-- Alasan kedua yang lebih penting: telepon + wilayah adalah PII. Dipisahkan, ia bisa dicabut,
-- di-audit, dan diberi kebijakan sendiri tanpa menyentuh tabel yang menjaga akses. UU PDP 27/2022
-- membuat pembedaan itu bukan kerapian, tapi kewajiban yang harus bisa ditunjuk.

create table parent_profiles (
  parent_id   uuid primary key references parents(id) on delete cascade,

  full_name   text,
  phone       text,

  -- Kode negara ISO 3166-1 alpha-2. Default 'ID' bukan asumsi bahwa semua ortu orang Indonesia —
  -- ia default formulir (nummi-web-plan.md Tahap 2 no.1), dan kolomnya menerima yang lain.
  country     text not null default 'ID',

  -- SENGAJA `text`, bukan foreign key ke tabel wilayah.
  --
  -- Dataset wilayah (`data/regions/`) di-bundle sebagai JSON statis, bukan tabel — tanpa API
  -- eksternal, sesuai rencana Tahap 0 no.9. Tiga akibat yang membuat FK jadi pilihan yang salah:
  --
  --   1. Negara != Indonesia -> provinsi & kota jadi TEKS BEBAS (Tahap 2 no.1). FK akan menolak
  --      "Selangor" dan mengunci ortu di luar Indonesia dari formulirnya sendiri.
  --   2. Daftar wilayah Kemendagri berubah — pemekaran itu nyata dan berkala. FK mengubah
  --      pemekaran jadi migrasi; teks membuatnya jadi pembaruan berkas JSON.
  --   3. Yang disimpan adalah apa yang ORTU pilih saat mendaftar. Kalau kabupatennya dimekarkan
  --      tahun depan, jawabannya tidak berubah surut jadi salah.
  --
  -- Validasi terhadap daftar dilakukan di formulir, tempat ortu masih bisa memperbaikinya.
  province    text,
  city        text,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── updated_at ────────────────────────────────────────────────────────────────
-- Dijaga trigger, bukan aplikasi: kolom yang diperbarui hanya kalau penulisnya ingat akan
-- berbohong di jalur tulis pertama yang lupa.

create or replace function touch_parent_profile()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger parent_profiles_touch
  before update on parent_profiles
  for each row execute function touch_parent_profile();

-- ── RLS ───────────────────────────────────────────────────────────────────────
-- Pola sama dengan 0002: tidak ada aturan akses yang hidup di sisi klien.

alter table parent_profiles enable row level security;

-- Ortu melihat & mengubah profilnya SENDIRI — bukan profil ortu kedua di keluarganya.
--
-- Sengaja lebih sempit daripada `auth_family_id()` yang dipakai tabel lain. Ortu kedua adalah
-- orang lain, dan nomor teleponnya bukan data keluarga bersama. Kalau layar "undang ortu kedua"
-- (Tahap 2 no.10) ternyata perlu menampilkan namanya, yang ditambah adalah view sempit berisi
-- nama saja — bukan pelonggaran kebijakan ini.
create policy parent_profile_self_read on parent_profiles for select
  using (parent_id = auth.uid());

create policy parent_profile_self_update on parent_profiles for update
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

-- Tidak ada policy INSERT dan itu disengaja. Baris ini dibuat trigger pendaftaran (0020) yang
-- berjalan `security definer` dan melewati RLS. Klien tidak pernah punya alasan membuatnya
-- sendiri — kalau ia bisa, ia bisa membuat baris untuk `parent_id` milik orang lain.

-- Anak tidak pernah menyentuh tabel ini: tidak ada policy yang menyebut `auth_child_id()`,
-- jadi JWT anak (ADR-0012) tidak cocok dengan satu pun aturan di atas.
