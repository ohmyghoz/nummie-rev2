# ADR-0024 — Login anak: email ortu + PIN

**Status:** ✅ diputuskan 31 Juli 2026 · **mengamandemen
[ADR-0012](0012-auth-anak-kode-keluarga-pin.md)** (mengganti pengenalnya, bukan mekanismenya) ·
pasangan sisi ortu: [ADR-0023](0023-auth-ortu-email-password.md)

## Konteks — konflik yang baru bisa dilihat

ADR-0012 memilih **kode keluarga + PIN** pada 28 Juli 2026, dan sejak itu seluruh jalur login anak
dibangun di atasnya: `find_child_by_pin(p_family_code, p_pin)` (migrasi 0007), Edge Function
`child-login` yang menerima `{ familyCode, pin }`, dan rate limit berkunci keluarga (migrasi 0003).

Mockup mengatakan hal lain — dan itu **baru terbaca pada 31 Juli 2026**, saat markup layar mockup
untuk pertama kalinya bisa dibuka (`tools/unpack-mockups.mjs`; sebelumnya `grep` ke berkas HTML
mengembalikan negatif palsu). Layar Login di `parent-mobile.markup.html:8` berbunyi:

> 🦊 **I'm a kid** — *"Use your grown-up's email and your PIN"*
> *"Type your grown-up's email, then your PIN."* · kolom: **"Grown-up's email"** · **"Your 6-digit PIN"**
> *"Kids don't need their own email. Every child account belongs to a grown-up."*

Konfliknya dicatat sebagai **MR-6** di [`../mockup-review.md`](../mockup-review.md) dan sengaja
tidak dijawab lewat kode (AGENTS.md §8).

## Keputusan

**Anak masuk dengan EMAIL ORANG TUANYA + PIN.** Kode keluarga turun jadi pengenal internal.

Yang **tidak** berubah dari ADR-0012 — ini amandemen, bukan pembatalan:

- PIN **6 digit tetap, unik dalam satu keluarga** (A2). Mockup kebetulan setuju: kolomnya berbunyi
  *"Your 6-digit PIN"*.
- **Tanpa daftar anak** (A1). Server mencari sendiri anak mana yang PIN-nya cocok, dan **menolak
  kalau dua anak sama-sama cocok** — masuk sebagai "salah satu dari dua anak" jauh lebih buruk
  daripada tidak bisa masuk.
- Edge Function menerbitkan **JWT ber-claim** `child_id`/`family_id`/`tier`/`role='child'`; seluruh
  RLS tetap membaca claim itu.
- Rate limiting tetap **dua lapis** dan tetap dijalankan **sebelum** menyentuh hash.
- **Jawaban seragam** untuk setiap kegagalan.

**Ortu mana pun di keluarga itu berlaku.** Keluarga bisa punya dua akun ortu, dan copy mockup
(*"Every child account belongs to a grown-up"*) tidak menunjuk salah satunya. Memaksa anak
mengingat "email ortu yang mana" akan menciptakan kegagalan yang tidak bisa dijelaskan layar.

## Kenapa

**Mockup menang.** AGENTS.md §0 menetapkannya, dan itu alasan repo ini ada: repo lama mati karena
setiap sesi merasa berhak memilih. Repo ini tidak mengulanginya, termasuk saat mockup bertentangan
dengan ADR yang terkunci.

**Copy mockup koheren, bukan kelalaian.** *"Kids don't need their own email. Every child account
belongs to a grown-up"* menjelaskan model kepemilikannya dalam satu kalimat yang dimengerti anak
sembilan tahun. Kode keluarga tidak pernah punya kalimat sebagus itu — ia butuh dijelaskan
(*"The one your grown-up gave you"*), dan penjelasan itu mengandaikan sesuatu yang sudah diserahkan
dan disimpan.

**Satu hal yang hilang, dan tidak boleh dianggap kecil.** Kode keluarga tidak membocorkan apa pun:
ia acak, tidak muncul di mana-mana, dan tidak bisa dikaitkan ke orang sungguhan. Email ortu
kebalikannya — ia PII, ia dipakai di tempat lain, dan **ia bisa ditebak atau diketahui**. Yang
ditukar di sini bukan "aman jadi tidak aman", melainkan **satu jenis harga privasi dengan jenis
lain**: kode keluarga harus disimpan anak (dan bisa hilang), email tidak perlu disimpan (tapi bisa
diketahui orang lain). Kedua harga itu nyata; yang kedua yang sekarang kita bayar.

## Konsekuensi

### 1. Harga rate limit berubah — ini yang paling penting

ADR-0012 memasang lapis kedua (per keluarga, dari IP mana pun) dengan alasan yang ditulis
eksplisit: *"kode keluarga tidak bisa ikut dipalsukan: ia harus benar agar tebakan ada gunanya"*.
Harganya diambil sadar: siapa pun yang **tahu kode keluarga** bisa mengunci keluarga itu 15 menit.

Dengan email ortu, kunci lapis itu berubah dari kode acak 6 karakter (≈729 juta kemungkinan, tidak
bocor ke mana-mana) menjadi **alamat yang bisa diketahui siapa saja** — teman sekelas, siapa pun
yang pernah menerima email dari ortu itu. Artinya:

> Siapa pun yang tahu email seorang ortu bisa mengunci anaknya dari uangnya sendiri,
> berulang-ulang, **tanpa perlu menebak apa pun.**

Itu kemampuan yang tidak dimiliki siapa pun di bawah ADR-0012.

**Yang dikerjakan sekarang:** lockout lapis keluarga dipendekkan **15 → 5 menit**
(`FAMILY_LOCKOUT_MINUTES`). Lapis per-IP tetap 5 percobaan/15 menit, jadi pertahanan terhadap
tebakan PIN tidak berkurang — yang berkurang adalah lama gangguan yang bisa ditimbulkan orang yang
sekadar tahu sebuah alamat email.

**Ini peredam, bukan penutup.** Penutup sebenarnya butuh sesuatu yang tidak dimiliki penyerang —
perangkat yang sudah dikenal, atau kode keluarga sebagai faktor kedua. Ditinjau ulang begitu ada
laporan nyata, atau sebelum keluarga di luar lingkaran uji diundang.

### 2. Ortu mengganti email → login anak putus, diam-diam

Tidak ada galat yang menjelaskan; anak hanya melihat "That didn't work". Ortu yang menggantinya
tidak punya alasan menduga hubungannya. Masuk backlog: layar Settings ortu **wajib**
memperingatkan sebelum email diganti. Di bawah ADR-0012 masalah ini tidak ada.

### 3. `family_code` turun jadi pengenal internal

Kolomnya `not null unique` sejak migrasi 0001, jadi ia tetap digenerate. Alfabet tanpa-ambigu dari
[ADR-0023](0023-auth-ortu-email-password.md) **tetap dipertahankan**: ongkosnya nol, dan ia tetap
benar kalau kode keluarga kelak muncul sebagai faktor kedua (lihat §1) atau ditampilkan di Settings.

### 4. Satu pintu, bukan dua

`find_child_by_pin(text, text)` (0007) **dihapus** di migrasi 0022, bukan dibiarkan berdampingan.
Dua jalur autentikasi berarti dua permukaan serangan dan dua jalur rate limit — dan yang tidak
dipakai adalah yang tidak diuji. Pelajaran yang sama dengan migrasi 0009.

### 5. Enumerasi email

Layar ini tidak boleh bisa dipakai memeriksa email siapa yang punya akun. Jawaban tetap **identik**
untuk email tak dikenal, PIN salah, dan dua anak cocok — sama seperti yang sudah dijaga ADR-0022
untuk sisi ortu. Percobaan dengan email tak dikenal tetap dihitung rate limit, berkunci IP saja.

## Yang membatalkan ADR ini

Laporan nyata penguncian yang disengaja (§1) · uji membuktikan anak tidak bisa mengetik alamat
email dengan andal · atau mockup direvisi Ghozy sehingga konflik MR-6 hilang dari sumbernya.
