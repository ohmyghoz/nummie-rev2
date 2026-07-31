# data/regions/ — wilayah Indonesia

38 provinsi + 514 kabupaten/kota, kode Kemendagri. Dipakai dropdown dependent di formulir
sign up ortu (`nummi-web-plan.md` Tahap 2 no.1).

| Berkas | Isi |
|---|---|
| `id-provinces.json` | **GENERATED** — 38 provinsi (1,4 KB) |
| `id-regencies.json` | **GENERATED** — 514 kab/kota (33,2 KB) |
| `index.ts` | ditulis tangan: tipe, `provinces()`, `regenciesOf()`, `isValidPair()` |

**Jangan menyunting berkas `.json` dengan tangan.** Regenerasi:

```bash
pnpm regions:build
```

## Sumber

[`idn-area-data`](https://www.npmjs.com/package/idn-area-data) v4.0.1 — diambil 31 Juli 2026,
disusun dari sumber resmi pemerintah (Kepmendagri).

Diambil lewat **npm**, bukan `git clone` atau `curl`, dan itu bukan selera: network policy
environment sesi ini memblokir GitHub raw (404 lewat proxy) sementara `registry.npmjs.org`
lolos. Paketnya ada di `devDependencies` — ia tidak pernah ikut ke bundle browser.

## ⚠️ Lisensi — perlu keputusan Ghozy

Dua lisensi berbeda dalam satu paket:

| | Lisensi |
|---|---|
| Kode paket `idn-area-data` | MIT |
| **Datanya** | **[ODbL](https://opendatacommons.org/licenses/odbl/) 1.0** |

Yang dipakai repo ini adalah **datanya**, jadi yang berlaku ODbL. Konsekuensi yang perlu
diketahui, bukan diasumsikan:

- **Atribusi wajib.** Berkas ini adalah atribusinya. Kalau daftar wilayah kelak ditampilkan
  sebagai bagian produk (bukan sekadar isi dropdown), atribusi yang terlihat pengguna mungkin
  perlu ditambahkan.
- **Share-alike berlaku pada basis data turunan** — bukan pada aplikasi yang memakainya. Nummi
  memakai data ini untuk mengisi dropdown; ia tidak menerbitkan ulang basis datanya. Menurut
  ODbL, hasil semacam itu adalah *Produced Work*, dan Produced Work tidak tertular share-alike.
- **Yang akan mengubah perhitungan itu:** menerbitkan endpoint yang menyajikan daftar wilayah,
  atau mengekspornya sebagai dataset tersendiri.

Ini dicatat di sini alih-alih diputuskan diam-diam. **Kalau ODbL tidak diterima**, gantinya:
ketik ulang 38 provinsi dari sumber Kemendagri (daftar pendek, sekali kerja) dan jadikan
kota/kabupaten teks bebas sampai ada sumber lain — dengan ongkos hilangnya dropdown dependent.

## Kenapa JSON statis, bukan tabel Postgres atau API

- **Tanpa API eksternal** — syarat rencana Tahap 0 no.9. Formulir pendaftaran tidak boleh
  bergantung pada jaringan pihak ketiga tepat saat ortu mendaftar.
- **Bukan tabel** karena `parent_profiles.province/city` sengaja bukan foreign key: negara
  ≠ Indonesia membuat keduanya teks bebas, dan pemekaran wilayah tidak boleh berubah jadi
  migrasi database. Alasan lengkapnya di `supabase/migrations/0019_parent_profiles.sql`.
- **Digenerate lalu di-commit** supaya pemekaran muncul sebagai diff yang bisa ditinjau, bukan
  berpindah diam-diam saat seseorang menjalankan install.

## Kalau jumlahnya berubah

`tools/build-regions.mjs` **gagal keras** kalau provinsi ≠ 38 atau kab/kota ≠ 514, dan juga
kalau ada kab/kota yang menunjuk provinsi tak dikenal atau provinsi tanpa satu pun kab/kota.

Itu disengaja: dataset yang diam-diam terpotong akan ditemukan oleh ortu di daerah yang hilang,
bukan oleh kita. Kalau perubahannya memang pemekaran yang sah, perbarui angka harapan di skrip
**dan** catat sumbernya di berkas ini.
