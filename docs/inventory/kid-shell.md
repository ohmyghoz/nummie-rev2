# Inventaris — `/kid` shell

Kerangka yang membungkus setiap layar anak. Diport **sekali**, dipakai semua tab.

Sumber: `reference/mockup-source/kid-mobile.source.jsx` · `frame()` :149 · `statusBar()` :162 ·
`bottomNav()` :169 · `scrollArea()` :187 · `tabContent()` :194 · `sectionLabel()` :203 ·
`pushHeader()` :828 · `pushBody()` :838 · `pushCta()` :839 · `stepper()` :843

---

## 1. Frame perangkat — **TIDAK diport**

`frame()` :149 menggambar bingkai iPhone: `390×812`, `border-radius: 52px`, badan `#141024`,
padding `11px`, layar dalam `border-radius: 42px`, plus notch `150×30` (:153).

**Ini alat presentasi mockup, bukan bagian produk.** `/kid` berjalan di browser HP sungguhan —
bingkai dan notch-nya milik perangkat. Yang diport adalah **isi** layar dalam.

Yang tetap diambil dari sini: viewport acuan **390 px**, dan `overflow: hidden` + radius pada
kontainer terluar tidak berlaku.

## 2. Status bar — **TIDAK diport**

`statusBar()` :162 menggambar `9:41` dan `📶 🔋` (tinggi `50px`, padding `0 26px 6px`).

Palsu. HP sungguhan menggambarnya sendiri.

⚠️ **Tapi tingginya berpengaruh.** `scrollArea()` :189 menaruh status bar sebagai anak pertama,
jadi konten mulai `50px` dari atas. Saat diport, ruang itu diganti **safe-area inset**:

```css
padding-top: max(12px, env(safe-area-inset-top));
```

Kalau diganti `50px` mati, layar akan salah di setiap perangkat yang notch-nya berbeda — dan
`env(safe-area-inset-*)` bernilai 0 tanpa `viewportFit: 'cover'`, jebakan yang sudah pernah
memakan waktu di repo lama (`docs/nummi-status.md`).

## 3. Area gulir — diport

`scrollArea(children, dark)` :187

| | |
|---|---|
| Posisi | `absolute; inset: 0; overflow-y: auto` |
| Padding badan | `2px 18px 100px` — bawah `100px` memberi ruang bottom nav (`78px`) + napas |
| Jarak antar-blok | `gap: 18px` (Middle) |

`18px` kiri-kanan adalah **satu-satunya gutter horizontal** di seluruh app anak. Setiap kartu
melebar penuh di dalamnya.

## 4. Bottom nav — diport

`bottomNav()` :169

| | |
|---|---|
| Posisi | `absolute; bottom: 0; left/right: 0`, tinggi `78px`, `z-index: 40` |
| Latar | `rgba(255,255,255,.92)` + `backdrop-filter: blur(14px)` |
| Garis atas | `1px solid var(--line)` (`C.hair` = `#EBE6F5`) |
| Padding | `0 14px 14px` |

**Urutan persis** (:176–178) — jangan diurutkan ulang:

| Slot | Ikon | Label | Tujuan |
|---|---|---|---|
| 1 | 🏠 | `Home` | tab `home` |
| 2 | 👛 | `Wallets` | tab `wallets` |
| 3 | — | *(spacer `flex: 1`)* | — |
| 4 | 🎯 | `Missions` | tab `missions` |
| 5 | 🙂 | `Me` | tab `me` |

**FAB di tengah** (:179), menimpa spacer:

- `58×58`, `border-radius: 20px`, latar `var(--brand-grad)`, border `4px solid #fff`
- `box-shadow: 0 8px 30px rgba(brand, .4)`
- Glyph `＋` (fullwidth plus, U+FF0B — **bukan** `+` biasa), `font-size: 30px`, `font-weight: 300`
- Label di bawahnya: `Money`, `10px`, `font-weight: 700`, warna brand
- Posisi `top: -24px` → menyembul di atas garis nav
- Aksi: membuka **sheet** (§6), bukan berpindah tab

**Keadaan item nav:**

| | Aktif | Tidak aktif |
|---|---|---|
| Ikon | normal | `filter: grayscale(1) opacity(.7)` |
| Label | `font-weight: 700`, warna brand | `font-weight: 600`, `var(--ink-soft)` |

## 5. Push screen — diport

Layar yang menutupi tab (Sort, Cash out, Move, …). Tiga bagian, selalu urut:

**`pushHeader(title, needs)`** :828 — status bar, lalu baris `padding: 0 18px 12px`:
- tombol kembali `‹` : `40×40`, `border-radius: 13px`, latar putih, `box-shadow: var(--sh-card)`
- judul: **Fredoka 700, 20px**, `letter-spacing: -.01em`
- `needsChip()` opsional di kanan (:818)

**`pushBody(children)`** :838 — `flex: 1; overflow-y: auto`, padding `4px 18px 120px`, `gap: 14px`.
Padding bawah `120px` memberi ruang CTA melayang.

**`pushCta(label, enabled, onClick)`** :839 — tombol melayang di bawah:
- kontainer `absolute; bottom: 0`, padding `16px 18px 24px`
- latar `linear-gradient(to top, <canvas> 70%, transparent)` — konten terlihat memudar di baliknya
- tombol lebar penuh, `border-radius: 16px`, padding `16px`, `15px/700`
- **aktif**: latar brand + `box-shadow: 0 8px 24px rgba(brand,.35)`
- **nonaktif**: latar `#CFC7EA`, tanpa bayangan, `cursor: default`

⚠️ `#CFC7EA` adalah warna mati yang tidak ada di `tokens.css`. Tambahkan sebagai
`--disabled` saat porting — jangan tulis sebagai literal di komponen.

**`stepper(val, onMinus, onPlus, disMinus, disPlus)`** :843 — `−` / nominal / `+`:
- tombol `34×34`, `border-radius: 11px`, latar putih + bayangan; nonaktif → latar `--surface-2`,
  tanpa bayangan, warna `--line`
- nominal di tengah, `min-width: 54px`, dirender `money(val, 16)`
- glyph minus adalah **`−` (U+2212)**, bukan hyphen

## 6. Sheet & toast — diport

**Sheet** (`sheet()` :783) muncul dari FAB. Isinya diinventarisasi bersama layar Add money.

**Toast** (:158): `absolute; bottom: 100px; left: 50%`, `z-index: 90`, latar `var(--ink)`, teks
putih, padding `11px 18px`, `border-radius: 14px`, `12.5px/600`, `max-width: 300px`, rata tengah,
animasi `cel-toast 2.6s both`.

## 7. `sectionLabel(title, link, onLink)` — diport

:203 — dipakai berulang di Home & Wallets.

- Baris `flex`, `align-items: baseline`, `justify-content: space-between`, margin `2px 2px -4px`
  (margin bawah **negatif** — mendekatkan label ke isinya)
- Judul: **Plus Jakarta Sans 700, 14px**, `var(--ink)`
- Tautan kanan opsional: `12px/600`, warna brand, `white-space: nowrap`

---

## Catatan porting

- **Nol library.** Semua di atas CSS biasa (AGENTS.md §2).
- **Emoji adalah copy**, bukan ikon yang boleh ditukar set ikon.
- Tier `little`/`teen` di mockup **tidak** diport (ADR-0020) — tapi jangan hapus percabangannya
  dari catatan ini; ia menjelaskan kenapa beberapa nilai tampak punya varian.
- Empty state (**D-A**) belum ada di shell — ia milik masing-masing layar.
