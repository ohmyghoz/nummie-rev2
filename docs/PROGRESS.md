# Laporan progres — 31 Juli 2026

Keadaan repo `nummie-rev2` per akhir sesi pertama. Branch
`claude/tahap-0-planning-readme-68soyl`, **14 commit**.

> **Ringkas:** seluruh **kode** Tahap 0 selesai dan terverifikasi sejauh yang bisa diverifikasi
> tanpa kredensial. Yang tersisa dari Tahap 0 bukan pekerjaan — melainkan **11 langkah
> pembuktian** yang butuh project Supabase & Vercel milik Ghozy. Tahap 1 sudah punya pijakan
> (inventaris 4 layar) dan **tidak diblokir keputusan apa pun.**

---

## 1. Sudah selesai & terbukti

Semua di bawah bisa dijalankan ulang siapa pun, kapan pun, tanpa kredensial.

### Gerbang yang hijau hari ini

| Perintah | Hasil |
|---|---|
| `pnpm test` | **223 passed** / 16 berkas — termasuk invarian I1 |
| `pnpm typecheck` | 2 paket bersih (`packages/core`, `apps/web` + `data/regions`) |
| `pnpm build` | Next build hijau, 4 route |
| `pnpm regions:build` | 38 provinsi, 514 kab/kota |
| `pnpm mockups:unpack` | 3 bundle dibuka, 1 HTML disalin |
| `pnpm inventory:check` | 22 jangkar inventaris cocok |
| `./tools/verify-migrations.sh` | **0001–0022 jalan bersih di Postgres 16 sungguhan** + 3 blok uji perilaku |

### Yang dibangun

| Area | Isi |
|---|---|
| **Engine** | `packages/core` ditransplantasi utuh — 223 test, tidak disentuh |
| **Database** | 22 migrasi. Tiga baru di Tahap 0 (**0019** profil ortu · **0020** trigger sign up · **0021** aturan PIN saat anak dibuat), satu dari keputusan MR-6 (**0022** login lewat email ortu) |
| **Web** | `apps/web` — Next App Router, 4 route placeholder, middleware `noindex`, 4 header keamanan, token desain diekstrak dari mockup |
| **Mockup** | `reference/mockups/` (read-only) + `reference/mockup-source/` (generated, bisa di-grep) |
| **Keputusan** | 24 ADR. **ADR-0023** auth ortu email+password (membatalkan 0022) · **ADR-0024** login anak email ortu (mengamandemen 0012) |
| **Data** | Dataset wilayah statis, atribusi ODbL terpasang |
| **Alat** | `unpack-mockups` · `build-regions` · `seed-dev` · `verify-migrations` · `check-inventory` |
| **CI** | 4 job GitHub Actions — build · migrasi · sinkronisasi berkas generated · kebocoran kunci |
| **Dokumen** | `README.md` · `DEPLOY.md` baru (lama diarsipkan) · `mockup-review.md` · 4 inventaris layar |

### Tiga cacat yang ditemukan dan ditutup

Ketiganya nyata, bukan hipotetis — dua di antaranya dibuktikan lolos di database tanpa perbaikan.

1. **`grep` ke mockup gagal DIAM.** Tiga mockup adalah bundle React; pencarian yang memuat kutip
   ganda mengembalikan **negatif palsu**. Protokol AGENTS.md §3a secara harfiah tidak bisa
   dipatuhi — sesi yang patuh mencari, tidak menemukan, lalu mengarang. → alat unpack + hasilnya
   ikut di-commit.
2. **`create_family()` tidak pernah ada.** Sign up publik tidak punya apa pun untuk dipanggil;
   ortu akan mendarat di app yang tidak mengenalnya, `auth_family_id()` null, setiap policy gagal
   tertutup, **tanpa satu pun pesan galat**. → migrasi 0020.
3. **`create_child()` tidak menegakkan aturan PIN.** 6 digit + unik per keluarga ditegakkan saat
   PIN *diganti*, bocor saat PIN *dibuat* — arah yang terbalik, karena pembuatan adalah jalur
   onboarding. Akibatnya bukan login tertukar melainkan **dua anak terkunci permanen** dari
   uangnya sendiri. → migrasi 0021.

---

## 2. Menanti kredensial — **11 langkah**

Tidak ada pekerjaan koding di sini. Ini pembuktian, dan hanya bisa dilakukan di project milikmu.
Runbook lengkap: [`DEPLOY.md`](DEPLOY.md) §3.

| # | Langkah | Bukti yang dicari |
|---|---|---|
| 1 | `supabase db push` | 0001–0022 jalan bersih |
| 2 | `supabase functions deploy child-login` | fungsi ACTIVE |
| 3 | `NUMMI_SEED_PROJECT_REF=<ref> pnpm seed:dev` | 1 baris di `families`/`parents`/`parent_profiles` |
| 4 | Periksa `family_code` | 6 karakter, tanpa `0 O 1 I L 5 S` |
| 5 | Sign up ortu lewat app | tiga baris lahir dari trigger, bukan kode app |
| 6 | **Login anak: email ortu + PIN** | ⚠️ bentuk paling baru — **belum pernah** jalan di Supabase mana pun |
| 6b | Login dengan email **ortu kedua** | juga berhasil (ADR-0024) |
| 7 | Login ortu email+password | masuk tanpa verifikasi email lebih dulu |
| 8 | Lupa password → email → set baru | **ini yang membuktikan SMTP hidup** |
| 9 | Buat anak dengan PIN 4 digit | **ditolak** — kalau lolos, 0021 belum masuk |
| 10 | Buat anak kedua PIN sama | **ditolak** — sama |
| 11 | Deploy Vercel | 4 route 200 + `X-Robots-Tag` |

Langkah 9 & 10 sekaligus jadi cara memastikan migrasinya benar-benar terpasang: keduanya
**terbukti lolos** di database tanpa 0021.

### Kenapa tidak bisa diakali di sesi ini

Sudah dicoba, bukan diasumsikan:

| Jalan | Hasil |
|---|---|
| Supabase lokal via Docker | daemon jalan, **tarikan image 403** (network policy) |
| Uji Edge Function via Deno | Deno tidak terpasang, dan `deno.land` + `jsr.io` **diblokir** |

Yang **bisa** dilakukan sudah dilakukan: migrasi diverifikasi di Postgres 16 sungguhan dengan stub
skema `auth`, termasuk perilaku sign up, aturan PIN, RLS, dan pencarian anak lewat email ortu.

**Batas yang jujur:** Postgres lokal bukan Supabase. Yang belum terbukti adalah trigger dipanggil
Supabase Auth sungguhan, pengiriman email, perilaku `service_role` di PostgREST, dan Edge Function
(yang tidak bisa dijalankan tanpa Deno). Karena itu **Definisi Selesai T0 belum dicentang.**

---

## 3. Keputusan — tidak ada yang menggantung

Tujuh konflik mockup ditemukan, semuanya terjawab. **Nol yang memblokir Tahap 1.**

| Diputuskan Ghozy | Hasil |
|---|---|
| **MR-6** login anak | **email ortu + PIN** (mockup menang atas ADR-0012) |
| **MR-2** format rupiah | **`Rp50.000`** — `formatRp()` dari core |
| **MR-7** warna kategori | **seragam** ke nilai kanonik anak & console |
| **MR-3** ragam Inggris | **Amerika** |

Tiga lagi (MR-1, MR-4, MR-5) ternyata sudah dijawab AGENTS.md sebelum sempat ditanyakan.

Menulis inventaris memunculkan tiga temuan tambahan — **MR-8** (layar Sort mockup hanya
mengimplementasikan mode Strict, sementara Flexible yang jadi default tidak pernah digambar) ·
**MR-9** (format nominal ketiga, `Rp 300k`) · **MR-10** (empat elemen digambar tanpa handler).
Tidak ada yang butuh keputusan sekarang; MR-10 dijawab saat layar Wallets diport.

### Satu harga yang perlu kamu ingat

Keputusan MR-6 memindahkan kunci rate limit dari kode acak 6 karakter ke **alamat email yang bisa
diketahui siapa saja**. Siapa pun yang tahu email seorang ortu bisa mengunci anaknya dari uangnya
sendiri, berulang-ulang, tanpa menebak apa pun.

Peredam sudah dipasang (lockout lapis keluarga 15 → 5 menit) dan hitungannya tertulis di ADR-0024.
**Itu peredam, bukan penutup** — masuk backlog **N-2**, ditandai *"sebelum uji publik"*, bukan
*"nanti"*.

---

## 4. Belum dikerjakan

### Tahap 1 — `/kid`

| | Status |
|---|---|
| Inventaris shell · Home · Sort · Wallets | ✅ siap diport |
| Inventaris Missions · Me + 7 push screen | ⏳ ditulis menjelang layarnya diport |
| Porting layar | ❌ belum dimulai — **nol layar diport** |
| Layar login `/kid` | ❌ harus **dirancang**, tidak ada di mockup mana pun (copy-nya sudah ada) |

Inventaris sengaja tidak ditulis sekaligus di muka: yang dibuat jauh sebelum dipakai akan basi
terhadap keputusan yang muncul di antaranya — dan ketiga temuan MR-8…MR-10 justru lahir karena
menulisnya pelan-pelan.

### Tahap 2–4

Belum disentuh. `/parent` + sign up (T2) · `/parent-web` (T3) · `/console` (T4).

Yang sudah siap menunggu mereka: tabel `parent_profiles`, trigger sign up, dataset wilayah untuk
dropdown dependent, dan `CONSOLE_ADMIN_EMAILS` di `.env.example`.

---

## 5. Yang perlu kamu lakukan berikutnya

1. **Buat project Supabase**, jalankan runbook `DEPLOY.md` §3 langkah 1–10.
2. **Buat project Vercel** (root `apps/web`) — langkah 11.
3. Sesudah itu Tahap 0 boleh dicentang, dan Tahap 1 bisa dimulai dari inventaris yang sudah ada.

Sebelum menyentuh project sungguhan, jalankan yang gratis dulu:
`./tools/verify-migrations.sh` — migrasi yang salah paling murah ditemukan di situ.

⚠️ Satu hal operasional yang mudah terlewat: **SMTP sendiri wajib** sebelum langkah 8. Pengirim
bawaan Supabase dibatasi ketat dan ditujukan untuk pengembangan.
