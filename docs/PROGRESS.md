# Laporan progres — 1 Agustus 2026

Sesi ini menyambung dari Tahap 0 (selesai & dicentang 31 Juli — lihat riwayat git untuk
laporan lama). Ghozy minta Tahap 1 lalu Tahap 2 dikerjakan semalam, tanpa pengawasan.
Dikerjakan sejauh protokol AGENTS.md §3 (ekstrak → inventaris → port → verifikasi
berdampingan) memungkinkan dalam satu sesi — **bukan keduanya selesai**, dan berkas ini
bilang persis sejauh mana.

> **Ringkas:** `/kid` (login·Home·Sort·Wallets) dan `/parent` (sign up·onboarding·dashboard·
> approval inbox) hidup di atas Supabase sungguhan, diverifikasi berdampingan di browser —
> dan **keduanya benar-benar tersambung**: keluarga yang dibuat lewat sign up ortu sungguhan
> bisa login sebagai anak di `/kid` dan melihat akunnya sendiri. Sisa layar `/kid` (8 area) dan
> sisa `/parent` (Send/Take, Money rules, Settings, Jobs/Prizes, Transactions) **belum
> disentuh**. Tiga cacat produksi nyata ditemukan & ditutup di jalan — dua di antaranya akan
> menggigit siapa pun yang mencoba deploy tanpanya, bukan cuma sesi ini.

---

## 1. Yang hidup & terverifikasi berdampingan

Bukan "lolos typecheck" — dicoba di `pnpm dev` + Chrome, dengan data nyata, dan hasilnya
dicocokkan ke `docs/inventory/*.md` (untuk `/kid`) atau `parent-mobile.markup.html` (untuk
`/parent`, sejauh ADR-0023 tidak menggantinya — lihat §2).

### `/kid`

| Layar | Sumber | Bukti |
|---|---|---|
| **Login** | dirancang (T1.1, tidak ada di mockup) | login sungguhan lewat `child-login`, token tersimpan |
| **Shell** | `kid-shell.md` | bottom nav, FAB `＋ Money`, push screen, toast, ring |
| **Home** | `kid-home.md` | render dari `wallet_balances`/`children`/`money_rules` nyata; banner Unsorted muncul-hilang sesuai saldo |
| **Sort** (DEVIASI D-B) | `kid-sort.md` | rasio dari `money_rules` keluarga, bukan teks mati |
| **Wallets** | `kid-wallets.md` | akordeon, kartu kantong, cacah nyata |

### `/parent`

| Layar | Sumber | Bukti |
|---|---|---|
| **Sign in** | mockup (Login screen, varian "grown-up") | "Welcome back" / "Sign in to be the bank." apa adanya |
| **Sign up** | dirancang (DEVIASI D-D) | email+password+nama+telp+negara/provinsi/kota (dropdown 38 provinsi dependent) |
| **Reset password** | dirancang (DEVIASI D-D) | request-link jalan (dipakai `requestPasswordReset`, belum diuji tautan diklik sungguhan malam ini) |
| **Onboarding "Add a child"** | rencana T2 no.4 | `create_child` RPC nyata, PIN 6 digit ditegakkan server-side, family_code tergenerasi |
| **Dashboard** | mockup (disederhanakan — lihat §3) | daftar anak + saldo nyata per anak |
| **Approval inbox** | mockup (disederhanakan) | approve/decline/talk-about-it/done, `packages/core/requests.ts` apa adanya |

## 2. Loop yang benar-benar dibuktikan tersambung

Ini yang paling penting malam ini, lebih dari jumlah layar: **dua tahap yang selama ini
dikerjakan sejajar sekarang benar-benar satu sistem.**

Diuji langsung di browser, urut:
1. Sign up ortu baru (`bu-sinta-test2@nummi.local`) → trigger 0020 melahirkan
   `families`+`parents`+`parent_profiles` → **langsung masuk**, tanpa verifikasi email
   (ADR-0023).
2. Onboarding → "Add a child" (Dinda, PIN `246810`) → `create_child` RPC → family_code
   `FFRM7G` tergenerasi (6 karakter, alfabet tanpa-ambigu).
3. Dashboard menampilkan Dinda, saldo Rp0 — data nyata, bukan seed.
4. **Sign out dari sesi ortu, buka `/kid`, login sebagai Dinda pakai email ortu +
   PIN `246810` → berhasil, "Hi, Dinda!" dengan akun kosong yang benar.**

Langkah 4 itu yang membuktikan arsitekturnya utuh, bukan cuma dua permukaan yang kebetulan
sama-sama hidup.

**Yang BELUM diuji dalam loop ini** (jujur, ini beda dari Definisi Selesai T2 penuh):
allowance → Sort → **cash-out** → approve → fulfil → riwayat konsisten dua sisi. Layar
Cash-out sisi anak belum diport (task T1 §15), jadi approval inbox baru diuji jalur
approve/decline/talk-about-it-nya saja, belum end-to-end dengan request sungguhan dari anak.

## 3. Tiga cacat produksi ditemukan & ditutup

Ketiganya baru kelihatan begitu ada kode aplikasi **sungguhan** yang menyentuhnya — sama
seperti pola sesi-sesi sebelumnya.

1. **`child-login` Edge Function tidak punya CORS.** Gagal diam-diam dari browser sebagai
   `Failed to fetch` — preflight `OPTIONS` tidak ditangani. Berlaku juga di produksi (origin
   Vercel selalu beda dari origin Supabase). Ditutup: header CORS + handler `OPTIONS`,
   di-deploy ulang.
2. **`next.config.mjs` butuh `webpack.resolve.extensionAlias`.** Import gaya NodeNext (`./x.js`)
   di `@core`/`copy/` lolos `tsc` tapi mati di runtime webpack tanpa ini.
3. **`Confirm email` menyala di setelan Supabase Auth project ini** — bertentangan langsung
   dengan ADR-0023 ("ortu langsung masuk setelah daftar; verifikasi email jalan di belakang").
   Kalau dibiarkan, setiap sign up akan macet menunggu klik email yang menurut keputusan
   produk sendiri seharusnya tidak menghalangi apa pun. **Dimatikan lewat dashboard** —
   ini bukan keputusan produk baru, cuma menyelaraskan config project ke keputusan yang sudah
   dikunci Ghozy di Tahap 0.

Ditemukan juga (lebih kecil): `supabase-js` menolak `auth.getUser()` dipanggil di client yang
sudah dikonfigurasi opsi `accessToken` — pola yang sama dipakai `lib/kid/server.ts` &
`lib/parent/server.ts` untuk memverifikasi identitas lewat RPC. Solusinya: client kedua yang
polos, khusus untuk `getUser(token)`.

## 4. Simplifikasi & keputusan yang diambil sendiri

Tidak ada Ghozy untuk ditanya semalam — berikut yang diputuskan sendiri, semuanya reversibel,
tidak ada yang menyentuh uang/PIN/RLS:

- **Dashboard `/parent` satu-kartu-per-anak**, bukan chip-picker + satu ring gabungan seperti
  mockup (yang aslinya menampilkan satu anak terpilih). Alasannya waktu, bukan keputusan
  desain sadar — kalau diteruskan, layak ditinjau ulang vs mockup.
- **Approval inbox** hanya menulis ledger untuk `cash_out`/`give_away`. `grow_in`/`harvest`/
  `mission_claim` bisa approve/decline/talk (status berubah, database konsisten), tapi TIDAK
  menulis ledger/💎 — itu bagian Grow/Missions penuh yang belum digarap.
- **Copy baru** (`parentSignIn`/`parentSignUp`/`parentResetPassword` di `copy/{en,id}.ts`)
  ditulis sendiri mengikuti gaya `login`/`addChild` yang sudah ada — `parentAuth` lama (OTP)
  sengaja TIDAK disentuh/dihapus, sudah retired sejak ADR-0023 dan dijaga tipe untuk alasan
  yang sama dengan sisa kamus.
- **Grow di Wallets**: kartu instrumen ditampilkan tanpa simulasi bunga/spread harian.
- **Sort tidak punya slider geser manual** untuk mode Flexible.
- **Tombol `•••`/`🧾` di Wallets** dan **kartu dashed**: diport TANPA `onClick`, sesuai
  peringatan `kid-wallets.md` — jangan mengarang tujuannya.

## 5. Sama sekali belum disentuh

### `/kid` (Tahap 1 lanjutan)
Add money · Move money · Cash-out request · Dreams (buat/progress/batalkan) · Give (sisi anak) ·
Grow penuh (TD/Gold/Forex + Harvest + spread) · Missions/Jobs/Prizes/Me · Activity + filter tanggal.

### `/parent` (Tahap 2 lanjutan)
Send/Take money · Money rules editor (Strict/Flexible, auto-split) · Settings (allowance, bank
rates, today's prices) · Jobs/Prizes builder · Transactions · Insight · undang ortu kedua.

Konsekuensi konkret: **`money_rules` untuk keluarga `seed:dev`** (dipakai menguji Sort di
sesi Tahap 1) **masih di-insert manual lewat SQL**, bukan lewat Money rules editor — editornya
belum ada. Keluarga baru (`Bu Sinta`, `FFRM7G`) yang dibuat sesi ini TIDAK punya `money_rules`
sama sekali, jadi Sort untuk Dinda akan menunjukkan "tidak ada yang bisa ditempatkan" sampai
Money rules editor ada atau baris itu diisi manual juga.

## 6. Yang perlu Ghozy lakukan

1. **Baca §3 & §4** — satu setelan Supabase (`Confirm email`) diubah, dan beberapa keputusan
   kecil diambil sendiri. Tidak ada yang menyentuh uang, tapi §4 baris pertama (layout
   Dashboard) layak dilihat lebih dulu kalau mau lanjut ke arah mockup persis.
2. **Coba sendiri**: sign up ortu baru di `/parent`, atau pakai akun uji yang sudah ada —
   `bu-sinta-test2@nummi.local` / `nummi-parent-test-pw`, anak Dinda PIN `246810`,
   family code `FFRM7G`. Data ini masih di database, tidak dibersihkan (tidak menyentuh
   keluarga lain).
3. Dua commit lokal (`213293b` Tahap 1, `a5d1ed2` Tahap 2), belum di-`git push` — menunggu
   direview sebelum naik ke `origin/main`.
4. **Kalau lanjut**, urutan termurah: kid-side Cash-out (memakai ulang pola route handler
   Sort) → itu yang membuka pengujian approval inbox penuh (approve→fulfil→ledger) dan
   menutup Definisi Selesai T2 yang sesungguhnya.
