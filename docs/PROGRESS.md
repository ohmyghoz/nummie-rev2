# Laporan progres — 1 Agustus 2026

Sesi ini menyambung dari Tahap 0 (selesai & dicentang 31 Juli — lihat riwayat git untuk
laporan lama). Ghozy minta Tahap 1, lalu Tahap 2, lalu "selesaikan sisa pekerjaan di T1 dan T2"
dikerjakan berturutan semalam, tanpa pengawasan. Dikerjakan sejauh protokol AGENTS.md §3
(ekstrak → inventaris → port → verifikasi berdampingan) memungkinkan — **bukan semuanya
selesai**, dan berkas ini bilang persis sejauh mana, termasuk yang genuinely masih hilang.

> **Ringkas:** `/kid` (login·Home·Sort·Wallets·Move·Cash-out·Give·Requests·History·Me·**Grow
> (Time Deposit)**) dan `/parent` (sign up·onboarding·dashboard·approval inbox·Money rules
> editor·Allowance·Send/Take·**Bank rates·Manage investments·Transactions**) hidup di atas
> Supabase sungguhan. Pencapaian babak pertama sesi ini: Money rules editor, dibuktikan ujung ke
> ujung dengan keluarga yang sebelumnya buntu total. Babak kedua: **Grow — Time Deposit** hidup
> penuh (setor → ortu approve → bunga terkunci → panen dengan 3 pilihan) plus Bank rates,
> Manage investments, dan Transactions di sisi ortu — empat bug nyata ditemukan & diperbaiki
> lewat pengujian langsung, bukan cuma typecheck/test (lihat §3). Babak ketiga: investigasi
> menutup sisa daftar — **semua yang tersisa genuinely terhalang**, bukan sekadar belum sempat
> (lihat §5): Grow Gold/Forex & Today's prices (`daily_prices` belum ada), Missions/Jobs/Prizes
> (kurikulum belum ada — dan gerbangnya, `starsLifetime`, cuma bisa naik dari kurikulum, jadi
> Jobs/Prizes akan permanen terkunci tanpa itu), undang ortu kedua (trigger sign-up 0020 selalu
> membuat keluarga baru, belum ada jalur bergabung ke keluarga yang sudah ada), Insight (fitur
> besar sendiri, bahkan mockup-nya sendiri memakai `demoWalk` — smoothing data demo — untuk
> grafik alokasi, tanda ia belum didesain untuk data nyata). "Account" dicari di mockup babak
> ini dan **tidak ada** — bukan belum dikerjakan, memang tidak pernah ada layarnya.

---

## 1. Status akhir per area

### `/kid` — 11 dari 12 area rencana Tahap 1

✅ Login · Shell · Home · Sort · Wallets · Move · Cash-out · Give · Requests · History · Me ·
**Grow — Time Deposit** (setor 3/6/12 bulan, panen dengan 3 pilihan: ambil semua / lanjutkan
semua / ambil bunga saja).
❌ **Grow — Gold/Forex** — butuh `daily_prices` (harga harian), belum ada satu baris pun di
skema atau database; distub jujur di UI ("Not built yet — needs daily prices") daripada
dipalsukan. ❌ **Missions/Jobs/Prizes** — butuh struktur kurikulum & tabel koleksi yang belum
ada.

### `/parent` — sebagian besar rencana Tahap 2

✅ Sign up/in/reset · Onboarding · Dashboard · Approval inbox · Money rules editor · Allowance
(jadwal + kirim sekarang, sungguhan) · Send/Take money · **Bank rates** (edit rate 3/6/12 bulan,
dipakai langsung oleh Grow di sisi anak) · **Manage investments** (baca-saja, per anak — daftar
Time Deposit aktif dengan pokok/rate/sisa hari/status jatuh tempo; wallet yang masih menunggu
approve sengaja disembunyikan, lihat §3) · **Transactions** (baca-saja, per anak — riwayat
`ledger_entries` dengan filter rentang, sama pola dengan History anak).
❌ Today's prices (edit manual, nunggu keputusan `daily_prices`) · undang ortu kedua (§5) ·
Jobs/Prizes builder (§5) · Insight (§5). ~~Account~~ — dicari di mockup, tidak ada; dicoret dari
daftar, bukan ditunda.

## 2. Loop yang dibuktikan hidup ujung ke ujung

**Loop 1** (`dev-parent@nummi.local` / Arthur, dari sesi sebelumnya): allowance → Sort → Move →
Give → approve → done+cerita → ledger.

**Loop 2** (`bu-sinta-test2@nummi.local` / Dinda, punya nol `money_rules` sebelum sesi ini):
Settings set rasio lewat UI → Send money → Sort ikut rasio baru → Wallets sesuai — nol SQL
manual (lihat laporan sebelumnya untuk detail langkah).

**Loop 3, baru babak ini — Grow (Time Deposit)**, keluarga & anak yang sama (Dinda):
1. Ortu buka Settings → Bank rates → 3mo 1,5% / 6mo 2,5% / 12mo 4% → Save.
2. Anak buka Grow → Time Deposit → pilih tenor 3 bulan, sumber "Everyday" (Spend), Rp10.000 →
   "Ask my grown-up".
3. Ortu buka Requests → approve. **Diverifikasi lewat SQL langsung**: ledger `grow_in`
   Rp10.000 tertulis dari Everyday ke wallet instrumen baru; wallet itu membeku dengan
   `tenor_months=3, locked_rate_pct=1.50, started_at=hari ini` — persis sekaligus, sesuai
   migrasi 0014.
4. Backdate `started_at` lewat SQL (simulasi jatuh tempo — bukan lewat UI, wajar untuk
   verifikasi tanpa menunggu 3 bulan sungguhan) → Grow hub menunjukkan "ready to harvest".
5. Anak pilih "Take the extra, keep the rest working" (take_profit) → "Ask my grown-up".
6. Ortu approve. **Diverifikasi lewat SQL**: ledger bunga Rp150 (10.000 × 1,5%) masuk ke
   wallet TD lalu keluar lagi ke Save; saldo TD tetap Rp10.000 (pokok tidak berkurang), saldo
   Save bertambah Rp150; wallet TD **diperpanjang** — `started_at` jadi hari ini lagi,
   `locked_rate_pct` dihitung ulang dari Bank rates *saat ini* (bukan yang lama) — persis
   perilaku yang dijanjikan komentar kode sebelum diperbaiki (lihat §3).

**Loop 4 — Manage investments & Transactions**, keluarga & anak yang sama: kedua Time Deposit
Dinda (dari Loop 3) muncul benar di "Manage investments" (pokok/rate/sisa hari), dan seluruh
riwayat sesi ini (send_money, 3× sort, 2× grow_in, 2× harvest) muncul benar dengan tanda +/− di
"Transactions" — dicocokkan lagi dengan hasil SQL langsung yang sama dipakai Loop 3.

## 3. Cacat & insiden ditemukan sesi ini

Selain cacat produksi yang sudah dilaporkan sebelumnya (CORS, webpack alias, Confirm email,
`Dashboard.tsx` prop hilang) dan insiden alat (tab browser kehilangan fokus render — lihat
laporan sebelumnya):

- **Bug nyata #1, ditemukan lewat pengujian langsung, diperbaiki**: `POST /api/kid/grow/buy`
  membuat wallet instrumen dengan `tenor_months` terisi tapi `locked_rate_pct`/`started_at`
  masih kosong — melanggar constraint `deposit_terms_all_or_none` (migrasi 0014, sengaja
  menuntut ketiganya sekaligus atau tidak sama sekali). 500 di percobaan pertama sungguhan.
  Perbaikan: `tenor_months` TIDAK diisi saat wallet dibuat; tenor pilihan anak untuk sementara
  hidup di `requests.grow_tenor_months` (sudah ada), dan ketiga kolom wallet baru dibekukan
  bersamaan saat ortu approve — sesuai niat migrasinya.
- **Bug nyata #2, ditemukan lewat pembacaan ulang kode sendiri**: komentar di jalur
  roll_over/take_profit bilang "rate mengikuti Settings terbaru saat renewal", tapi kodenya
  cuma mengubah `started_at`, tidak pernah menghitung ulang `locked_rate_pct`. Diperbaiki agar
  benar-benar mengambil Bank rates saat itu dan menghitung ulang rate untuk tenor yang sama —
  dibuktikan lewat Loop 3 langkah 6 di atas.
- **Bug nyata #3, ditemukan lewat pengujian UI langsung (tombol "+" tidak bisa diklik)**:
  stepper jumlah uang (`AmountCard`) di Move/Cash-out/Give/Grow-buy memakai langkah tetap
  (Rp5.000/Rp10.000) dan menolak menambah kalau `jumlah + langkah > saldo` — kalau saldo wallet
  lebih kecil dari satu langkah (mis. Rp9.000 dengan langkah Rp10.000), tombol "+" terkunci
  selamanya dan anak **tidak bisa sama sekali** memakai wallet itu untuk aksi tersebut. Ini pola
  yang sama di keempat layar (dibuat sesi-sesi sebelumnya). Diperbaiki di keempatnya: klik "+"
  sekarang naik ke `min(jumlah + langkah, saldo)`, jadi klik terakhir selalu bisa mencapai
  seluruh saldo persis, bukan berhenti di kelipatan langkah.
- **Bug nyata #4, ditemukan lewat pengujian UI langsung (Manage investments baru menunjukkan
  "Rp0 · 0% · 0 months")**: `grow/buy` membuat wallet instrumen langsung saat anak mengajukan,
  sebelum ortu approve — ada jendela waktu di mana wallet-nya ada tapi belum jadi kesepakatan
  (`locked_rate_pct`/`started_at` masih kosong). Layar Manage investments (baru dibangun babak
  ini) awalnya menampilkan semua wallet TD tanpa pengecualian, jadi permintaan yang masih
  menunggu approve ikut muncul dengan angka kosong yang membingungkan. Diperbaiki: hanya
  tampilkan wallet yang `startedAt`-nya sudah terisi (sudah benar-benar didanai); yang masih
  menunggu tetap kelihatan di Requests, bukan di sini.

## 4. Keputusan yang diambil sendiri sesi ini (kumulatif, lihat juga laporan sebelumnya)

- **MR-11** (Give di grup "happens right away" walau butuh OK ortu) — masih menunggu keputusan
  Ghozy, belum berubah.
- **"Run the next payment now" dibuat SUNGGUHAN**, bukan simulasi — lihat laporan sebelumnya.
- Send/Take/Settings sebagai tiga tombol datar di kartu anak Dashboard — bukan port mockup
  murni, keputusan waktu bukan kesengajaan desain (lihat laporan sebelumnya).
- **Grow dibatasi ke Time Deposit saja** — Gold/Forex butuh `daily_prices` yang tidak ada di
  skema maupun kode manapun; membangunnya sekarang berarti mengarang harga palsu di layar uang
  sungguhan (persis D-C yang dihindari sesi-sesi sebelumnya). Distub jujur, bukan disembunyikan
  atau dipalsukan.

## 5. Kenapa berhenti di sini, bukan "selesai semua"

Setelah Loop 4, sisa daftar Tahap 1/2 diperiksa satu per satu (bukan diasumsikan "tinggal
porting") untuk memastikan tidak ada lagi yang genuinely bisa dikerjakan tanpa keputusan
produk. Hasilnya:

- **Grow Gold/Forex & Today's prices** — sama seperti sebelumnya: butuh `daily_prices` yang
  tidak ada di skema maupun kode manapun.
- **Missions (kurikulum)** — butuh konten pelajaran (chapters/quiz) sungguhan, bukan struktur
  UI. Tidak ada jalan jujur untuk mem-port ini tanpa konten aslinya.
- **Jobs/Prizes builder** — sekilas kelihatan aman dibangun (parent-authored, bukan konten
  baku, dan `packages/core/src/jobs.ts`+`economy.ts` sudah ada & teruji). Tapi ditelusuri lebih
  jauh: `choresUnlocked()` (economy.ts) menggerbang Jobs/Prizes di `starsLifetime >= 100`, dan
  ⭐ **cuma** bisa didapat dari `earnStars()` yang dipanggil menyelesaikan chapter kurikulum
  (`starsFromChapters`, missions.ts). Tanpa kurikulum, `starsLifetime` selamanya nol untuk
  keluarga sungguhan mana pun — jadi membangun Jobs/Prizes sekarang berarti mengirim fitur yang
  **tidak akan pernah bisa dibuka** siapa pun. Sama akarnya dengan Missions, bukan pekerjaan
  terpisah.
- **Undang ortu kedua** — diperiksa `handle_new_parent_signup()` (migrasi 0020): trigger ini
  **selalu** membuat `families` baru untuk setiap `auth.users` baru, tanpa jalur "gabung ke
  keluarga yang sudah ada". Membangun undangan sungguhan berarti mengubah trigger sign-up yang
  dipakai SETIAP pendaftaran ortu (bukan cuma fitur ini) — beresiko tinggi kalau salah (ortu
  baru bisa gagal dapat keluarga sama sekali), dan belum ada keputusan soal mekanismenya (email
  invite lewat Admin API + metadata family_id, vs kode keluarga yang dipakai saat sign up
  sendiri, mirip PIN anak). Bukan port, keputusan arsitektur.
- **Insight** — dibaca penuh di mockup source (:343–450-an): sparkline tren saldo (rekonstruksi
  dari delta ledger mundur), grafik alokasi antar kategori dari waktu ke waktu, perbandingan
  periode-ke-periode, performa Grow. Fiturnya sendiri **memakai `demoWalk()`** — generator
  smoothing data demo — untuk grafik alokasi, tanda mockup-nya sendiri belum didesain memakai
  data nyata di bagian itu. Ini pekerjaan besar tersendiri yang pantas dapat sesi/keputusan
  desainnya sendiri, bukan ditempel di ujung sesi yang sudah panjang.
- **Account** — dicari di seluruh `parent-mobile.source.jsx` babak ini: tidak ada satu pun push
  type atau referensi layar "Account"/"profil". Catatan di laporan-laporan sebelumnya soal
  "Account (edit profil/PIN masking)" ternyata bukan dari mockup — dicoret dari daftar
  sepenuhnya, bukan ditunda.

Semua yang tersisa lebih jujur ditinggal jelas-jelas kosong (atau, untuk Account, dicoret sama
sekali) daripada dipaksa jadi tanpa keputusan produk yang tepat, atau — untuk undang ortu kedua
— tanpa mengambil resiko pada jalur sign-up yang dipakai semua orang.

## 6. Yang perlu Ghozy lakukan

1. **Coba Loop 3 sendiri**: `bu-sinta-test2@nummi.local` / `nummi-parent-test-pw`, Settings →
   Bank rates, lalu masuk `/kid` sebagai Dinda (`246810`) → Grow → Time Deposit. Setelah approve,
   lihat "Manage investments" di kartu Dinda untuk melihat kesepakatannya.
2. **Kalau lanjut nanti, empat keputusan produk yang menghalangi (§5), bukan sekadar "belum
   sempat"**:
   - `daily_prices` diisi dari mana (manual ortu via Settings, atau feed otomatis) — menggerbang
     Grow Gold/Forex & Today's prices.
   - Kurikulum (chapters/konten pelajaran) — menggerbang Missions **dan** Jobs/Prizes sekaligus
     (⭐ lifetime cuma naik dari situ).
   - Mekanisme undang ortu kedua (email invite + ubah trigger sign-up 0020, atau kode keluarga
     saat sign up sendiri) — menyentuh jalur dipakai SEMUA pendaftaran ortu, bukan fitur berdiri
     sendiri.
   - Insight pantas jadi sesi/keputusan desainnya sendiri (grafik, rekonstruksi tren dari
     ledger) — bukan pekerjaan "port" seperti yang lain.
