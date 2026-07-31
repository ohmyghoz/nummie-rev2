# Laporan progres — 1 Agustus 2026

Sesi ini menyambung dari Tahap 0 (selesai & dicentang 31 Juli — lihat riwayat git untuk
laporan lama). Ghozy minta Tahap 1 & 2 dikerjakan semalam, tanpa pengawasan. Dikerjakan sejauh
protokol AGENTS.md §3 (ekstrak → inventaris → port → verifikasi berdampingan) memungkinkan
dalam satu sesi — **bukan keduanya selesai**, dan berkas ini bilang persis sejauh mana.

> **Ringkas:** empat layar `/kid` (login · Home · Sort · Wallets) hidup di atas Supabase
> sungguhan, diverifikasi berdampingan di browser, bukan cuma lolos `tsc`. Layar `/kid` lain
> (8 area) dan seluruh Tahap 2 (`/parent`) **belum disentuh**. Dua cacat produksi nyata
> ditemukan & ditutup di jalan (CORS Edge Function, resolusi modul webpack) — keduanya akan
> menggigit siapa pun yang mencoba deploy tanpanya, bukan cuma sesi ini.

---

## 1. Yang hidup & terverifikasi berdampingan

Bukan "lolos typecheck" — ini dicoba di `pnpm dev` + Chrome, dengan keluarga `seed:dev`
(`dev-parent@nummi.local` / PIN `135790`), dan hasilnya dicocokkan ke `docs/inventory/*.md`.

| Layar | Sumber | Bukti |
|---|---|---|
| **Login `/kid`** | dirancang (T1.1, tidak ada di mockup) | login sungguhan lewat `child-login`, token tersimpan, sesi bertahan |
| **Shell** | `kid-shell.md` | bottom nav, FAB `＋ Money`, push screen, toast, ring — semua diport, dipakai layar lain |
| **Home** | `kid-home.md` | render dari `wallet_balances`/`children`/`money_rules` nyata; banner Unsorted **muncul-hilang** sesuai saldo (diuji: hilang setelah Sort) |
| **Sort** (DEVIASI D-B) | `kid-sort.md` | rasio **40/40/20 dari `money_rules` keluarga**, bukan teks mati — diuji: Rp50.000 → Rp20.000/Rp20.000/Rp10.000, persis rasio DB |
| **Wallets** | `kid-wallets.md` | akordeon (satu terbuka sekaligus), kartu kantong, cacah nyata (bukan "3 envelopes" mati) |

**Alur uang nyata yang sudah dibuktikan jalan, ujung ke ujung:** anak login → lihat Rp50.000 di
Unsorted → buka Sort → konfirmasi → ledger tertulis lewat `POST /api/kid/sort` → saldo
Spend/Save/Give ter-update → Home & Wallets menampilkan angka baru tanpa refresh manual.

## 2. Dua cacat produksi ditemukan & ditutup

Sama seperti laporan T0 — ditemukan karena dicoba sungguhan, bukan dibaca kodenya.

1. **`child-login` Edge Function tidak punya CORS.** Berhasil dipanggil `curl` (server-to-server,
   Tahap 0), tapi gagal diam-diam dari browser sebagai `TypeError: Failed to fetch` — preflight
   `OPTIONS` tidak ditangani. **Ini bukan cuma masalah dev lokal**: origin Vercel selalu beda dari
   origin Supabase, jadi produksi akan kena juga. Ditutup: header CORS + handler `OPTIONS`,
   di-deploy ulang (`child-login` sekarang versi 6).
2. **Import gaya NodeNext (`./x.js`) di `@core`/`copy/` lolos `tsc` tapi mati di webpack Next.**
   `moduleResolution: bundler` milik `tsc` cukup toleran; bundler Next tidak, sampai diberi tahu
   `resolve.extensionAlias` di `next.config.mjs`. Tanpa ini: build lolos typecheck, lalu halaman
   kosong di runtime dengan `Module not found` di console — persis kelas kegagalan yang sudah
   diperingatkan `docs/DEPLOY.md` untuk masalah serupa (`outputFileTracingRoot`).

Keduanya baru kelihatan begitu ada layar yang **sungguhan** memanggil `@copy`/`@core` dan Edge
Function dari browser — sebelum sesi ini, tidak ada satu pun kode aplikasi yang melakukannya.

## 3. Arsitektur baru: siapa yang boleh menulis ledger

`packages/core` murni fungsi (menghitung rencana, tidak pernah menyentuh DB — `sortPlan()`,
`movePlan()`, dst. sengaja begitu). Tidak ada RPC Postgres untuk Sort/Move/dll (beda dengan
`create_child`, yang memang ada). Jalur yang dipakai, dan alasannya:

1. Klien mengirim token anak ke **route handler Next.js** (`/api/kid/sort`), bukan langsung ke Postgres.
2. Route handler memverifikasi identitas dengan memasang token itu sebagai `accessToken` pada
   client sekali-pakai lalu memanggil `auth_child_id()` — **Postgres/PostgREST sendiri yang
   memvalidasi tanda tangan JWT**, bukan server Next.js. Ini sengaja: `CHILD_JWT_SECRET` menurut
   `docs/DEPLOY.md` §2 tidak boleh dipasang di Vercel, jadi server Next.js tidak pernah mendekode
   token itu sendiri.
3. Setelah identitas terverifikasi, route handler menghitung ulang `sortPlan()` dari data
   **server** (bukan payload klien) dan menulis `ledger_entries` pakai `SUPABASE_SECRET_KEY`
   (service role) — satu-satunya jalan sejak migrasi 0009 mencabut hak tulis langsung `authenticated`.

Pola ini (`apps/web/lib/kid/server.ts`) dipakai ulang untuk Move/Cash-out/Give/Grow nanti — sudah
teruji lewat Sort, tinggal disalin bentuknya.

## 4. Simplifikasi & keputusan yang diambil sendiri (dicatat, bukan disembunyikan)

Karena tidak ada Ghozy untuk ditanya semalam, beberapa hal diputuskan sendiri mengikuti pola
yang sudah ada di inventaris/AGENTS.md, bukan ditebak bebas:

- **Grow di Wallets**: kartu instrumen ditampilkan (saldo, tombol Harvest) **tanpa** simulasi
  bunga/spread harian (`daily_prices`) — itu porsi Grow penuh (§9 rencana), belum digarap.
- **Sort tidak punya slider geser manual** untuk mode Flexible yang `editable`. Rencana
  ditampilkan & dikonfirmasi apa adanya; mengubah slot satu-satu belum diport.
- **Tombol `•••`/`🧾` di Wallets** dan **kartu dashed**: diport TANPA `onClick`, persis
  peringatan `kid-wallets.md` §1 & §5 ("jangan mengarang"). Tujuannya masih belum diputuskan.
- Tab **Missions** dan **Me** menampilkan pesan "belum dibangun" alih-alih dikosongkan diam-diam
  — supaya jelas ini batas sesi, bukan bug.

Tidak ada yang di atas menyentuh uang/PIN/RLS — semuanya di permukaan visual/UX.

## 5. Sama sekali belum disentuh

### `/kid` (Tahap 1 lanjutan)
Add money · Move money · Cash-out request · Dreams (buat/progress/batalkan) · Give (sisi anak) ·
Grow penuh (TD/Gold/Forex + Harvest + spread) · Missions/Jobs/Prizes/Me · Activity + filter tanggal.

### `/parent` (Tahap 2) — **nol baris kode**
Sign up · login · reset password · onboarding Add a child · dashboard · approval inbox
(approve≠fulfil) · Send/Take · Money rules editor · Settings · Jobs/Prizes builder · Transactions.

Konsekuensi konkret: **money_rules keluarga `seed:dev` yang dipakai menguji Sort di atas
di-insert manual lewat SQL** (bukan lewat UI ortu, karena UI-nya belum ada) — dicatat di sini
supaya jelas itu bukan alur produk yang sudah teruji, cuma cara membuktikan Sort bekerja.

## 6. Kenapa berhenti di sini, bukan dipaksa "selesai" kedua tahap

`AGENTS.md` §3 ada karena versi cepat dari proses ini — lompat dari baca mockup langsung ke kode
tanpa inventaris, tanpa verifikasi berdampingan — adalah persis yang membuat repo lama menyimpang.
Mengarang sisa 8 layar `/kid` dan seluruh `/parent` semalam demi mencentang tugas akan menghasilkan
pekerjaan yang harus dibongkar lagi, bukan progres. Yang dipilih: kerjakan lebih sedikit, tapi
setiap layar yang diklaim "jalan" sungguh sudah dicoba dengan data nyata.

## 7. Yang perlu Ghozy lakukan

1. **Baca §4** — beberapa keputusan kecil diambil sendiri, semuanya reversibel, tidak ada yang
   menyentuh uang.
2. **Coba sendiri**: `pnpm dev`, buka `/kid`, masuk `dev-parent@nummi.local` / PIN `135790`.
3. Belum di-`git push` — commit ada di lokal (`213293b`), menunggu direview dulu sebelum naik ke
   `origin/main`.
4. Kalau lanjut: layar berikutnya yang paling murah adalah **Move money** (memakai ulang pola
   route handler yang sama dengan Sort), lalu Cash-out (butuh sedikit tabel `requests`).
   Tahap 2 baru bisa mulai kapan saja — tidak diblokir keputusan apa pun, cuma belum ada waktu.
