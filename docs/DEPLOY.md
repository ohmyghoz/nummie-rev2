# Deploy — satu project Vercel + satu project Supabase

> Ditulis 31 Juli 2026 (Tahap 0), menggantikan versi OTP/3-project yang kini di
> [`archive/DEPLOY-otp-3project.md`](archive/DEPLOY-otp-3project.md).
>
> Ini bukan tutorial Vercel. Isinya **yang khusus repo ini** — terutama jebakan yang sudah
> ditemukan sekali, supaya tidak ditemukan dua kali. Sebagian besar diwarisi dari repo lama;
> di sana harganya sudah dibayar.

## Bentuknya

| | Repo lama | **Repo ini** |
|---|---|---|
| Project Vercel | 3 (`kid`, `parent`, `console`) | **1**, root `apps/web` |
| Route | 3 origin terpisah | `/kid` `/parent` `/parent-web` `/console` |
| Auth ortu | OTP tanpa password (ADR-0022) | **email + password + reset** (ADR-0023) |
| Auth anak | kode keluarga + PIN (ADR-0012) | **email ortu + PIN** (ADR-0024) |

Satu project dipilih di AGENTS.md §5. Konsekuensi yang perlu diketahui sejak awal: **`/console`
kini satu origin dengan app keluarga.** Ia tidak lagi dilindungi oleh "beda project, beda
setelan" — pemisahannya harus datang dari allowlist email admin dan route handler server
(Tahap 4, ADR-0021), bukan dari topologi deploy.

---

## 1. Supabase

Region **Singapore** (latensi Indonesia). Detail project & MCP: [`../supabase/README.md`](../supabase/README.md).

```bash
supabase link --project-ref <ref>
supabase db push          # menjalankan 0001–0022 berurutan
supabase functions deploy child-login
```

Sebelum menyentuh project sungguhan, jalankan dulu yang gratis:

```bash
./tools/verify-migrations.sh
```

Ia membangun Postgres lokal bersih + stub skema `auth`, menjalankan 0001–0022, lalu **menguji
perilakunya** (sign up melahirkan 3 baris · `family_code` sesuai alfabet · aturan PIN menolak ·
RLS `parent_profiles` memisahkan dua ortu). Migrasi yang salah paling murah ditemukan di sini.

### Email — jalur kritis, tapi lebih sempit dari dulu

ADR-0022 menjadikan email jalur setiap login. **ADR-0023 menyempitkannya jadi hanya alur reset
password.** Kalau email mati sekarang, yang berhenti adalah pendaftaran & reset — bukan seluruh
pintu masuk.

Tetap wajib sebelum keluarga pertama diundang:

| Setelan | Kenapa |
|---|---|
| **SMTP sendiri** (Resend/Postmark/sejenis) | Pengirim bawaan Supabase dibatasi ketat & ditujukan untuk pengembangan |
| **Redirect URL** memuat domain produksi | Tautan reset yang tidak terdaftar akan ditolak Supabase |
| **Email confirmation TIDAK memblokir** | ADR-0023: ortu langsung masuk setelah daftar; verifikasi jalan di belakang |

⚠️ **Tautan reset boleh membuka browser mana pun, dan itu disengaja.** ADR-0022 menolak magic link
karena membuka browser bawaan aplikasi email, sehingga cookie mendarat di luar PWA. Di sini yang
dituju adalah **menetapkan password baru**, bukan mendarat di sesi berumur panjang — setelah
password diganti, ortu kembali ke PWA-nya dan masuk di sana.

**Jalan darurat kalau kamu terkunci:** dashboard Supabase bisa membuat magic link manual untuk
sebuah akun. Ketahui ini sebelum butuh.

---

## 2. Vercel

**Add New → Project → import repo**, sekali. **Root Directory = `apps/web`.**

⚠️ **"Include source files outside of the Root Directory" harus MENYALA.** Satu-satunya setelan
yang mengubah build ini dari "berhasil" jadi `Module not found`. Sebabnya: `@core`, `@copy`, dan
`@regions` **bukan package npm** — ketiganya dijangkau lewat alias tsconfig ke berkas **dua
tingkat di atas** root directory. `next.config.mjs` sudah menyetel `outputFileTracingRoot` ke root
repo untuk sisi Next-nya, tapi toggle Vercel menentukan berkas mana yang sampai ke disk sejak
awal — dan tidak ada apa pun di repo yang bisa memaksanya.

Framework Preset terdeteksi otomatis. Build & Install Command biarkan default.

### Environment variables

Isi sesuai [`.env.example`](../.env.example):

| Nama | Catatan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ikut ke browser |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ikut ke browser — wajar, RLS yang menjaga |
| `SUPABASE_SECRET_KEY` | **server saja.** Sejak migrasi 0009 ia satu-satunya jalan menulis ledger |
| `CONSOLE_ADMIN_EMAILS` | Tahap 4 |

⚠️ **`NEXT_PUBLIC_*` harus ada SEBELUM build pertama, bukan sesudah.** Next **menanamkan**
nilainya saat build. Kalau belum ada, kode menerima `undefined` dan penukaran refresh token
**diam-diam tidak pernah terjadi** — ortu terlempar ke layar masuk tiap ~1 jam tanpa satu pun galat
muncul di mana pun. Ini kegagalan senyap. Kalau env ditambahkan belakangan, **redeploy**.

⚠️ **Jangan pernah menamai kunci rahasia berawalan `NEXT_PUBLIC_`.** Salah nama satu kali
menerbitkannya ke setiap pengunjung.

**JANGAN** setel `CHILD_JWT_SECRET` di Vercel — ia milik Edge Function yang berjalan di Supabase.

### Deployment Protection

Nyalakan selama pengembangan. **Matikan untuk uji keluarga** — kalau tidak, ortu dan anak tidak
bisa masuk sama sekali. Yang menjaga datanya adalah auth + RLS, bukan kerahasiaan URL.

⚠️ Begitu ia mati, `/console` ikut bisa dijangkau siapa pun yang tahu alamatnya, karena kini satu
origin. **Tahap 4 tidak boleh dianggap selesai tanpa allowlist admin yang ditegakkan server.**

### Header keamanan

Sudah di `apps/web/next.config.mjs` + `middleware.ts`, bukan di dashboard — setelan dashboard
tidak ikut dalam git, tidak ikut saat project dibuat ulang, dan tidak berlaku di `pnpm dev`.

- `X-Robots-Tag: noindex, nofollow` — mencegah terindeks, **bukan** mencegah diakses
- `Content-Security-Policy: frame-ancestors 'none'` — `/parent` memuat tombol **Approve** yang
  memindahkan uang; tanpa ini ia sasaran clickjacking
- `X-Content-Type-Options: nosniff` · `Referrer-Policy: no-referrer`

---

## 3. Runbook verifikasi Tahap 0

Definisi Selesai T0 punya dua belas butir. **Enam sudah terbukti di repo** dan bisa kamu ulang
sendiri; sisanya butuh kredensial dan menunggu kamu.

### Sudah terbukti (jalankan ulang kapan saja)

```bash
pnpm install
pnpm test                     # 223 passed (223), 16 berkas — termasuk invariant I1
pnpm typecheck                # packages/core + apps/web + data/regions
pnpm mockups:unpack           # 3 bundle dibuka, 1 HTML biasa disalin
pnpm regions:build            # 38 provinsi, 514 kab/kota — gagal keras kalau meleset
pnpm build                    # Next build hijau
./tools/verify-migrations.sh  # 0001–0022 di Postgres lokal + uji perilaku
```

### Butuh kamu — belum terverifikasi

Bukan dibaca, **dicoba**. Repo lama sudah tiga kali kena fitur yang "ada" tapi tidak pernah
menyala (RLS rekursif, view yang melewati RLS, rate limit yang tak pernah menghitung).

| # | Langkah | Bukti yang dicari |
|---|---|---|
| 1 | `supabase db push` ke project baru | 0001–0022 jalan bersih, nol galat |
| 2 | `supabase functions deploy child-login` | fungsi ACTIVE |
| 3 | `NUMMI_SEED_PROJECT_REF=<ref> pnpm seed:dev` | mencetak email ortu + PIN; `families`/`parents`/`parent_profiles` masing-masing dapat **satu** baris |
| 4 | Periksa `family_code` di database | 6 karakter, **tanpa** `0 O 1 I L 5 S` (ADR-0023). Kini pengenal internal — bukan lagi kredensial login (ADR-0024) |
| 5 | Sign up ortu lewat app | tiga baris lahir otomatis — trigger 0020 yang membuatnya, bukan kode app |
| 6 | Login anak: **email ortu + PIN** (ADR-0024) | Edge Function menjawab JWT ber-claim. Payload `{ parentEmail, pin }` — bentuk ini **belum pernah** jalan di Supabase mana pun |
| 6b | Login anak dengan email **ortu kedua** di keluarga yang sama | juga berhasil — ADR-0024 menetapkan ortu mana pun berlaku |
| 7 | Login ortu: email + password | masuk tanpa verifikasi email lebih dulu (ADR-0023) |
| 8 | Lupa password → email sampai → set password baru → masuk | **ini yang membuktikan SMTP hidup** |
| 9 | Coba buat anak dengan PIN 4 digit | **ditolak** (0021). Kalau lolos, migrasi 0021 belum jalan |
| 10 | Coba buat anak kedua dengan PIN sama | **ditolak**. Kalau lolos, kedua anak akan terkunci permanen dari uangnya sendiri |
| 11 | Deploy Vercel → buka 4 route | 200, dan `curl -I` menunjukkan `X-Robots-Tag: noindex` |

Langkah 6 juga bukan formalitas: payload `{ parentEmail, pin }` baru ditulis 31 Juli 2026 dan
belum pernah menyentuh Supabase mana pun — yang sudah terbukti hanya RPC yang dipanggilnya.

Langkah 9 dan 10 bukan formalitas: keduanya **terbukti lolos** di database tanpa migrasi 0021
(lihat `supabase/README.md` §Audit). Kalau di project barumu keduanya ikut lolos, migrasinya
belum masuk.

⚠️ **Definisi Selesai T0 belum boleh dicentang** sebelum 1–11 (termasuk 6b) lolos. Yang sudah terbukti di repo
tidak menggantikan ini — Postgres lokal bukan Supabase, dan `pnpm build` bukan deploy.

---

## Yang belum diputuskan dan menyentuh deploy

- **MR-6** (`mockup-review.md`) — pengenal login anak: kode keluarga (ADR-0012) atau email ortu
  (mockup). Menentukan bentuk `child-login`, jadi **putuskan sebelum Tahap 1**.
- **Koneksi git ↔ Vercel.** Di repo lama ia tidak pernah terpasang, jadi deploy manual dan tidak
  ada preview per-PR. Layak dibereskan sekali di browser (Vercel → project → Settings → Git).
