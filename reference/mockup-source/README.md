# reference/mockup-source/ — GENERATED, jangan diedit

Isi direktori ini dihasilkan oleh `tools/unpack-mockups.mjs` dari
[`../mockups/`](../mockups/). **Jangan mengedit apa pun di sini** — suntinganmu akan hilang pada
regenerasi berikutnya, dan sementara itu ia berbohong tentang isi mockup.

```bash
pnpm mockups:unpack
```

Idempoten, nol dependency. Aman dijalankan kapan saja.

## Ini bukan sumber kebenaran

Sumber kebenaran UI tetap `reference/mockups/*.html` (AGENTS.md §0). Direktori ini hanya
membuatnya **bisa dicari** — ia salinan turunan, bukan pengganti.

## Isinya

| Berkas | Apa |
|---|---|
| `<nama>.source.jsx` | kode komponen layar — **di sinilah kamu mencari** |
| `<nama>.fonts.html` | blok `@font-face`: keluarga + bobot yang benar-benar dipakai mockup |
| `console.source.html` | `console.html` apa adanya (tidak dibundel; `:root` token lengkap) |

## Kenapa direktori ini ada

`grep` ke berkas HTML mentah gagal dengan diam — bukan dengan galat. Penjelasan lengkap plus
angka pengukurannya ada di kepala `tools/unpack-mockups.mjs`; ringkasnya, pencarian yang memuat
kutip ganda mengembalikan **nol hasil** untuk teks yang jelas ada di layar, karena di dalam string
JSON `"` tersimpan sebagai `\"`.

AGENTS.md §3a mewajibkan setiap port layar dimulai dari "ekstrak & baca blok HTML/CSS/JS layar
tsb. dari berkas mockup (grep, jangan mengarang dari ingatan)". Direktori inilah yang membuat
kalimat itu bisa dipatuhi.

## Kenapa hasilnya ikut di-commit, bukan digenerate saat dibutuhkan

Karena langkah build yang bisa dilewati **akan** dilewati. Sesi yang lupa menjalankan
`pnpm mockups:unpack` tidak mendapat galat — ia mendapat direktori kosong, menyimpulkan mockupnya
tidak memuat apa yang dicari, lalu mengarang. Itu persis kegagalan yang harus dicegah repo ini.
Ongkosnya ±380 KB teks; itu murah.
