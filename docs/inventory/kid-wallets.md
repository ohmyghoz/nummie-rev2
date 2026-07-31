# Inventaris — `/kid` tab Wallets

Sumber: `reference/mockup-source/kid-mobile.source.jsx` · `walletsTab()` :364–403 ·
`iconBtn()` :405 · `cluster()` :416 · `pocket()` :433 · `spendPockets()` :451 ·
`savePockets()` :459 · `givePockets()` :467 · `growPockets()` :473

Cabang **Middle** saja. `simpleCat()` :406 hanya dipakai tier `little` — tidak diport (ADR-0020).

---

## Urutan blok

| # | Blok |
|---|---|
| 1 | Judul `Wallets` + dua tombol ikon |
| 2 | Baris saldo + tombol sembunyikan |
| 3 | Kantong utama (Unsorted) + tombol `Sort` |
| 4 | Empat akordeon: Spend · Save · Give · Grow |

---

## 1. Judul (:367)

`flex; justify-content: space-between; margin-top: 4px`

- `Wallets` — **Fredoka 700, 24px**, `--ink`, `letter-spacing: -.01em`
- Kanan: dua `iconBtn` (:405) — `•••` dan `🧾`, masing-masing `38×38`,
  `border-radius: 12px`, latar putih, `--sh-card`, `15px`

⚠️ **Kedua tombol itu tidak punya `onClick` di mockup** (:405 — tidak ada handler sama sekali).
Jadi tujuannya tidak diketahui. Jangan mengarang: port sebagai tombol tanpa aksi, atau tanyakan
dulu. Dugaan wajar `🧾` → History dan `•••` → menu, tapi dugaan bukan mockup.

## 2. Baris saldo (:374)

Kartu putih, `border-radius: 20px`, padding `16px 18px`, `--sh-card`,
`flex; justify-content: space-between`.

- label `My balance` — `11px/700`, `--ink-soft`, uppercase, `letter-spacing: .5px`
- nominal `money(total(), 30, { maskable: true })`
- tombol kanan `40×40`, `border-radius: 12px`, latar `--surface-2`, `18px` —
  glyph **`👁️` saat terlihat, `🙈` saat disamarkan**

**Mode samar** (`masked`, :382) berlaku ke seluruh nominal yang ditandai `maskable` — saat aktif,
`money()` :45 merender `Rp ••••` alih-alih angka, dengan font & warna yang sama.

Ini fitur privasi anak (layar bisa dilihat teman), bukan hiasan. Ia **state UI**, tidak disimpan
ke DB.

## 3. Kantong utama / Unsorted (:382)

`flex; gap: 12px`, latar `--brand-tint`, border `1px solid rgba(brand,.2)`,
`border-radius: 20px`, padding `15px`.

- ikon `44×44`, `border-radius: 13px`, latar **putih**, 🪙 `22px`
- judul `Main pocket · unsorted` — `12.5px/700`
- nominal `money(unsorted, 20, { maskable: true })`, margin `1px 0 2px`
- sub `Give it a job before you use it` — `10.5px`, `--ink-soft`
- tombol `Sort` → push `sort`; padding `10px 16px`, `border-radius: 12px`, `12.5px/700`

**Keadaan tombol** (:389): `disabled` saat `unsorted === 0`, latar jadi `#CFC7EA` (warna mati yang
sama dengan `pushCta` — jadikan token `--disabled`, lihat `kid-shell.md` §5).

Ini satu-satunya empty state yang **sudah** digambar mockup, dan ia menjawab pertanyaan D-A untuk
layar Sort: pintunya memang tertutup saat tidak ada yang perlu disortir.

## 4. Akordeon kategori (:398, komponen :416)

Empat, urut **Spend → Save → Give → Grow**:

| Emoji | Nama | Meta | Total |
|---|---|---|---|
| 🛍️ | `Spend` | `3 envelopes · use now` | total envelope |
| 🏦 | `Save` | `2 dreams + free savings` | total Save (**tanpa** Grow) |
| 💝 | `Give` | `Share with others` | saldo Give |
| 🌱 | `Grow` | `3 investments · needs OK` | total instrumen |

⚠️ Meta memuat **cacahan mati** (`3 envelopes`, `2 dreams`, `3 investments`). **D-C:** dihitung
dari wallet nyata, termasuk bentuk tunggal (`1 envelope`).

**Kepala akordeon** (tombol, :419):
- latar `<kategori>-tint`, padding `15px`, `gap: 13px`
- ikon `44×44`, `border-radius: 13px`, latar putih, emoji `22px`
- nama `15px/700` berwarna **`<kategori>-deep`**
- meta `10.5px` berwarna `rgba(<deep>, .75)`
- total `money(total, 20, { color: deep, maskable: true })`, rata kanan
- chevron `⌄` `20px`, warna `deep`, `rotate(180deg)` saat terbuka, `transition: transform .2s`

**Badan** (saat terbuka): latar putih, padding `14px`,
`grid-template-columns: 1fr 1fr; gap: 12px`, `animation: cel-fade .25s`.

⚠️ **Hanya satu akordeon terbuka pada satu waktu** (:417 — `accordion` menyimpan satu kunci; klik
yang terbuka menutupnya). Bawaan: `accordion: 'spend'` (:29). Perilaku ini mudah hilang saat
diport jadi empat komponen mandiri — **jaga ia satu state bersama.**

## 5. Kartu kantong (`pocket()` :433)

Dua bentuk.

### Normal
Latar `--surface-2`, border `1px solid var(--line)`, `border-radius: 16px`, padding `13px`,
`min-height: 96px`, `flex-direction: column; gap: 8px`.

- **ikon**: `36×36`, `border-radius: 11px`, latar tint, emoji `18px` — **atau**, bila
  `opts.ring` ada, cincin progres `40×40` tebal `4px` dengan emoji di tengahnya (`progRing` :93)
- **nama**: `12px/700`, satu baris, `text-overflow: ellipsis`
- **tag** opsional: `9px/700`, padding `1px 6px`, `border-radius: 6px`
- **nominal**: `money(amt, 17, { maskable: true })`
- **sub**: `9.5px`, `line-height: 1.3`, warna `--ink-soft` (atau `opts.subCol`)
- **aksi** opsional: baris tombol, `gap: 6px`

### Dashed (tambah baru)
Latar transparan, **border `2px dashed var(--line)`**, isinya `＋` (U+FF0B, `22px`, `--ink-soft`)
di atas label `11px/600` rata tengah. Ukuran sama dengan kartu normal.

⚠️ Kartu dashed **tidak punya `onClick`** di mockup (:434). Tujuannya harus ditentukan saat
porting — catat sebagai keputusan, bukan tebakan diam-diam.

## 6. Isi tiap kategori

### Spend (:451)
`🍡 Snacks` · `🚌 Transport` · `🎮 Games` — semuanya sub `Spend envelope` — lalu dashed
`+ New envelope`.

### Save (:459)
- `🚲 BMX Bike` — **dengan cincin progres**, sub `Dream · {pct}% of Rp 300k`
- `🎧 Headphones` — cincin progres, sub `Dream · {pct}% of Rp 100k`
- `💭 Free savings` — tanpa cincin, sub `No target yet`
- dashed `+ New dream`

Pembedanya **`kind`**, bukan nama: `dream` punya target → cincin; `free_savings` tidak. Skema
sudah menegakkannya (`target_only_on_dream`, migrasi 0001).

⚠️ `Rp 300k` / `Rp 100k` adalah singkatan **k**, format ketiga di app ini (setelah `Rp 300,000` di
Home dan `Rp50.000` milik brand). Setelah MR-2, pilih satu — saran: `formatRp()` penuh, karena
`Rp300.000` muat di ruang itu.

### Give (:467)
- `💝 Ready to give` — sub `Last: Fri · Rp 10,000`
- dashed `+ Giving history`

⚠️ `+ Giving history` di kartu **dashed** aneh: dashed berarti "buat baru" di tiga kategori lain,
tapi di sini berarti "lihat riwayat". → `docs/mockup-review.md`.

### Grow (:473)
- `🏦 Time Deposit` — tag `✅ Matured` (teks `--grow-deep`, latar `--grow-tint`),
  sub `Rp 30k + Rp 750 interest`, aksi `Harvest`
- `🪙 Gold` — tag `🔒 OK` (teks `--ink-soft`, latar `--track`), sub `▼ 8.9% · 14.5 mg`
  **berwarna `--loss`**, aksi `Harvest`
- `💵 US Dollar` — tag `🔒 OK`, sub `▼ 1.8% · US$ 0.62` warna `--loss`, aksi `＋ Add` + `Harvest`
- dashed `+ Grow money`

Tombol `Harvest`: latar `--grow`, putih, `border-radius: 9px`, padding `6px 10px`, `10.5px/700`.
`＋ Add`: latar putih, border `1px solid var(--line)`, warna `--ink`.

Yang harus dipertahankan:
- **`🔒 OK` = butuh persetujuan ortu** (ADR-0003), bukan hiasan
- **rugi ditampilkan apa adanya** — `▼ 8.9%` berwarna `--loss`. Emas turun tidak disembunyikan;
  itu justru pelajarannya
- berat/nominal asing (`14.5 mg`, `US$ 0.62`) memakai `formatGoldWeight()` yang sudah ada di
  `packages/core/src/money.ts` — jangan tulis pemformat kedua

---

## Ringkasan deviasi

| Kode | Apa |
|---|---|
| **D-A** | tiap kategori kosong; anak tanpa dream/envelope/instrumen |
| **D-C** | daftar kantong & cacahan meta dari `wallets`; persen & progres dihitung; `Last: Fri` dari ledger |
| **MR-2** | tiga format nominal (`Rp 300,000`, `Rp 300k`, `Rp50.000`) → satu |

## Yang perlu diputuskan saat porting

1. **Tujuan `•••` dan `🧾`** (§1) — tidak ada di mockup.
2. **Tujuan setiap kartu dashed** (§5) — termasuk keanehan `+ Giving history` di Give.
3. **Singkatan `k`** (§6 Save) — dipertahankan atau seragam ke `formatRp()`.
