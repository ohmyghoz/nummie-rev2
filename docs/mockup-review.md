# Tinjauan mockup — konflik mockup vs dokumen

> Daftar tempat **mockup bertentangan dengan dokumen, ADR, atau dirinya sendiri**.
>
> **Per 31 Juli 2026 seluruhnya sudah terjawab** — daftar ini kini jadi catatan *kenapa* tiap
> layar diport seperti yang diport. Tambahkan baris baru begitu konflik berikutnya ditemukan.
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
| **Terbuka** | **0** |
| Diputuskan Ghozy | 4 — MR-2 · MR-3 · MR-6 · MR-7 (31 Juli 2026) |
| Tidak pernah butuh keputusan | 3 — MR-1 · MR-4 · MR-5 (sudah dijawab aturan yang ada) |

**Tahap 1 tidak lagi diblokir keputusan apa pun.** Yang tersisa dari daftar ini adalah pekerjaan
porting, bukan pertanyaan.

| # | Hasil | Ditegakkan di |
|---|---|---|
| MR-1 | badge streak **diport apa adanya**, tidak akan pernah menyala | AGENTS.md §5 — sudah memutuskannya sejak awal |
| MR-2 | format brand `Rp50.000` menang | AGENTS.md §6 · `packages/core/src/money.ts` |
| MR-3 | ejaan Amerika | ADR-0016 §Amandemen · `copy/README.md` aturan 5 |
| MR-4 | ikut MR-2 — **tapi butuh sisir manual** saat porting kurikulum | `copy/README.md` aturan 6 |
| MR-5 | rasio kanonik 40/40/20, mockup diabaikan | AGENTS.md §0 — angka milik `packages/core` |
| MR-6 | **email ortu + PIN** | ADR-0024 · migrasi 0022 · `child-login` |
| MR-7 | warna kategori kanonik, seragam | `apps/web/app/tokens.css` |

Dua di antaranya tidak pernah benar-benar terbuka, dan itu layak dicatat supaya daftar berikutnya
tidak ikut menggelembung: **MR-1 dan MR-5 sudah dijawab AGENTS.md sebelum ditulis di sini.** §5
menetapkan streak hilang dari engine sementara UI tetap ikut mockup; §0 menaruh angka di wilayah
`packages/core`, tempat mockup tidak pernah menang. Mencatatnya tetap berguna — yang keliru adalah
menyodorkannya sebagai pertanyaan.

---

## MR-6 · Login anak: email ortu, bukan kode keluarga

> ### ✅ DIPUTUSKAN 31 Juli 2026 — **email ortu + PIN**, mockup menang
>
> Ditetapkan [ADR-0024](decisions/0024-login-anak-email-ortu.md), yang **mengamandemen** ADR-0012
> (mekanismenya utuh; hanya pengenalnya berganti). Terpasang di migrasi 0022 dan Edge Function
> `child-login` (`{ parentEmail, pin }`). **Ortu mana pun** di keluarga itu berlaku.
>
> ⚠️ **Harganya nyata dan tercatat**: rate limit lapis keluarga dulu berkunci kode acak, kini
> berkunci alamat email yang bisa diketahui siapa saja — jadi siapa pun yang tahu email seorang
> ortu bisa mengunci anaknya berulang-ulang. Lockout-nya dipendekkan 15 → 5 menit sebagai peredam;
> hitungan lengkapnya di ADR-0024 §Konsekuensi 1.
>
> **Yang masih jadi pekerjaan Tahap 1:** layar login `/kid` tetap harus **dirancang**, bukan
> diport — lihat catatan di bawah.

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
seolah tinggal menyalin, dan `nummi-web-plan.md` sudah dikoreksi untuk mengatakannya.

Copy-nya sudah tersedia — diambil persis dari mockup ke `copy/en.ts` §login — jadi yang perlu
dirancang tinggal susunan layarnya, memakai gaya mockup.

---

## MR-7 · Warna kategori permukaan ortu berbeda dari anak & console

> ### ✅ DIPUTUSKAN 31 Juli 2026 — **himpunan kanonik anak & console menang**
>
> Warna kategori naik ke `:root` di `apps/web/app/tokens.css` dan berlaku sama di keempat
> permukaan. Nilai mockup ortu (`#F59E4C` dst.) **sengaja tidak dipakai**.
>
> **Ini satu-satunya tempat repo ini menolak nilai mockup**, jadi alasannya ditulis di berkas CSS-nya
> sendiri — supaya sesi berikutnya yang membuka mockup ortu tidak mengira ia menemukan bug lalu
> "memperbaikinya" kembali.

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

**Kenapa keputusannya jatuh ke nilai kanonik.** Console mendaftarkan warna kategori sebagai aturan
yang "tetap" — jadi ia mengaku mematuhi aturan bersama, dan permukaan ortu-lah yang menyimpang.
Polanya sama dengan X4/MR-5: drift antar-berkas yang tidak disadari, bukan pilihan desain.
Warna kategori kini duduk di `:root` dan berlaku di keempat permukaan.

---

## MR-5 · Auto-split ortu 40/40/10 = 90% — X4 masih hidup

> ### ✅ Tidak pernah butuh keputusan — AGENTS.md §0 sudah menjawabnya
>
> Angka adalah wilayah `packages/core`, bukan mockup: *"mockup tidak pernah bertentangan dengan
> ini"*. Yang benar tetap **40/40/20** (`seed.ts:113`). Jangan menyalin 40/40/10 ke kode.

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

> ### ✅ Tidak pernah butuh keputusan — AGENTS.md §5 sudah menjawabnya
>
> *"0011 streak dihapus (engine — UI tetap ikut mockup, konflik badge dicatat di mockup-review)"*.
> Badge diport apa adanya dan tidak akan pernah menyala.

**Bukti:** `kid-mobile.source.jsx:731` — rak badge layar Me, dalam keadaan belum diraih (`0`).

ADR-0011 membuang streak, bukan memperbaikinya. AGENTS.md §5 sudah memutuskan pembagiannya:
**engine tidak punya streak, UI tetap ikut mockup**. Jadi badge-nya diport apa adanya dan tidak
akan pernah menyala, karena tidak ada yang menghitungnya.

Konsekuensi yang perlu disadari: badge mati permanen di rak yang badge lainnya bisa menyala.

---

## MR-2 · Format rupiah `Rp 10,000` — persis yang dilarang brand system

> ### ✅ DIPUTUSKAN 31 Juli 2026 — **format brand `Rp50.000` menang**
>
> Pakai `formatRp()` / `formatRpInput()` dari `packages/core`. `rp()` milik mockup **tidak
> diport**. Ini pengecualian tertulis dari "mockup menang", dicatat di AGENTS.md §6.
>
> **MR-4 ikut tertutup keputusan ini** — tapi bukan berarti selesai sendiri: angka yang ditulis
> tangan di dalam copy kurikulum tidak melewati pemformat, jadi ia **wajib disisir manual** saat
> porting Tahap 1. Kalau terlewat, satu layar menampilkan `Rp 100.000` dan `Rp50.000` bersamaan.

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

> ### ✅ DIPUTUSKAN 31 Juli 2026 bersama MR-2 — semuanya jadi `Rp50.000`
>
> ⚠️ **Tapi ini yang tidak selesai sendiri.** `formatRp()` hanya menyentuh angka yang melewatinya;
> angka di baris 647 ditulis tangan **di dalam kalimat**. Sisir manual saat porting kurikulum.

**Bukti:** `kid-mobile.source.jsx:647`, badan sebuah misi:

> *"Grandma gives you Rp 100.000. You are saving for a BMX bike that costs Rp 900.000."*

Titik sebagai pemisah ribuan — sementara `rp()` di berkas yang sama (MR-2) memakai koma. Angka
yang ditulis tangan di dalam copy tidak melewati pemformat.

Ini menaikkan taruhan MR-2: apa pun yang diputuskan, string kurikulum harus ikut disisir. Kalau
tidak, satu layar menampilkan `Rp 100.000` dan `Rp 10,000` bersamaan.

---

## MR-3 · Ejaan "Practice" (Amerika) vs "Practise"

> ### ✅ DIPUTUSKAN 31 Juli 2026 — **ejaan Amerika**, mockup diport apa adanya
>
> Berlaku untuk seluruh `copy/en.ts`, bukan dua string yang memicunya. Dicatat sebagai amandemen
> ADR-0016 (yang memang menggantung pertanyaan ini) dan sebagai aturan 5 di `copy/README.md`.
> Sekaligus menutup **K12**.

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
