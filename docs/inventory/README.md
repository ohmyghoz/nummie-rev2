# docs/inventory/ — inventaris layar

Langkah **(b)** dari protokol anti-divergensi (AGENTS.md §3.1):

> a. **Ekstrak & baca** blok HTML/CSS/JS layar tsb. dari berkas mockup
> b. Tulis **inventaris layar**: elemen, state, interaksi, copy persis, warna, spacing, navigasi
> c. Port ke komponen React **mengikuti inventaris**
> d. **Verifikasi berdampingan** sebelum lanjut layar berikutnya

## Kenapa langkah (b) tidak boleh dilewati

Godaan terbesarnya adalah melompat dari (a) ke (c) — membuka mockup di satu jendela dan mengetik
React di jendela lain. Itu terasa lebih cepat, dan itulah yang menghasilkan repo lama.

Yang hilang saat dilewati bukan kecepatan, melainkan **jejak**: tanpa inventaris tidak ada apa pun
yang bisa dibandingkan saat verifikasi (d). "Apakah ini sama dengan mockup?" berubah jadi
pertanyaan ingatan, dan ingatan selalu menjawab ya.

Inventaris juga tempat **deviasi disadari sebagai deviasi**. Angka `40/40/20` yang mati di layar
Sort hanya terlihat sebagai masalah kalau seseorang menuliskannya lebih dulu — kalau langsung
diport, ia berubah jadi baris kode yang tampak wajar.

## Aturan

1. **Setiap klaim menunjuk baris.** Format `berkas:baris` ke `reference/mockup-source/`. Kalau
   sebuah pernyataan tidak bisa ditunjuk, ia ingatan — buang atau verifikasi.

   ⚠️ Berkas yang ditunjuk itu **digenerate**. Kalau `tools/unpack-mockups.mjs` berubah, seluruh
   nomor bergeser sekaligus tanpa satu pun galat muncul. `pnpm inventory:check` menjaga
   **jangkar** — klaim paling menanggung beban di tiap inventaris — dan dijalankan CI. Kalau ia
   merah, jangan port apa pun dari inventaris yang disebutnya sebelum nomornya diperiksa ulang.
2. **Copy ditulis persis**, termasuk tanda baca dan emoji. Bukan parafrase.
3. **Deviasi ditandai `D-A`…`D-D`** sesuai AGENTS.md §3.3, dengan alasannya. Deviasi yang tidak
   ada di daftar itu **bukan deviasi — itu penyimpangan**, dan harus ditanyakan dulu.
4. **Yang ditemukan aneh masuk `docs/mockup-review.md`**, bukan "diperbaiki" di inventaris.
5. Tier **Middle saja** (ADR-0020). Cabang `little`/`teen` di mockup dicatat bila memengaruhi
   struktur, tapi tidak diport.

## Isi

| Berkas | Cakupan | Status |
|---|---|---|
| [`kid-shell.md`](kid-shell.md) | frame · status bar · bottom nav · scroll · push screen · toast | ✅ siap diport |
| [`kid-home.md`](kid-home.md) | tab Home | ✅ siap diport |
| [`kid-sort.md`](kid-sort.md) | push screen Sort (deviasi D-B) | ✅ siap diport |
| [`kid-wallets.md`](kid-wallets.md) | tab Wallets | ✅ siap diport |

**Belum ditulis** (Tahap 1 lanjutan): Missions · Me · dan push screen Cash out · Move · Give away ·
Grow · Buy FX · Harvest TD · Harvest Gold · Requests · History. Ditambahkan sebelum layar
masing-masing diport, bukan sekaligus di muka — inventaris yang ditulis jauh sebelum dipakai akan
basi terhadap keputusan yang muncul di antaranya.
