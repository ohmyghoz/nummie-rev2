# AGENTS.md — Nummi Rebuild (repo baru, Vercel + Supabase)

> Dibaca oleh Claude Code di setiap sesi. Repo ini adalah **fresh start yang disengaja**:
> repo lama (`Nummie-test`) menghasilkan UI yang menyimpang dari mockup karena aturannya sendiri
> menyebut mockup "artefak sejarah". **Di repo ini aturan itu DIBALIK.** Rencana per tahap:
> `nummi-web-plan.md`.

---

## 0. Hierarki sumber kebenaran (alasan repo ini ada)

| Lapisan | Sumber kebenaran | Artinya |
|---|---|---|
| **UI & perilaku layar** | `reference/mockups/*.html` | Layout, copy, warna, urutan menu, navigasi, interaksi — **ikuti mockup persis**. Bukan "nav kanonik" versi repo lama, bukan selera agent |
| **Aturan uang & engine** | `packages/core` + ADR di `docs/decisions/` | Ledger, invariant, split, rules, approve≠fulfil, Grow — mockup tidak pernah bertentangan dengan ini |
| **Konflik UI vs dokumen/ADR** | **Mockup menang** | Catat konfliknya di `docs/mockup-review.md`, JANGAN "memperbaiki" mockup diam-diam. Ghozy yang memutuskan belakangan |

Contoh konflik yang sudah diketahui (mockup menang sampai Ghozy bilang lain, semuanya masuk
`docs/mockup-review.md` sejak hari pertama): badge "🔥 7-day streak" (dokumen bilang streak
dihapus Fase 5) · format rupiah `Rp 10,000` (brand §17 bilang `Rp50.000`) · ejaan "Practice/Practise".

## 1. Apa yang dibangun

Empat permukaan web fungsional & tersambung, berurutan:

1. **`/kid`** — Nummi Middle (viewport HP) ← `reference/mockups/kid-mobile.html`
2. **`/parent`** — Parent App (viewport HP) + sign up publik ← `parent-mobile.html`
3. **`/parent-web`** — Parent Web (desktop, calon fitur premium — permukaan terpisah, bukan responsive) ← `parent-web.html`
4. **`/console`** — Admin console ← `console.html`

Di luar cakupan: iPad (ditunda) · tier Little & Teen (ADR-0020: Middle saja) · feed harga
otomatis · Rapor Literasi · Growth Reward · paywall · slot iklan.

## 2. Struktur repo & stack

```
nummi/
├── AGENTS.md · nummi-web-plan.md
├── reference/mockups/        ← 4 HTML mockup, READ-ONLY, sumber kebenaran UI
├── packages/core/            ← TRANSPLANTASI dari repo lama (ledger engine, 223 test) — jangan tulis ulang
├── supabase/                 ← TRANSPLANTASI: migrasi 0001–0018 + Edge Function child-login
├── docs/decisions/           ← TRANSPLANTASI: ADR (lihat §5 mana yang batal)
├── docs/mockup-review.md     ← daftar konflik mockup-vs-dokumen untuk ditinjau Ghozy
├── copy/                     ← TRANSPLANTASI: kamus en/id (en diisi ulang dari copy mockup)
└── apps/web/                 ← BARU: satu app Next.js (App Router, TS), route /kid /parent /parent-web /console
```

- **Satu project Vercel** (bukan tiga seperti repo lama). Middleware `X-Robots-Tag: noindex` global.
- Supabase: Postgres + RLS + fungsi `SECURITY DEFINER` + `pg_cron`; Edge Function login anak dipakai ulang.
- Fonts & token warna: ekstrak dari CSS mockup ke CSS variables bersama (Fredoka + Plus Jakarta Sans;
  grape `#6C4CE0`; Spend `#FF7A4D` · Save `#2CA6E0` · Give `#F056A0` · Grow `#2FC078` + `-deep`/`-tint`).
- Dilarang menambah component library / CSS framework — CSS mockup sudah lengkap, port saja.

## 3. PROTOKOL ANTI-DIVERGENSI (baca dua kali — ini alasan fresh start)

1. **Proses port per layar, selalu urut:**
   a. **Ekstrak & baca** blok HTML/CSS/JS layar tsb. dari berkas mockup (grep, jangan mengarang dari ingatan).
   b. Tulis **inventaris layar**: elemen, state, interaksi, copy persis, warna, spacing, navigasi.
   c. Port ke komponen React mengikuti inventaris — struktur & copy identik.
   d. **Verifikasi berdampingan** (render app vs mockup di browser) sebelum lanjut layar berikutnya.
2. **Dilarang** mengubah layout, copy, warna, ikon, urutan menu, atau pola navigasi tanpa instruksi.
   Merasa ada yang aneh di mockup → tulis ke `docs/mockup-review.md`, kerjakan sesuai mockup.
3. **Deviasi yang DISETUJUI** (satu-satunya pengecualian; tandai `// DEVIASI:` di kode):
   - **D-A. Empty state.** Produksi mulai kosong; mockup penuh data demo. Empty state minimal
     (satu visual + satu kalimat + satu CTA) memakai token design yang sama.
   - **D-B. Paritas Fase 6.** Layar Sort anak membaca rasio auto-split & mode Strict/Flexible
     dari DB (`money_rules`), bukan teks mati "40/40/20 default". Disetujui Ghozy.
   - **D-C. Tombol demo → fungsi nyata.** Toast/tombol demo mockup diganti alur DB nyata;
     tampilan & rasa tetap sama.
   - **D-D. Sign up + reset password ortu.** Alur baru (tidak ada di mockup) — spec di
     `nummi-web-plan.md` Tahap 2; komponen form mengikuti gaya mockup parent.
4. **Copy Inggris apa adanya** dari mockup, semua string lewat `copy/en.ts`; `copy/id.ts`
   kerangka paralel, terjemahan belum dikerjakan (ADR-0016).

## 4. Invarian keras (tes harus menjaganya)

- **I1**: `Unsorted + Spend + Save + Give + Grow = Total`, selalu. Ledger **append-only** (ADR-0014).
- **Semua mutasi saldo lewat fungsi `SECURITY DEFINER`** — klien tidak pernah menulis
  balance/ledger langsung; RLS menegakkannya (migrasi 0009 sudah ada).
- **Approve ≠ fulfil** — dua kolom, hanya cash-out / prize / Give (ADR-0002).
- **Give menutup hanya setelah story-back ortu** (ADR-0006).
- **Grow keluar hanya lewat Harvest**; TD terkunci sampai jatuh tempo; Gold/Forex keluar butuh approval (ADR-0003).
- **Nol upsell, nol gembok Pro, nol iklan di `/kid`** (ADR-0009 + constraint C1/C2).
- **LLM tidak pernah menyentuh angka** (ADR-0008).
- **Data anak = anak di bawah umur** (UU PDP 27/2022): teks bebas anak tidak pernah dikirim ke pihak ketiga.

## 5. Keputusan yang dibawa vs dibatalkan

- **DIBAWA** (semua ADR engine & produk): 0001 Model A · 0002 approve≠fulfil · 0003 Grow simulasi ·
  0004 ekonomi ⭐/💎 · 0005 Strict default mati · 0006 Give flow · 0007 Take money kantong terlindungi ·
  0008 rapor formula · 0009 iklan hanya ortu · 0010 iOS IAP · 0011 streak dihapus *(engine — UI tetap
  ikut mockup, konflik badge dicatat di mockup-review)* · 0012 auth anak kode keluarga+PIN ·
  0014 append-only · 0016 bahasa Inggris · 0017 istilah lintas tier · 0018 harga sekali bayar ·
  0020 Middle saja.
- **DIBATALKAN**: **ADR-0022 (auth ortu OTP tanpa password)** → diganti ADR baru:
  **email + password + alur reset password**, sign up publik terbuka. Verifikasi email tidak
  memblokir pemakaian.
- **DIUBAH**: deploy 3 project Vercel → **1 project**; 3 app Next.js → **1 app multi-route**;
  "legacy = artefak beku" → **mockup = sumber kebenaran UI** (§0).

## 6. Data

- **Produksi mulai kosong** — tidak ada seed demo. Seed kanonik `packages/core/src/seed.ts`
  tetap ada **untuk test & `pnpm seed:dev` saja** (1 keluarga uji + 1 anak Middle).
- Default sistem (bukan data): auto-split 40/40/20, mode Flexible, wallet Save bawaan "Free savings".
- Format angka tampilan: ikuti mockup (lihat §0 — konflik format dicatat, keputusan final milik Ghozy).

## 7. Cara kerja

- **Plan → persetujuan Ghozy → build.** Per tahap dan per keputusan skema/dependency. Di dalam tahap,
  kerjakan per layar, commit kecil. Perbaikan bug jelas & typo tidak butuh persetujuan.
- **Edit bedah** (`str_replace`), bukan tulis ulang berkas. Grep dulu sebelum menimpa blok CSS/selector
  (pelajaran mahal 3× di proyek lama: `.field`/`.cta` terhapus ikut blok).
- Perintah khusus: `merge` = perbarui handoff · `tambah backlog` = perbarui backlog ·
  `audit` = periksa lintas-berkas, laporkan kontradiksi baru.
- Percakapan & dokumen: **Indonesia**. String UI: **Inggris**.
- Selesai tahap = Definisi Selesai `nummi-web-plan.md` + `pnpm test` hijau (termasuk I1) +
  verifikasi berdampingan seluruh layar tahap itu.

## 8. Yang DILARANG

- Mendesain ulang UI ("kanonik", "lebih rapi", "best practice") — itu penyebab kematian repo lama.
- Mengubah `packages/core` tanpa persetujuan; menulis balance dari klien; seed demo di produksi.
- Mengedit `reference/mockups/` — read-only selamanya.
- Menyentuh keputusan terbuka lewat kode; kalau pekerjaan memaksa keputusan baru, berhenti dan tanya.
