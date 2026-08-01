# Laporan progres — 1 Agustus 2026

Sesi ini menyambung dari Tahap 0 (selesai & dicentang 31 Juli — lihat riwayat git untuk
laporan lama). Ghozy minta Tahap 1, lalu Tahap 2, lalu "selesaikan sisa pekerjaan di T1 dan T2"
dikerjakan berturutan semalam, tanpa pengawasan. Dikerjakan sejauh protokol AGENTS.md §3
(ekstrak → inventaris → port → verifikasi berdampingan) memungkinkan — **bukan semuanya
selesai**, dan berkas ini bilang persis sejauh mana, termasuk yang genuinely masih hilang.

> **Ringkas:** `/kid` (login·Home·Sort·Wallets·Move·Cash-out·Give·Requests·History·Me) dan
> `/parent` (sign up·onboarding·dashboard·approval inbox·**Money rules editor**·**Allowance**·
> **Send/Take**) hidup di atas Supabase sungguhan. **Pencapaian paling penting sesi ini**:
> keluarga baru sekarang bisa dipakai **sepenuhnya lewat UI, nol SQL manual** — sebelumnya
> Sort hanya bekerja untuk keluarga yang rasio auto-split-nya di-insert langsung ke database.
> Dibuktikan ujung ke ujung dengan keluarga yang sebelumnya buntu total. Yang **masih genuinely
> kosong**: Grow penuh, Missions/Jobs/Prizes, dan separuh layar Settings (Investments/Bank
> rates/Today's prices/Account/undang ortu kedua).

---

## 1. Status akhir per area

### `/kid` — 10 dari 12 area rencana Tahap 1

✅ Login · Shell · Home · Sort · Wallets · Move · Cash-out · Give · Requests · History · Me
❌ **Grow penuh** (Time Deposit/Gold/Forex + Harvest + spread) — butuh `daily_prices`, belum
disentuh sama sekali. ❌ **Missions/Jobs/Prizes** — butuh struktur kurikulum & tabel koleksi
yang belum ada.

### `/parent` — sebagian besar rencana Tahap 2

✅ Sign up/in/reset · Onboarding · Dashboard · Approval inbox · **Money rules editor** ·
**Allowance** (jadwal + kirim sekarang, SUNGGUHAN bukan simulasi) · **Send/Take money**.
❌ Investments (manage/harvest dari sisi ortu) · Bank rates (edit) · Today's prices (edit
manual) · Account (edit profil/lihat PIN masking) · undang ortu kedua · Jobs/Prizes builder ·
Transactions (riwayat gabungan semua anak) · Insight.

## 2. Loop yang dibuktikan hidup ujung ke ujung — dua kali, dua keluarga berbeda

**Loop 1** (`dev-parent@nummi.local` / Arthur, dari sesi sebelumnya): allowance → Sort → Move →
Give → approve → done+cerita → ledger.

**Loop 2, baru sesi ini — yang paling berarti**: keluarga `bu-sinta-test2@nummi.local` / Dinda,
yang **sebelum sesi ini punya nol `money_rules`** (Sort-nya akan langsung gagal "tidak ada yang
bisa ditempatkan"):
1. Ortu buka Settings Dinda → set Money rules 50% Spend / 30% Save / 20% Give lewat UI → Save.
2. Ortu Send money Rp30.000 (`sendLandsIn()` → selalu Unsorted).
3. Anak login `/kid` sebagai Dinda → buka Sort → **preview menunjukkan 50/30/20 yang baru
   disetel, bukan angka lama** → konfirmasi.
4. Wallets ter-update: Spend Rp15.000 · Save Rp9.000 · Give Rp6.000 — persis rasio yang
   disetel ortu lewat UI, nol SQL.

Ini yang menutup catatan "belum diuji" dari laporan sebelumnya — Money rules editor sekarang
benar-benar terbukti menjadi jalan **satu-satunya** yang dibutuhkan sebuah keluarga baru untuk
bisa memakai Sort.

## 3. Cacat & insiden ditemukan sesi ini

Selain 3 cacat produksi yang sudah dilaporkan sebelumnya (CORS, webpack alias, Confirm email):

- **Bug nyata, ditemukan & diperbaiki**: `Dashboard.tsx` sempat kehilangan prop `onOpenSend`/
  `onOpenTake` di parameter destructuring (ada di tipe, tidak ada di parameter) — `tsc`
  menangkapnya sebelum sempat jadi masalah runtime.
- **Insiden alat, bukan cacat app**: di tengah pengujian Send/Take, tab browser otomatis
  kehilangan fokus render — screenshot menunjukkan halaman putih kosong berulang kali walau DOM
  (diverifikasi lewat JS langsung) berisi konten yang benar. Login & Sort untuk Dinda akhirnya
  diverifikasi dengan mengisi form & mengklik lewat JavaScript langsung (bukan simulasi
  klik/ketik visual), bukan karena aplikasinya rusak — server log & DB kedua-duanya konsisten
  sepanjang insiden ini. Dicatat supaya kalau ini terulang, jangan buru-buru disangka bug app.
- **Bug lama ("stale render sesaat setelah aksi") masih belum diselidiki akarnya** — data di
  database selalu benar (dicek ulang), tampilan kadang butuh reload manual untuk menyusul.
  Kemungkinan berkaitan dengan insiden fokus tab di atas, tapi belum dipastikan.

## 4. Keputusan yang diambil sendiri sesi ini (kumulatif, lihat juga laporan sebelumnya)

- **MR-11** (Give di grup "happens right away" walau butuh OK ortu) — masih menunggu keputusan
  Ghozy, belum berubah.
- **"Run the next payment now" dibuat SUNGGUHAN**, bukan simulasi berlabel "(demo)" seperti
  mockup — karena scheduler harian otomatis sengaja di luar cakupan (`nummi-web-plan.md`), dan
  tanpa jalan manual ini, allowance tidak akan pernah bisa dicoba sama sekali.
- Send/Take/Settings sebagai tiga tombol datar di kartu anak Dashboard — bukan port dari mockup
  (mockup punya chip-picker + satu anak aktif), keputusan yang sama dengan Dashboard
  sebelumnya: waktu, bukan kesengajaan desain.

## 5. Kenapa berhenti di sini, bukan "selesai semua"

Grow penuh butuh `daily_prices` (harga emas/forex harian) yang belum ada satu baris pun di
database — membangunnya asal-asalan demi mencentang tugas akan menghasilkan simulasi harga
palsu di layar uang sungguhan, persis kelas kesalahan yang coba dihindari sesi-sesi sebelumnya
(D-C: "angka mati → data nyata, tampilan sama" — untuk Grow, belum ada "data nyata" untuk
dipakai). Missions/Jobs/Prizes butuh struktur kurikulum yang bukan sekadar port UI, itu konten.
Keduanya lebih jujur ditinggal jelas-jelas kosong daripada dipalsukan supaya terlihat lengkap.

## 6. Yang perlu Ghozy lakukan

1. **Coba loop 2 sendiri** — ini yang paling penting dibuktikan lewat mata sendiri:
   `bu-sinta-test2@nummi.local` / `nummi-parent-test-pw`, Settings → Dinda, ubah rasio, lalu
   masuk `/kid` sebagai Dinda (`246810`) dan lihat Sort mengikuti.
2. Empat commit baru sesi ini (termasuk laporan), **push menyusul permintaanmu**.
3. **Kalau lanjut nanti**: Grow adalah pekerjaan besar berikutnya yang genuinely butuh
   keputusan produk dulu (dari mana `daily_prices` diisi — manual ortu via Settings, seperti
   yang mockup gambarkan, atau feed otomatis yang sengaja di-backlog?) — bukan cuma porting.
