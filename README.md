# Nummi

> *The piggy bank you and your child share.*

Celengan digital untuk anak usia 9–12 dan orang tuanya. Anak menerima uang, **menyortirnya**
sendiri ke Spend / Save / Give / Grow, mengajukan cash-out, dan menabung untuk sesuatu yang
nyata. Ortu adalah banknya: mengirim uang saku, menyetujui pengeluaran, menetapkan aturan.

Uangnya sungguhan, penyimpanannya di dunia nyata masih di tangan ortu — yang disimulasikan
adalah pembukuannya, dan itu memang intinya.

---

## ⚠️ Empat aturan yang tidak boleh dilanggar

Baca ini sebelum menulis satu baris pun. Ini bukan preferensi gaya — ini pelajaran mahal dari
repo sebelumnya, dan alasan repo ini dimulai dari nol.

1. **Mockup adalah sumber kebenaran UI.** `reference/mockups/` menentukan layout, copy, warna,
   urutan menu, dan navigasi. Kalau app menyimpang dari mockup, **app yang salah** — bukan
   mockupnya. Jangan mendesain ulang atas nama "lebih rapi", "kanonik", atau "best practice".

2. **`reference/` read-only selamanya.** Merasa ada yang aneh di mockup? Tulis ke
   [`docs/mockup-review.md`](docs/mockup-review.md), lalu **kerjakan sesuai mockup**. Ghozy yang
   memutuskan belakangan. Memperbaikinya diam-diam menghapus bukti konfliknya.

3. **Dilarang menambah CSS framework atau component library.** Tidak Tailwind, tidak shadcn,
   tidak apa pun. CSS mockup sudah lengkap — tugasnya **diport**, bukan diganti.

4. **`packages/core` tidak disentuh tanpa persetujuan.** Ia mesin uang yang teruji (223 test),
   ditransplantasi utuh dari repo lama. Klien tidak pernah menulis balance atau ledger langsung —
   semuanya lewat fungsi `SECURITY DEFINER` di Postgres.

Aturan lengkap + protokol anti-divergensi: [`AGENTS.md`](AGENTS.md). Rencana per tahap:
[`nummi-web-plan.md`](nummi-web-plan.md).

### Kenapa repo ini dimulai dari nol

Repo sebelumnya (`Nummie-test`) menghasilkan UI yang menyimpang jauh dari mockup — karena
aturannya sendiri menyebut mockup "artefak sejarah, bukan sumber kebenaran". Setiap sesi lalu
merasa berhak merapikan. Engine-nya sehat; UI-nya tidak bisa diselamatkan.

Repo ini membalik aturan itu, dan menyelamatkan engine-nya.

---

## Cara membaca mockup — jangan `grep` ke berkas HTML

**Ini bagian yang paling menyelamatkan waktumu.** Tiga dari empat mockup adalah bundle React
satu-berkas: kode layarnya terkubur di dalam string JSON. `grep` ke HTML mentah **gagal tanpa
memberitahumu**:

```bash
grep -F "\"Today's mission\"" reference/mockups/kid-mobile.html           # → 0 hasil
grep -F "\"Today's mission\"" reference/mockup-source/kid-mobile.source.jsx  # → 1 hasil
```

Nol itu **negatif palsu** — di dalam JSON, `"` tersimpan sebagai `\"`. Dan pencarian yang cocok
pun tidak menolong: hasilnya satu baris sepanjang 113.348 karakter.

👉 **Cari di [`reference/mockup-source/`](reference/mockup-source/)**, yang dihasilkan
`pnpm mockups:unpack`:

| Berkas | Isi |
|---|---|
| `<nama>.source.jsx` | logika + (untuk `/kid`) seluruh UI |
| `<nama>.markup.html` | markup layar — **di sinilah copy & warna permukaan ortu** |
| `<nama>.fonts.html` | `@font-face`: bobot yang benar-benar dipakai |
| `console.source.html` | console apa adanya (HTML biasa, `:root` token lengkap) |

`parent-mobile.markup.html` bahkan memuat `data-screen-label` per layar — kerangka siap pakai
untuk "inventaris layar" yang diwajibkan AGENTS.md §3b.

---

## Menjalankan

Butuh **Node ≥ 20** dan **pnpm**.

```bash
pnpm install
pnpm dev                # http://localhost:3000/kid  /parent  /parent-web  /console
```

| Perintah | Apa |
|---|---|
| `pnpm test` | 223 test engine — **gerbang setiap tahap**, termasuk invariant I1 |
| `pnpm typecheck` | `packages/core` + `apps/web` + `data/regions` |
| `pnpm build` | build produksi Next |
| `pnpm mockups:unpack` | buka mockup jadi sumber yang bisa di-grep |
| `pnpm regions:build` | regenerate 38 provinsi + 514 kab/kota |
| `pnpm seed:dev` | 1 keluarga uji + 1 anak Middle (**dev saja**, menolak jalan ke produksi) |
| `./tools/verify-migrations.sh` | jalankan 0001–0021 di Postgres lokal + uji perilakunya |

Untuk apa pun yang menyentuh Supabase, salin `.env.example` → `.env.local` lalu isi.

---

## Struktur

```
nummi/
├── AGENTS.md · nummi-web-plan.md   aturan kerja · rencana per tahap
├── reference/mockups/              4 HTML — SUMBER KEBENARAN UI, read-only
├── reference/mockup-source/        GENERATED — versi yang bisa di-grep
├── packages/core/                  mesin uang: ledger, split, rules (223 test)
├── supabase/                       migrasi 0001–0021 · Edge Function child-login
├── apps/web/                       satu app Next.js, empat route
├── copy/                           kamus en/id (ADR-0016: produk berbahasa Inggris)
├── data/regions/                   38 provinsi + 514 kab/kota, JSON statis
├── tools/                          skrip: unpack · regions · seed · verify
└── docs/                           ADR, brand, backlog, deploy, mockup-review
```

### Peta dokumen

| Kalau kamu ingin… | Baca |
|---|---|
| aturan kerja & protokol anti-divergensi | [`AGENTS.md`](AGENTS.md) |
| apa yang dikerjakan di tahap berapa | [`nummi-web-plan.md`](nummi-web-plan.md) |
| **konflik mockup yang menunggu keputusan** | [`docs/mockup-review.md`](docs/mockup-review.md) |
| kenapa sebuah keputusan diambil | [`docs/decisions/`](docs/decisions/) |
| menaikkan ke Supabase & Vercel | [`docs/DEPLOY.md`](docs/DEPLOY.md) |
| skema, RLS, dan jebakannya | [`supabase/README.md`](supabase/README.md) |
| warna, tipografi, format rupiah | [`docs/nummi-brand-system.md`](docs/nummi-brand-system.md) |

---

## Empat permukaan

| Route | Untuk | Sumber UI | Tahap |
|---|---|---|---|
| `/kid` | anak, HP | `kid-mobile.html` | 1 |
| `/parent` | ortu, HP | `parent-mobile.html` | 2 |
| `/parent-web` | ortu, desktop | `parent-web.html` | 3 |
| `/console` | operator | `console.html` | 4 |

`/` sengaja 404: halaman indeks akan jadi satu-satunya tempat `/console` disebut, dan console
bukan halaman yang boleh ditemukan orang.

---

## Status

| Tahap | Isi | Status |
|---|---|---|
| **0** | transplantasi engine + fondasi | ✅ kode selesai · ⏳ menunggu verifikasi Supabase & Vercel |
| 1 | `/kid` — Nummi Middle | belum |
| 2 | `/parent` + sign up | belum |
| 3 | `/parent-web` | belum |
| 4 | `/console` | belum |

Tahap 0 **belum boleh dicentang selesai**: enam pemeriksaan sudah hijau di repo (test, typecheck,
build, unpack, regions, migrasi di Postgres lokal), tapi sebelas langkah yang butuh Supabase &
Vercel sungguhan masih menunggu — runbooknya di [`docs/DEPLOY.md`](docs/DEPLOY.md) §3.

### Menunggu keputusan sebelum Tahap 1 mulai

- **MR-6** — anak masuk pakai **email ortu** (mockup) atau **kode keluarga** (ADR-0012)? Ini
  menentukan bentuk Edge Function `child-login`. Sekaligus: `/kid` tidak punya layar login sama
  sekali di mockup, jadi layar itu harus **dirancang**, bukan diport.
- **MR-2** — format rupiah `Rp 10,000` (mockup) atau `Rp50.000` (brand system)? Menentukan
  pemisah ribuan live di setiap kolom input Tahap 1.

Keduanya di [`docs/mockup-review.md`](docs/mockup-review.md), lengkap dengan buktinya.

---

## Cakupan

**Ada:** Middle (9–12) · Spend/Save/Give/Grow · dream & envelope · approve ≠ fulfil ·
Give dengan story-back · Grow simulasi (deposito/emas/valas) · misi & ⭐ · jobs & 💎.

**Belum:** iPad · tier Little & Teen (ADR-0020) · feed harga otomatis · Rapor Literasi ·
Growth Reward · paywall · slot iklan.

**Tidak akan pernah ada di `/kid`:** iklan, upsell, gembok Pro (ADR-0009). Teks bebas anak tidak
pernah dikirim ke pihak ketiga — data anak adalah data anak di bawah umur (UU PDP 27/2022).

---

Percakapan & dokumen: **Indonesia**. String UI: **Inggris** (ADR-0016).
