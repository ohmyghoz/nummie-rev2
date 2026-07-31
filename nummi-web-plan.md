# Nummi — Rencana Rebuild Web (Tahap 0–4)

> Dipakai bersama `AGENTS.md`. Urutan wajib; tahap selesai (Definisi Selesai + persetujuan Ghozy)
> sebelum tahap berikutnya.
> Keputusan terkunci untuk rebuild ini: **fresh start UI, engine diselamatkan** ·
> mockup = sumber kebenaran UI · bahasa Inggris (i18n disiapkan) · produksi mulai kosong ·
> `/parent` & `/parent-web` terpisah · **satu** project Vercel ·
> **auth ortu: email + password + reset password** (ADR-0022 lama dibatalkan) ·
> verifikasi email tidak memblokir · paritas Fase 6 ditutup di Tahap 1 · iPad & Little/Teen ditunda.

---

## Tahap 0 — Transplantasi engine + fondasi

**Tujuan:** repo baru berdiri dengan engine teruji dari repo lama; tahap berikutnya murni pekerjaan layar.

**0a. Transplantasi dari `Nummie-test` (salin, bukan submodule):**
1. `packages/core/` utuh — jalankan `pnpm test`, **223 test wajib hijau sebelum lanjut**.
   *(Angka "172" di rencana asli sudah usang; hitungan nyata 31 Juli 2026 = 223 test / 16 berkas.
   Angka dokumen yang dikoreksi ke kenyataan, bukan sebaliknya.)*
2. `supabase/migrations/0001–0018` + `supabase/functions/child-login` + `supabase/seed.sql`.
3. `docs/decisions/` (ADR) — hapus/arsipkan ADR-0022, tulis **ADR baru: auth ortu
   email+password+reset, sign up publik** (konteks: uji tertutup selesai digantikan pendaftaran terbuka).
4. `copy/` (types & struktur) — `en.ts` akan diisi ulang per layar dari copy mockup saat porting.
5. `legacy/*.html` repo lama → `reference/mockups/` repo baru (kid-mobile, parent-mobile,
   parent-web, console; kid-ipad tidak perlu ikut).
6. `docs/` produk (status/handoff/backlog/brand/design system) — dibawa sebagai konteks;
   buat `docs/mockup-review.md` kosong dengan 3 entri awal (badge streak · format rupiah · Practice/Practise).

**0b. Fondasi baru:**
7. `apps/web` — Next.js App Router + TS, route `/kid` `/parent` `/parent-web` `/console`;
   middleware noindex; design tokens diekstrak dari CSS mockup; Fredoka + Plus Jakarta Sans.
8. **Audit migrasi vs auth baru**: migrasi 0001–0018 dibuat untuk dunia OTP — periksa apakah ada
   yang menyentuh auth ortu (mis. asumsi user dibuat manual); tulis migrasi lanjutan `0019+` bila perlu:
   - `parent_profiles`: nama, phone, `country` (default `ID`), `province`, `city`.
   - Trigger/fungsi pembuatan baris `parents` saat sign up Supabase Auth (email+password).
9. **Dataset wilayah**: JSON statis 38 provinsi + kab/kota (di-bundle, tanpa API eksternal) + util dropdown dependent.
10. `pnpm seed:dev` — 1 keluarga uji + 1 anak Middle (pakai seed kanonik core), dev only.
11. Satu project Vercel + env Supabase; deploy placeholder 4 route.

**Definisi Selesai T0:** 223 test core hijau di repo baru · migrasi jalan di project Supabase baru ·
login anak via Edge Function berhasil dgn keluarga `seed:dev` · sign up ortu email+password membuat
baris `parents`+`parent_profiles` · reset password terkirim & berfungsi · 4 route placeholder live di Vercel.

---

## Tahap 1 — `/kid` (Nummi Middle)

**Sumber UI:** `reference/mockups/kid-mobile.html`. Port per layar sesuai protokol AGENTS.md §3 —
**termasuk struktur navigasi mockup apa adanya** (bukan "nav kanonik" repo lama).

**Cakupan** (inventaris final diambil dari mockup saat porting):
1. Login anak (**email ortu + PIN** — ADR-0024, keputusan MR-6; Edge Function lama, payload baru).
   ⚠️ Layar ini **tidak ada di mockup `/kid`** — satu-satunya yang pernah digambar ada di mockup
   ortu. Jadi ia **dirancang**, bukan diport; gayanya mengikuti mockup, copy-nya sudah ada di
   `copy/en.ts` §login.
2. Home — topbar, saldo, pil ⭐/💎, ringkasan wallet, aktivitas.
3. **Sort** — DEVIASI D-B: rasio & mode dari `money_rules`; Flexible = sisa ke Unsorted,
   Strict = wajib habis 100% + penjelasan kenapa terkunci.
4. Wallets: Spend envelopes · Save dreams + Free savings · Give pool · Grow instruments.
5. Add / Move money (pemisah ribuan live saat mengetik).
6. Cash-out request → tabel `requests` nyata; status pending/approved/done terlihat anak.
7. Dreams: buat · progress · batalkan (dana pulang ke Free savings).
8. Give sisi anak (request → story-back ortu → "Write back").
9. Grow: TD / Gold / Forex + Harvest + penjelas spread ("Why is it less…").
10. Missions/kurikulum + Jobs (gerbang ⭐100) + Prizes 💎 + avatar shop + Me/badges —
    sesuai mockup, termasuk elemen yang berkonflik dgn dokumen (catat di mockup-review, jangan hapus sendiri).
11. Activity + filter rentang tanggal.
12. Empty state (D-A) untuk envelope/dream/ledger/mission kosong.

**Definisi Selesai T1:** verifikasi berdampingan semua layar lolos · anak `seed:dev` bisa
login → Sort sesuai rules DB → buat dream → move → ajukan cash-out tercatat di DB · I1 terjaga
di semua alur (test) · nol elemen upsell/iklan.

---

## Tahap 2 — `/parent` (Parent App) + Sign up

**Sumber UI:** `reference/mockups/parent-mobile.html`. Sign up & reset = DEVIASI D-D.

**2a. Sign up, login, reset**
1. Sign up: email · password · nama · nomor telepon · negara (default Indonesia) ·
   provinsi (38, dropdown) · kota/kab (dependent). Negara ≠ Indonesia → provinsi/kota jadi teks bebas.
2. Langsung masuk setelah daftar; verifikasi email jalan di belakang, tidak memblokir.
3. Login email+password · **lupa password → email reset → set password baru** (alur lengkap, diuji).
4. Onboarding wajib: **Add a child** (nama · tier Middle terkunci · PIN · family code digenerate
   & ditampilkan). Ganti PIN anak dari Settings (jangan ulangi lubang repo lama: PIN hanya bisa diisi saat create).

**2b. Fitur inti (dari mockup)**
5. Dashboard per anak.
6. **Approval inbox** — approve ≠ fulfil dua kolom utk cash-out/prize/Give (jalur sesuai mockup).
7. Send / Take money (Take hormati kantong terlindungi, ADR-0007).
8. Give: story-back wajib sebelum menutup + lihat write-back anak.
9. Settings: allowance terjadwal · bank rates (deposito ditetapkan ortu) · Today's prices
   (input manual — feed otomatis tetap backlog T) · manage investments.
10. Money rules: editor auto-split (validasi >100%, sisa boleh di Flexible, wajib habis di Strict) ·
    sakelar Strict/Flexible · undang ortu kedua (`actor_id` tercatat).
11. Jobs builder · Prizes · Transactions · Insight ringkas (sesuai porsi mockup HP).
12. Empty state onboarding.

**Definisi Selesai T2:** **loop penuh di lingkungan nyata** — ortu sign up → buat anak →
anak login `/kid` → ortu kirim allowance → anak Sort (rasio ortu berlaku) → cash-out →
approve → fulfil → riwayat konsisten dua sisi · reset password teruji · I1 terjaga.

---

## Tahap 3 — `/parent-web` (desktop)

**Sumber UI:** `reference/mockups/parent-web.html`. Backend sudah ada — pekerjaan murni permukaan.

1. Layout desktop persis mockup (navigasi, grid, panel).
2. **Insight lengkap**: "From all your children" · "Rules, per child" · "What the numbers are telling you".
3. Semua alur Tahap 2 dalam layout web.
4. Hook gating premium (`isPro`) di level route — flag konstanta, **belum ditegakkan**
   (bentuk paywall menyusul; ADR-0018 harga sudah terkunci).

**Definisi Selesai T3:** ortu sama berpindah `/parent` ↔ `/parent-web` dgn data identik ·
Insight dihitung dari ledger nyata · verifikasi berdampingan lolos.

---

## Tahap 4 — `/console` (Admin)

**Sumber UI:** `reference/mockups/console.html` (UI Indonesia — dipertahankan; console bukan
permukaan produk konsumen).

1. Auth: Supabase + **allowlist email admin** (env). Peran Dukungan/Analis/Admin-sekolah tampil
   sesuai mockup; penegakan server penuh = backlog.
2. **Console tidak pernah membawa service role ke klien** — semua data lewat route handler server
   dgn allowlist (pelajaran P0 repo lama: console pernah menerbitkan data semua keluarga sebagai HTML statis).
3. Ikhtisar: keluarga aktif mingguan **siklus uang lengkap** (bukan DAU) · **utang janji**
   (`decided` tanpa `fulfilled`) · funnel event — dihitung dari view nyata.
4. Daftar keluarga + status Baru/Sehat/Berisiko/Dorman (14/21/30 hari) · nominal sebagai rentang ·
   teks bebas anak tertutup default.
5. **Mode dukungan**: alasan + nomor tiket wajib · kedaluwarsa 15 menit · setiap pembukaan →
   `audit_log` append-only.
6. **Pemeriksa invarian harian** (`pg_cron`): I1 per keluarga · nol gembok Pro di `/kid` ·
   baris gagal tampil merah (insiden P0).

**Definisi Selesai T4:** admin login → metrik dari data nyata → mode dukungan tercatat & mati ≤15 mnt →
invariant checker jalan terjadwal → tidak ada service role di bundle klien (diverifikasi).

---

## Di luar cakupan (tetap backlog)

Feed harga & scheduler harian · reset mingguan otomatis (definisi awal minggu belum diputuskan) ·
Rapor Literasi · Growth Reward · paywall & pembayaran · slot iklan · foto cerita Give ·
iPad · Little & Teen · B2B sekolah (jalur pasif).
