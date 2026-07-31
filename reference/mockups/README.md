# reference/mockups/ — SUMBER KEBENARAN UI, read-only

Empat permukaan MVP dalam bentuk HTML mandiri.

> **Baca ini kalau kamu pernah bekerja di repo lama.** Di `Nummie-test`, berkas-berkas ini duduk
> di `legacy/` dan README-nya berbunyi: *"referensi visual dan riwayat keputusan, **bukan sumber
> kebenaran**."* Kalimat itulah yang memberi izin setiap sesi mendesain ulang layar atas nama
> "lebih rapi" — dan itulah yang membunuh repo lama.
>
> **Di repo ini aturannya dibalik** (AGENTS.md §0): berkas di direktori ini **adalah** sumber
> kebenaran untuk layout, copy, warna, urutan menu, navigasi, dan interaksi. Kalau app menyimpang
> dari mockup, **app yang salah**.

| Berkas | Permukaan | Route | Bentuk |
|---|---|---|---|
| `kid-mobile.html` | anak, HP | `/kid` | bundle React satu-berkas |
| `parent-mobile.html` | ortu, HP | `/parent` | bundle React satu-berkas |
| `parent-web.html` | ortu, desktop | `/parent-web` | bundle React satu-berkas |
| `console.html` | admin | `/console` | HTML biasa (`:root` CSS variables) |

## Read-only selamanya

**Jangan mengedit berkas di direktori ini** (AGENTS.md §8). Merasa ada yang aneh di mockup →
tulis ke [`docs/mockup-review.md`](../../docs/mockup-review.md), lalu **kerjakan sesuai mockup**.
Ghozy yang memutuskan belakangan. Memperbaiki mockup diam-diam menghapus bukti konfliknya.

## Cara membacanya — jangan `grep` ke sini

Tiga berkas pertama adalah bundle: kode layarnya terkubur di dalam string JSON. `grep` ke berkas
HTML mentah **gagal tanpa memberitahumu**:

```
grep -F "\"Today's mission\"" reference/mockups/kid-mobile.html          → 0 hasil
grep -F "\"Today's mission\"" reference/mockup-source/kid-mobile.source.jsx → 1 hasil
```

Nol hasil itu bukan berarti tidak ada — di dalam JSON, `"` tersimpan sebagai `\"`. Pencarian yang
cocok pun tidak menolong: ia mengembalikan satu baris sepanjang 113.348 karakter.

**Cari di [`../mockup-source/`](../mockup-source/)**, yang dihasilkan dari direktori ini oleh
`pnpm mockups:unpack`. Alasan lengkapnya ada di kepala `tools/unpack-mockups.mjs`.

## Kenapa lima berkas terpisah ini berbahaya (riwayat yang perlu dibawa)

Kelima mockup asli tidak live-linked satu sama lain — angkanya disamakan manual. Audit 28 Juli 2026
membuktikan biayanya nyata: target dream, request pending, dan rasio auto-split sudah menyimpang
antar-permukaan tanpa ada yang menyadari (X2, X3, X4). X4 **masih hidup di `parent-mobile.html`**
sampai hari ini — lihat MR-5 di `docs/mockup-review.md`.

Itu bukan kelalaian, itu sifat berkas terpisah. Karena itu **angka** kanonik hidup di satu tempat:
`packages/core/src/seed.ts`, dengan test yang gagal kalau totalnya tidak cocok.

Perhatikan pembagiannya, karena inilah yang paling mudah salah dibaca:

| | Sumber kebenaran |
|---|---|
| Layout · copy · warna · navigasi · interaksi | **mockup** (direktori ini) |
| Angka · aturan uang · invarian | **`packages/core`** + ADR di `docs/decisions/` |

Mockup menang soal tampilan. Ia tidak pernah menang soal uang.

## Yang tidak dibawa dari repo lama

`kid-ipad.html` (iPad ditunda, di luar cakupan) · `celengan-home-mockup.html` dan
`celengan-parent-mockup.html` (sudah digantikan; membawanya hanya menambah peluang sesi baru
mengedit berkas yang salah — X9).
