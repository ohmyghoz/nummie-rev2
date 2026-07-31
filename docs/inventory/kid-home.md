# Inventaris — `/kid` tab Home

Sumber: `reference/mockup-source/kid-mobile.source.jsx` · `homeTab()` :212–336 ·
`qaBtn()` :337 · `goalCard()` :338 · `activityRow()` :352

Semua nilai di bawah adalah cabang **Middle** (`tier === 'middle'`, faktor `big = 1`).
Cabang `little`/`teen` tidak diport (ADR-0020).

---

## Urutan blok — jangan diubah

Dirender ke `scrollArea` dengan `gap: 18px`, urut:

| # | Blok | Selalu ada? |
|---|---|---|
| 1 | Topbar (avatar · sapaan · pil ⭐) | ya |
| 2 | Hero (ring + total) | ya |
| 3 | Banner Unsorted | **hanya bila `unsorted > 0`** (:278) |
| 4 | Banner request pending | **hanya bila ada pending** (:289) |
| 5 | `My wallets` + grid 4 kartu | ya |
| 6 | `My dreams` + 2 kartu | ya (Middle) |
| 7 | Kartu Today's mission | ya (Middle) |
| 8 | Dua tombol aksi cepat | ya |
| 9 | `Just now` + 3 baris aktivitas | ya |

Blok 3 & 4 **muncul-hilang**, dan itu perilaku, bukan kebetulan data demo.

---

## 1. Topbar (:254)

`display: flex; align-items: center; gap: 12px; margin-top: 4px`

| Elemen | Spesifikasi |
|---|---|
| Avatar | tombol `46×46`, `border-radius: 14px`, latar `--surface-2`, **`box-shadow: 0 0 0 2px #FFB020`** (cincin amber = `--sun`), emoji `🦊` `24px`. → tab `me` |
| Sapaan | **Fredoka 700, 17px**, `--ink`, `letter-spacing: -.01em` — `Hi, Arthur!` |
| Sub | `11.5px`, `--ink-soft` — `Let's check your money today` |
| Pil ⭐ | latar putih, `border-radius: 999px`, padding `7px 12px`, `--sh-card`, `13px/700` — `⭐ 120` |

Copy `Hi, {child}!` dan `Let's check your money today` sudah ada di `copy/en.ts` §home
(`greeting`, dan sub perlu ditambahkan saat porting).

⚠️ Pil ⭐ menampilkan **saldo bintang**, bukan lifetime (ADR-0004 memisahkan keduanya).

## 2. Hero (:263)

Kartu putih, `border-radius: 26px`, padding `20px`, `--sh-card`,
`display: flex; align-items: center; gap: 18px`.

**Kiri — ring donat** `118×118` (`ring(heroSize, 12, segs())` :86/:64):
- tebal `12px`
- segmen mengikuti `segs()` :64 — proporsi Unsorted · Spend · Save · Give · Grow, warna kategori
- di tengah: `TOTAL` (`9px`, `font-weight: 800`, `letter-spacing: 1.5px`, `--ink-soft`) lalu 💰 `22px`

**Kanan:**
- eyebrow `All your money` — `11px/700`, `--ink-soft`, uppercase, `letter-spacing: .5px`
- nominal `money(total(), 34)` — Fredoka, margin `4px 0 6px`
- catatan `Split into 5 parts in the ring ↖︎` — `11px`, `--ink-soft`, `line-height: 1.35`

⚠️ **`5 parts` dihitung, bukan tetap.** `nParts` :220 = 5 untuk Middle. Saat diport, angkanya
harus mengikuti jumlah kategori yang benar-benar punya isi — kalau tidak, anak yang Grow-nya
kosong membaca kalimat yang salah. Panah `↖︎` (U+2196 U+FE0E) menunjuk ke ring.

## 3. Banner Unsorted (:279) — **hanya bila `unsorted > 0`**

Tombol penuh, latar `var(--brand-grad)`, `border-radius: 22px`, padding `16px`,
`box-shadow: 0 8px 30px rgba(brand,.4)`, `gap: 13px`. → push `sort`

| Elemen | Spesifikasi |
|---|---|
| Ikon | `46×46`, `border-radius: 14px`, latar `rgba(255,255,255,.22)`, 🪙 `24px` |
| Judul | **Fredoka 600, 18px**, putih — `{amount} just arrived!` |
| Sub | `11.5px`, `rgba(255,255,255,.85)` — `Not sorted yet — where should it go?` |
| Panah | lingkaran `36×36` putih, glyph `→`, `18px/700`, warna brand |

Tanda hubung di `Not sorted yet — where…` adalah **em dash** (U+2014).

## 4. Banner pending (:290) — **hanya bila ada request menunggu**

Tombol, border `1px solid var(--line)`, latar `--surface-2`, `border-radius: 16px`,
padding `11px 14px`, `gap: 11px`. → push `requests`

- ⏳ `18px`
- Judul `{n} request waiting` / `{n} requests waiting` — **pluralisasi ada di mockup** (:293),
  `12.5px/700`
- Sub `Waiting for a grown-up to say yes` — `11px`, `--ink-soft`
- Chevron `›` `16px`, `--ink-soft`

## 5. My wallets (:300)

`sectionLabel('My wallets', 'See all', → tab wallets)`, lalu grid
`grid-template-columns: 1fr 1fr; gap: 12px` berisi **4 kartu** (:242–249):

| Emoji | Nama | Nilai | Warna |
|---|---|---|---|
| 🍡 | `Spend` | total envelope | `--spend` |
| 🏦 | `Save` | total Save (**tanpa** Grow) | `--save` |
| 💝 | `Give` | saldo Give | `--give` |
| 🌱 | `Grow` | total instrumen | `--grow` |

Tiap kartu (:224): latar putih, `border-radius: 20px`, padding `14px`, `--sh-card`. Isi:
- ikon `38×38`, `border-radius: 12px`, latar `<kategori>-tint`, emoji `20px`
- nama `13px/700`
- nominal `money(amt, 20)`
- bar `height: 6px`, `border-radius: 3px`, track `--track`, isi warna kategori

⚠️ **Persen bar di mockup adalah angka mati** (`55`, `80`, `35`, `45` :242–249) dan **tidak
berhubungan dengan nominalnya**. Saat diport, ia harus jadi proporsi nyata terhadap total — atau
bar itu berbohong. Ini **D-C** (tampilan sama, angkanya jadi nyata).

Semua kartu → tab `wallets` (:224).

## 6. My dreams (:305)

`sectionLabel('My dreams', 'All dreams', → tab wallets)`, lalu `display: flex; gap: 12px` berisi
dua `goalCard` (:338).

Copy baris bawah (:307–308):
`{terkumpul} of {target} · {sisa} to go`

⚠️ Target `Rp 300,000` / `Rp 100,000` **mati di mockup**. Nyatanya dari `wallets.target_amount`
(migrasi 0001). **D-C.**

⚠️ **D-A wajib di sini:** anak tanpa dream sama sekali. Mockup selalu punya dua.

## 7. Today's mission (:311)

Tombol, latar putih, `border-radius: 20px`, padding `14px`, `--sh-card`, `gap: 12px`.

- ikon `42×42`, `border-radius: 13px`, latar `--brand-tint`, 🎯 `21px`
- eyebrow `Today's mission` — `10px`, `font-weight: 800`, `letter-spacing: .5px`, uppercase, brand
- badan `11.5px`, `--ink`, `line-height: 1.35`
- tombol `Go` — latar brand, putih, `border-radius: 12px`, padding `8px 14px`, `12px/700`

**Tujuan bercabang** (:311): `unsorted > 0` → push `sort`; selain itu → tab `missions`.

⚠️ Teks misi memuat `Move Rp 10,000 into your dream →` — nominal **di dalam kalimat**. Ini kasus
**MR-4**: ia tidak melewati `formatRp()`, jadi harus disisir manual ke `Rp10.000`.

## 8. Aksi cepat (:324)

`display: flex; gap: 12px`, dua tombol `qaBtn` (:337) — masing-masing `flex: 1`, latar putih,
`border-radius: 16px`, padding `13px`, `--sh-card`, rata tengah, `12.5px/600`, `--ink`.

| Label | Aksi |
|---|---|
| `💸 Request cash out` | push `cashout` |
| `🔄 Move money` | push `move` |

Label = `emoji + ' ' + teks` dalam satu string.

## 9. Just now (:326)

`sectionLabel('Just now', 'History', → push history)`, lalu kartu putih `border-radius: 20px`,
padding `4px 14px`, `--sh-card`, berisi **3** `activityRow` dipisah garis `height: 1px`,
latar `var(--line)`.

Baris demo (:328–332) — **D-C**, diganti ledger nyata, urut terbaru dulu, dibatasi 3:

| Emoji | Tint | Judul | Waktu | Nominal | Warna nominal |
|---|---|---|---|---|---|
| 🎁 | `--grow-tint` | `Gift from Mom` | `Today 08:20` | `+50,000` | `--grow` |
| 🏦 | `--save-tint` | `Saved to BMX Bike` | `Yesterday 16:05` | `−25,000` | `--ink` |
| 💝 | `--give-tint` | `Friday giving` | `Fri 11:30` | `−10,000` | `--ink` |

Pola yang harus dipertahankan: **uang masuk berwarna kategori, perpindahan internal berwarna
`--ink`.** Tanda minus adalah `−` (U+2212).

⚠️ Nominal di sini `+50,000` — tanpa `Rp` dan berkoma. Setelah MR-2 jadi `+Rp50.000`.

⚠️ **D-A wajib:** ledger kosong.

---

## Ringkasan deviasi

| Kode | Di mana | Apa |
|---|---|---|
| **D-A** | dreams · aktivitas · wallet kosong | empty state: satu visual + satu kalimat + satu CTA |
| **D-C** | bar persen · target dream · baris aktivitas · pil ⭐ | angka mati → data nyata, tampilan sama |
| **MR-2/MR-4** | seluruh nominal | `formatRp()`; angka di dalam kalimat misi disisir manual |

## Yang perlu diputuskan saat porting

1. **`Split into N parts`** — N dihitung dari kategori berisi, atau tetap 5? Saran: dihitung.
2. **Persen bar kartu wallet** — proporsi terhadap total keseluruhan, atau terhadap target
   kategori? Mockup tidak menjawab; saran: terhadap total, konsisten dengan ring hero.
