# Inventaris — `/kid` push screen Sort

Sumber: `reference/mockup-source/kid-mobile.source.jsx` · `sortScreen()` :849–901 ·
`stepper()` :843 · `pushCta()` :839

Layar tempat anak memberi tugas pada uang yang baru masuk. **Deviasi D-B ada di sini**, dan ia
lebih besar daripada yang tertulis di AGENTS.md.

---

## Struktur

`pushHeader('Sort your money')` → `pushBody([...])` → `pushCta('Put money in wallets', …)`

Isi body, urut:

| # | Blok |
|---|---|
| 1 | Kartu ringkasan `Left to sort` + tombol `Auto-split` |
| 2 | Baris petunjuk (satu kalimat) |
| 3 | Satu kartu per tujuan, masing-masing dengan stepper + bar |

---

## 1. Kartu ringkasan (:866)

Latar `var(--brand-grad)`, `border-radius: 22px`, padding `18px`,
`box-shadow: 0 8px 30px rgba(brand,.35)`, `flex; justify-content: space-between`.

**Kiri:**
- label `Left to sort` — `11px/700`, `rgba(255,255,255,.8)`, uppercase
- nominal `money(remainder, 32, { color:'#fff', rpColor:'rgba(255,255,255,.7)' })` —
  Fredoka, dan **`Rp`-nya sedikit lebih redup daripada angkanya**

**Kanan — tombol `Auto-split`:** latar `rgba(255,255,255,.22)`, putih, `border-radius: 13px`,
padding `11px 15px`, `12.5px/700`.

`remainder = unsorted − Σ alokasi` (:856) dan **berkurang saat anak mengalokasikan**.

## 2. Baris petunjuk (:873)

`11.5px`, `--ink-soft`, rata tengah. Bunyi persisnya di mockup:

> `Middle mode: sort right down to a sub-wallet. · 40% Spend / 40% Save / 20% Give default`

⚠️ Keduanya bermasalah:

- **`Middle mode: …`** menjelaskan tier kepada anak. Middle satu-satunya tier di MVP (ADR-0020),
  jadi kalimat itu membandingkan dengan sesuatu yang tidak ada. **Buang paruh pertamanya.**
- **`40% Spend / 40% Save / 20% Give default`** adalah teks mati — inti **D-B**.

## 3. Kartu tujuan (:874)

Satu per tujuan: latar putih, `border-radius: 18px`, padding `14px`, `--sh-card`.

Baris atas (`flex; gap: 11px`):
- ikon `40×40`, `border-radius: 12px`, latar `<kategori>-tint`, emoji `20px`
- nama `13px/700`, `--ink`
- nominal teralokasi `11px/600` berwarna **kategori**
- `stepper` di kanan

Bar bawah: `height: 6px`, `border-radius: 3px`, track `--track`, isi
`width: alokasi / unsorted × 100%`, `transition: width .2s`.

**Daftar tujuan mockup** (:852) — 7 buah, semuanya nama mati:

| id | Emoji | Nama | Kategori |
|---|---|---|---|
| `snacks` | 🍡 | Snacks | Spend |
| `transport` | 🚌 | Transport | Spend |
| `games` | 🎮 | Games | Spend |
| `bmx` | 🚲 | BMX Bike | Save |
| `headphones` | 🎧 | Headphones | Save |
| `free` | 💭 | Free savings | Save |
| `give` | 💝 | Ready to give | Give |

**D-C:** nyatanya dari `wallets` milik anak itu. Perhatikan **Grow tidak ada di daftar ini** —
uang tidak bisa langsung disortir ke Grow, dan itu benar (ADR-0003: Grow lewat approval ortu).

## 4. Stepper (:843, dipakai :882)

- Langkah **`step = 5000`** (:857) — tetap, tidak menyesuaikan nominal
- `−` nonaktif saat alokasi `≤ 0`
- `+` nonaktif saat **`remainder < step`** — jadi anak tidak bisa mengalokasikan lebih dari sisa
- Nominal tengah `money(v, 16)`

⚠️ `step` tetap `5.000` membuat uang saku `Rp7.000` mustahil dihabiskan. Perlu diputuskan
(lihat §Keputusan).

## 5. Auto-split (:859)

```js
alloc = { snacks: round(u*0.4/step)*step, free: round(u*0.4/step)*step }
alloc.give = u − alloc.snacks − alloc.free
```

Dua hal yang layak ditiru, dan satu yang tidak:

✅ **Pembulatan ke kelipatan `step`** — hasilnya angka bulat yang bisa diutak-atik stepper.
✅ **Kantong terakhir menerima sisanya**, bukan dihitung terpisah — jadi totalnya **selalu** persis
`unsorted`, tanpa rupiah nyasar akibat pembulatan. Pola ini **wajib dipertahankan**.
❌ Rasio `0.4 / 0.4 / sisa` dan tujuan `snacks`/`free`/`give` mati di kode.

## 6. CTA (:901)

```js
pushCta('Put money in wallets', remainder === 0 && allocated > 0, confirm)
```

### ⚠️ Temuan: mockup ini hanya mengimplementasikan mode **Strict**

Tombolnya **tidak aktif kecuali seluruh uang teralokasi**, dan `confirm()` (:896) menyetel
`nd.unsorted = 0` tanpa syarat.

Itu persis definisi **Strict** (ADR-0005). Tapi **Strict default MATI** — mode bawaan adalah
**Flexible**, tempat sisa boleh tinggal di Unsorted (`nummi-web-plan.md` Tahap 1 no.3, dan
`create_child()` menyetel `mode = 'flexible'`).

Jadi mockup mengimplementasikan mode yang **bukan** default produk, dan mode default-nya **tidak
pernah digambar**. Ini bukan sekadar teks mati — perilaku tombolnya sendiri yang berbeda.

**Konsekuensi untuk porting:**

| Mode | CTA aktif saat | Setelah konfirmasi |
|---|---|---|
| **Flexible** (default) | `allocated > 0` | sisa **tetap** di Unsorted |
| **Strict** | `remainder === 0 && allocated > 0` — persis mockup | Unsorted jadi 0 |

Strict juga butuh **penjelasan kenapa tombolnya terkunci** (Tahap 1 no.3) — juga tidak ada di
mockup. Ditulis mengikuti gaya baris petunjuk (§2).

## 7. Konfirmasi (:889)

Mockup memindahkan angka di state lalu:
- `push: null`, `tab: 'home'` — kembali ke Home, bukan ke layar sebelumnya
- toast: `Sorted! Same total, new jobs. 💪`

Toast-nya bagus dan **dipertahankan** — ia menyebut invarian I1 dalam bahasa anak: *jumlahnya
sama, tugasnya baru*. Nyatanya satu panggilan `SECURITY DEFINER`, bukan mutasi state (**D-C**).

---

## Ringkasan deviasi

| Kode | Apa |
|---|---|
| **D-B** | Rasio & tujuan auto-split dari `money_rules`; mode Strict/Flexible dari DB — **termasuk perilaku CTA**, bukan hanya teksnya |
| **D-C** | Daftar tujuan dari `wallets` anak; konfirmasi lewat fungsi `SECURITY DEFINER` |
| **D-A** | Layar ini saat `unsorted = 0` — mockup tidak pernah menggambarnya |

## Yang perlu diputuskan sebelum porting

1. **Langkah stepper `Rp5.000`.** Uang saku yang bukan kelipatan 5.000 tidak akan bisa dihabiskan
   di mode Strict. Saran: langkah menyesuaikan nominal (mis. `1.000` bila `unsorted < 50.000`),
   atau tambahkan tombol "sisanya ke sini".
2. **Kalimat petunjuk pengganti.** `Middle mode: …` dibuang; rasio jadi dinamis. Usul:
   `Your rules: {spend}% Spend / {save}% Save / {give}% Give` — angkanya dari `money_rules`.
3. **Empty state (D-A).** Saran: layar Sort tidak bisa dibuka saat `unsorted = 0` — tombol Sort di
   Wallets memang sudah `disabled` (`kid-wallets.md` §3), jadi cukup jaga jalur push-nya.
