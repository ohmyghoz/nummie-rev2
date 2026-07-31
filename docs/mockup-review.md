# Tinjauan mockup — konflik yang menunggu keputusan Ghozy

> Daftar tempat **mockup bertentangan dengan dokumen, ADR, atau dirinya sendiri**.
>
> Aturannya (AGENTS.md §0): **mockup menang** sampai Ghozy bilang lain. Berkas di
> `reference/mockups/` tidak pernah diperbaiki diam-diam — memperbaikinya menghapus bukti
> konfliknya, dan konflik yang tidak terlihat akan diputuskan oleh siapa pun yang kebetulan
> menyentuh kodenya duluan. Itu yang terjadi di repo lama.
>
> Merasa ada yang aneh di mockup → **tambahkan baris di sini, lalu kerjakan sesuai mockup.**
>
> Semua rujukan `berkas:baris` menunjuk ke `reference/mockup-source/`, hasil
> `pnpm mockups:unpack`. Semuanya diverifikasi dengan `grep`, bukan ingatan.

## Status

| | |
|---|---|
| Dibuka | 31 Juli 2026 (Tahap 0) |
| Terbuka | 7 (MR-1 … MR-7) |
| Diputuskan | 0 |
| **Perlu diputuskan sebelum Tahap 1 mulai** | **MR-6** (layar login anak) · **MR-2** (format rupiah) |
| Sudah memaksa keputusan teknis sementara | MR-7 (token warna dipasang per permukaan) |

---

## MR-6 · Login anak: email ortu, bukan kode keluarga — **memblokir Tahap 1**

**Bukti:** `parent-mobile.markup.html:8` (layar `Login`), copy-nya:

> 🦊 **I'm a kid** — *"Use your grown-up's email and your PIN"*
> *"Type your grown-up's email, then your PIN."* · label kolom: **"Grown-up's email"** ·
> **"Your 6-digit PIN"**
> *"Kids don't need their own email. Every child account belongs to a grown-up."*

**Konflik dengan ADR-0012** (auth anak = **kode keluarga** + PIN, dan amandemen A1 menegaskan
login tidak memakai identifier anak). Mockup memakai **email ortu** sebagai pengenal keluarga.
PIN 6 digitnya sendiri **cocok** dengan ADR-0012 A2.

Tiga hal yang membuat ini bukan konflik kosmetik:

1. **Ia menentukan bentuk API.** Edge Function `child-login` menerima `familyCode`, dan
   `find_child_by_pin(p_family_code, p_pin)` (migrasi 0007) mencari lewat kolom itu. Memakai email
   ortu berarti jalur baru, bukan penggantian label.
2. **Ia mengubah apakah `family_code` dilihat pengguna.** Kalau mockup menang, `family_code` turun
   jadi pengenal internal. Tahap 0 tetap menghasilkannya (kolomnya `not null unique` sejak migrasi
   0001) dengan alfabet tanpa-ambigu — biaya nol, dan tetap aman kalau kemudian ia jadi terlihat.
3. **Ia punya konsekuensi privasi yang berlawanan arah.** Kode keluarga tidak membocorkan apa pun;
   email ortu adalah PII, dan anak yang mengetiknya di sekolah mengetik alamat email orang tuanya.
   Sebaliknya, ADR-0012 §Harga sudah mencatat kode keluarga bisa dipakai membebani rate limit
   keluarga tertentu. Keduanya punya harga, dan harganya berbeda jenis.

**Sekaligus: `/kid` tidak punya layar login sama sekali.** `grep -ci "pin" kid-mobile.source.jsx`
→ **0**. Mockup anak mulai dalam keadaan sudah masuk (`tab:'home'`). Satu-satunya layar login anak
yang pernah digambar ada di dalam mockup **ortu**, dan di sana ia demo belaka: 6 digit apa pun
memanggil `setState({authed:true})` lalu mendarat di dashboard ortu
(`parent-mobile.source.jsx:266`) — tidak pernah merender app anak.

Artinya layar login `/kid` harus **dirancang**, bukan diport. Rencana Tahap 1 no.1 memintanya
seolah tinggal menyalin.

**Pertanyaan untuk Ghozy:** anak masuk pakai email ortu (mockup) atau kode keluarga (ADR-0012)?

---

## MR-7 · Warna kategori permukaan ortu berbeda dari anak & console

**Bukti:** `parent-mobile.source.jsx:512` dan `:711` (sama persis di `parent-web.source.jsx`):

```js
const SPCATS = [{id:'spend',color:'#F59E4C'},{id:'save',color:'#4C9EE8'},{id:'give',color:'#ED6FA5'}];
```

Bandingkan dengan `kid-mobile.source.jsx:7` dan `console.source.html:27`:

| Kategori | anak + console | **ortu (HP & web)** |
|---|---|---|
| Spend | `#FF7A4D` | `#F59E4C` |
| Save | `#2CA6E0` | `#4C9EE8` |
| Give | `#F056A0` | `#ED6FA5` |
| Unsorted | `#8A7CF0` | `#A99BD6` |

**Kedua himpunan tidak beririsan sama sekali.** `#FF7A4D` muncul 0 kali di kedua berkas ortu;
`#F59E4C` muncul 0 kali di anak maupun console. Ini bukan pergeseran satu-dua nilai.

Yang membuatnya konflik, bukan sekadar variasi:

- **AGENTS.md §2** menetapkan satu himpunan token warna untuk seluruh repo:
  *"Spend `#FF7A4D` · Save `#2CA6E0` · Give `#F056A0` · Grow `#2FC078`"*.
- **`console.source.html:14`** mendaftarkannya sebagai aturan yang diwarisi dan **tidak diubah**:
  *"Warna kategori semantik: Spend/Save/Give/Grow **tetap**."*

Jadi console menyatakan sedang mematuhi aturan bersama — dan permukaan ortu diam-diam tidak.

**Konsekuensi langsung:** ortu dan anak melihat kantong yang sama dengan warna berbeda. Padahal
warna kategori adalah bahasa bersama produk ini: seluruh gunanya justru supaya "yang oranye itu
Spend" berlaku saat ortu dan anak menatap layar bersama.

**Sudah memaksa keputusan teknis di Tahap 0.** `apps/web/app/tokens.css` tidak bisa menaruh satu
`--spend` di `:root` lalu menyebutnya bersama — itu berarti diam-diam memilih satu pemenang.
Token warna kategori karena itu dipasang **per permukaan**, dan konflik ini ditulis apa adanya di
dalam berkas CSS-nya. Begitu MR-7 diputuskan, satu lapis dihapus dan nilainya naik ke `:root`.

---

## MR-5 · Auto-split ortu 40/40/10 = 90% — X4 masih hidup

**Bukti:** `parent-mobile.source.jsx:25` — `split:{ on:true, spend:40, save:40, give:10 }`

Kanoniknya 40/40/20, dan `packages/core/src/seed.ts:113` menuliskannya sebagai peringatan
eksplisit: *"Rasio default kanonik: 40 / 40 / 20. **Bukan 40/40/10 (X4)**."*

Jadi ini bukan konflik baru — ini **cacat X4 dari audit 28 Juli 2026 yang masih tertinggal di
mockup**, tepat berkas yang sekarang jadi sumber kebenaran UI.

Mockup bahkan bertentangan dengan dirinya sendiri: alur "tambah anak" di
`parent-mobile.source.jsx:676` memakai 40/40/20 yang benar, dan anak kedua di baris 48 memakai
50/30/20 (juga 100%). Hanya data demo Arthur yang meleset.

Sisa 10% tidak memunculkan galat karena Arthur di mode Flexible — ia hanya mengendap di Unsorted
selamanya. Di mode Strict, angka yang sama akan ditolak.

**Catatan porting:** ini konflik **angka**, bukan tampilan — dan angka bukan wilayah mockup
(AGENTS.md §0). Yang benar tetap `packages/core`. Jangan menyalin 40/40/10 ke kode.

---

## MR-1 · Badge "🔥 7-day streak" vs ADR-0011

**Bukti:** `kid-mobile.source.jsx:731` — rak badge layar Me, dalam keadaan belum diraih (`0`).

ADR-0011 membuang streak, bukan memperbaikinya. AGENTS.md §5 sudah memutuskan pembagiannya:
**engine tidak punya streak, UI tetap ikut mockup**. Jadi badge-nya diport apa adanya dan tidak
akan pernah menyala, karena tidak ada yang menghitungnya.

Konsekuensi yang perlu disadari: badge mati permanen di rak yang badge lainnya bisa menyala.

---

## MR-2 · Format rupiah `Rp 10,000` — persis yang dilarang brand system

**Bukti:** `kid-mobile.source.jsx:44` — `rp(n){ return 'Rp ' + Math.round(n).toLocaleString('en-US'); }`
(juga baris 52). Hasilnya: spasi setelah `Rp`, dan **koma** sebagai pemisah ribuan.

`docs/nummi-brand-system.md` §"Rupiah Format" (baris 980) tidak sekadar menganjurkan bentuk lain —
ia mendaftarkan bentuk mockup sebagai contoh yang **tidak boleh** dipakai:

| Recommended | Do not mix |
|---|---|
| `Rp50.000` · `Rp1.250.000` | **`Rp 50,000`** · `IDR 50K` |

`console.html` mengikuti brand, dan komentar CSS-nya menyatakannya: *"Format rupiah Indonesia:
Rp50.000 (titik ribuan, tanpa spasi)."*

Jadi dua permukaan produk memakai dua format berbeda hari ini, dan yang dipakai app anak adalah
yang secara eksplisit dilarang. Ini konflik paling tajam di daftar ini: biasanya mockup dan
dokumen sekadar berbeda — di sini dokumennya sudah menolak duluan.

**Ongkos kedua pilihan tidak seimbang, dan itu yang membuatnya mudah diputuskan.**
`packages/core/src/money.ts` sudah memuat jawabannya, teruji di `test/money.test.ts`:

```ts
formatRp(50_000)      // 'Rp50.000'    ← bentuk brand, sudah jalan
formatRpInput('50000') // '50.000'     ← pemisah ribuan live, persis Tahap 1 no.5
```

`packages/core/README.md` menyebut `formatRp()` **"satu-satunya cara menampilkan nominal"**.

| Pilihan | Yang harus dikerjakan |
|---|---|
| Format brand (`Rp50.000`) | buang `rp()` mockup, panggil `formatRp()` — engine & testnya sudah ada |
| Format mockup (`Rp 10,000`) | **mengubah `packages/core`** + membalik 4 assert test + melanggar brand system |

Mengubah `packages/core` butuh persetujuan (AGENTS.md §8), sementara memakainya tidak butuh apa
pun. AGENTS.md §6 tetap menyerahkan keputusan finalnya kepada Ghozy — tapi satu cabang gratis dan
satu cabang mahal.

**Perlu diputuskan sebelum Tahap 1 no.5** (Add/Move money memakai pemisah ribuan **live saat
mengetik**) — pemformat yang salah pilih akan disalin ke setiap kolom input.

---

## MR-4 · Mockup anak memakai dua format rupiah sekaligus

**Bukti:** `kid-mobile.source.jsx:647`, badan sebuah misi:

> *"Grandma gives you Rp 100.000. You are saving for a BMX bike that costs Rp 900.000."*

Titik sebagai pemisah ribuan — sementara `rp()` di berkas yang sama (MR-2) memakai koma. Angka
yang ditulis tangan di dalam copy tidak melewati pemformat.

Ini menaikkan taruhan MR-2: apa pun yang diputuskan, string kurikulum harus ikut disisir. Kalau
tidak, satu layar menampilkan `Rp 100.000` dan `Rp 10,000` bersamaan.

---

## MR-3 · Ejaan "Practice" (Amerika) vs "Practise"

**Bukti:** `kid-mobile.source.jsx:501` (`"Daily mission · Practice"`) dan `:685`
(`"Practice with my real money"`).

ADR-0016 mengunci bahasa produk = Inggris, tapi tidak pernah memilih **ragam** Inggrisnya.
Mockup memakai ejaan Amerika. Konsisten di dalam dirinya sendiri; yang belum ada adalah
keputusannya.

Keputusan ini lebih luas dari dua string: ia menentukan `color/colour`, `favorite/favourite`, dan
seterusnya untuk seluruh `copy/en.ts`. Lebih murah diputuskan sekarang daripada disisir nanti.

---

## Cara menambah baris

Satu bagian per konflik. Wajib memuat: **bukti `berkas:baris`** hasil grep ke
`reference/mockup-source/` (bukan ingatan) · dokumen/ADR yang dilanggar · dan **apa yang membuatnya
penting** — kalau tidak ada konsekuensinya, ia bukan konflik, hanya selera.
