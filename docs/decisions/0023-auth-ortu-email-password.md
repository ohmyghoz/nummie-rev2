# ADR-0023 — Auth ortu: email + password + reset, pendaftaran terbuka

**Status:** ✅ diputuskan 31 Juli 2026 · **membatalkan
[ADR-0022](0022-auth-ortu-otp-tanpa-password.md)** (OTP tanpa password) ·
melengkapi [ADR-0012](0012-auth-anak-kode-keluarga-pin.md) (yang mengatur sisi anak)

## Konteks — apa yang berubah, bukan apa yang rusak

ADR-0022 tidak salah saat ditulis. Ia dibangun di atas satu fakta yang sekarang sudah lewat:
**pendaftaran tertutup.** Argumen terkuatnya berbunyi begini — permintaan kode dikirim dengan
`create_user: false`, jadi hanya email yang akunnya sudah dibuat lebih dulu yang bisa masuk, dan
uji tertutup ditegakkan oleh jawaban server alih-alih dengan menyembunyikan tautan daftar.

Kalimat itu berhenti berlaku begitu pendaftaran dibuka. `create_user: false` berubah dari gerbang
menjadi penghalang: ia mencegah persis orang yang sekarang kita undang. Dan begitu pintunya harus
dibuka, dua alasan yang tersisa ikut runtuh — "halaman daftar tidak perlu dibangun" berubah jadi
"halaman daftar wajib ada", dan "jawaban seragam untuk email terdaftar dan asing" tidak lagi
melindungi apa pun ketika siapa saja memang boleh mendaftar.

Yang tersisa dari 0022 hanyalah biayanya: email jadi jalur kritis. Membayar biaya untuk manfaat
yang sudah tidak ada adalah alasan yang cukup untuk membatalkannya.

## Keputusan

**Auth ortu = email + password, dengan alur reset password, dan pendaftaran publik terbuka.**

1. **Sign up publik.** Email · password · nama · nomor telepon · negara (default Indonesia) ·
   provinsi · kota/kabupaten. Siapa pun boleh mendaftar; tidak ada allowlist.
2. **Langsung masuk setelah daftar.** Verifikasi email berjalan di belakang dan **tidak
   memblokir** pemakaian.
3. **Lupa password → email reset → set password baru.** Alur lengkap, diuji, bukan ditunda.
4. **Sisi anak tidak berubah** — ADR-0012 tetap berlaku sepenuhnya. Ortu dan anak masuk lewat
   jalur yang berbeda, dan memang harus berbeda: anak tidak punya email.

## Kenapa

**Verifikasi email tidak memblokir — dan ini keputusan, bukan kelalaian.** Ortu yang salah ketik
alamat email saat mendaftar tetap bisa memakai app; yang hilang darinya adalah jalur pemulihan
password, bukan produknya. Memblokir di depan berarti setiap kesalahan ketik menjadi tiket
dukungan sebelum satu rupiah pun pernah masuk — dan ADR-0022 sudah mencatat siapa yang menangani
tiket itu: satu founder yang bekerja kantoran.

**Password punya jalur pemulihan yang dimiliki sendiri.** Ini pembalikan langsung dari argumen
0022 ("tidak ada password berarti tidak ada yang bisa dilupakan"). Yang tidak dihitung 0022:
tanpa password, **setiap** login butuh email yang berfungsi — bukan hanya login pemulihan. Email
yang mati berarti terkunci permanen, bukan sekadar tidak nyaman. Dengan password, email hanya
dibutuhkan saat pemulihan. Jalur kritisnya menyempit dari "setiap kali masuk" jadi "saat lupa".

**Argumen PWA milik 0022 tidak hilang — ia berpindah, dan menyempit.** ADR-0022 memilih kode
alih-alih magic link karena magic link membuka browser bawaan aplikasi email, sehingga cookie
mendarat di konteks yang salah dan ortu terkunci di luar PWA yang baru dipasangnya. Persoalan yang
sama berlaku untuk tautan reset password di sini. Bedanya: dulu ia mengenai **setiap** login,
sekarang hanya alur reset. Konsekuensinya diambil sadar — tautan reset boleh membuka browser mana
pun, karena yang dituju adalah **menetapkan password baru**, bukan mendarat di sesi yang berumur
panjang. Setelah password diganti, ortu kembali ke PWA-nya dan masuk di sana.

## Format `family_code`

**6 karakter, alfabet tanpa-ambigu: `23456789ABCDEFGHJKMNPQRTUVWXYZ`** — tanpa `0·O`, `1·I·L`,
`5·S`. Pencocokan tetap case-insensitive, seperti yang sudah dilakukan migrasi 0007
(`upper(f.family_code) = upper(p_family_code)`).

Sampai ADR ini, formatnya tidak pernah dikunci di mana pun — satu-satunya jejaknya `'NUMMI1'` di
`supabase/seed.sql`, sebuah nilai seed, bukan aturan. Sign up publik memaksa keputusannya, karena
kode itu kini digenerate mesin alih-alih diketik tangan saat menyiapkan keluarga uji.

**Kenapa tanpa-ambigu, padahal mungkin tidak pernah dilihat siapa pun.** Ada konflik terbuka soal
apakah anak mengetik kode keluarga atau email ortu — MR-6 di `docs/mockup-review.md`, dan ia belum
diputuskan. Alfabet tanpa-ambigu adalah harga nol yang membuat kedua hasil aman: kalau MR-6
berakhir dengan kode keluarga terlihat, ia sudah tahan-salah-baca untuk anak 9–12 yang menyalin
dari layar ortu; kalau berakhir dengan email ortu, tidak ada yang terbuang. Keputusan yang murah
di kedua cabang diambil sekarang, bukan ditunda.

**Kenapa bukan berurut (`NUMMI1`, `NUMMI2`).** Kode berurut bisa ditebak. ADR-0012 §Harga sudah
mencatat bahwa siapa pun yang tahu kode keluarga bisa membebani rate limit keluarga itu —
membuatnya bisa dihitung dari nol mengubah harga yang diambil sadar menjadi harga yang tidak
pernah disetujui. ≈30⁶ ≈ 729 juta kombinasi; tabrakan ditangani retry di atas `unique` yang sudah
ada sejak migrasi 0001.

## Yang dibawa dari ADR-0022

Dibatalkannya sebuah ADR tidak membatalkan semua yang ada di dalamnya. Yang tetap berlaku:

- **Ganti PIN anak** (`set_child_pin()`, migrasi 0018) dan pembedaan yang dijaganya:
  **ortu MENGGANTI, tidak pernah MELIHAT.** PIN tetap milik anak; ortu adalah jalur pemulihan,
  bukan pengintai.
- **SMTP sendiri tetap syarat operasional.** Pengirim bawaan Supabase dibatasi ketat dan
  ditujukan untuk pengembangan. Bedanya dengan dunia 0022: kalau SMTP mati sekarang, yang berhenti
  adalah pendaftaran & reset — bukan seluruh pintu masuk.
- **`family_pin_taken_for_other()`** dan alasannya (versi lama menghitung anak yang sedang
  diganti, jadi ortu yang mengetik ulang PIN yang sama ditolak dengan alasan keliru).
- **Jalan darurat lewat dashboard Supabase** kalau konfigurasi email membuat founder terkunci.

## Konsekuensi

**Ada yang harus dibangun, yang di dunia 0022 memang tidak perlu ada:** halaman sign up, halaman
lupa password, halaman set password baru. Ini yang dicatat AGENTS.md §3 sebagai deviasi **D-D** —
tidak ada di mockup, jadi bentuknya mengikuti gaya mockup parent sementara alurnya baru.
Spesifikasinya di `nummi-web-plan.md` Tahap 2.

**Password menjadi milik kita untuk dijaga.** Supabase Auth yang menyimpan dan meng-hash — tidak
pernah ada tabel password buatan sendiri, dan `pin_hash` anak tetap terpisah di jalurnya sendiri
(pgcrypto, migrasi 0006). Dua rahasia, dua mekanisme, nol persinggungan.

**Sign up harus membuat lebih dari satu baris.** Di dunia 0022, `families` + `parents` dibuat
tangan lewat Admin API — kodenya tidak pernah ada, dan pemeriksaan ADR-0022 mengonfirmasinya
(1 akun auth, 1 baris `parents`). Pendaftaran publik tidak punya apa pun untuk dipanggil:
`create_child()` ada, `create_family()` tidak. Migrasi **0020** menutupnya dengan trigger
`SECURITY DEFINER` di atas `auth.users` yang membuat `families` (kode digenerate) + `parents` +
`parent_profiles` dalam **satu transaksi** — alasan yang sama dengan migrasi 0012: separuh jadi
tidak boleh mungkin, karena ledger append-only membuat pembersihannya mustahil.

**Pendaftaran terbuka berarti akun sampah mungkin.** Diterima untuk sekarang: keluarga tanpa anak
tidak menyentuh uang siapa pun, dan ADR-0021 sudah menetapkan console tidak boleh membawa service
role ke klien, jadi pembersihannya pekerjaan operator, bukan fitur produk.

## Yang membatalkan ADR ini

Penyalahgunaan pendaftaran terbuka jadi nyata (butuh verifikasi memblokir atau captcha) ·
password terbukti jadi hambatan masuk terbesar pada uji ortu Indonesia · atau distribusi berubah
ke native, yang membuat seluruh perhitungan konteks-browser di sini layak dihitung ulang.
