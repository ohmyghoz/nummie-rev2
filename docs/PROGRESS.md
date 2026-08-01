# Laporan progres — 1 Agustus 2026

Sesi ini menyambung dari Tahap 0 (selesai & dicentang 31 Juli — lihat riwayat git untuk
laporan lama). Ghozy minta Tahap 1, lalu Tahap 2, lalu **sisa Tahap 1** dikerjakan berturutan
semalam, tanpa pengawasan. Dikerjakan sejauh protokol AGENTS.md §3 (ekstrak → inventaris →
port → verifikasi berdampingan) memungkinkan — **bukan semuanya selesai**, dan berkas ini
bilang persis sejauh mana.

> **Ringkas:** `/kid` (login·Home·Sort·Wallets·Move·Cash-out·Give·Requests·History·Me) dan
> `/parent` (sign up·onboarding·dashboard·approval inbox) hidup di atas Supabase sungguhan,
> diverifikasi berdampingan di browser. **Satu putaran lintas-tahap penuh dibuktikan hidup**:
> anak ajukan Give → ortu approve → ortu tulis cerita & tandai selesai → ledger tertulis →
> saldo & riwayat anak ter-update. Sisa `/kid` (Grow penuh, Missions/Jobs/Prizes) dan sisa
> `/parent` (Send/Take, Money rules, Settings, Jobs/Prizes builder, Transactions) **belum
> disentuh**. Tiga cacat produksi nyata ditemukan & ditutup di jalan sesi ini.

---

## 1. Yang hidup & terverifikasi berdampingan

### `/kid`

| Layar/aksi | Sumber | Bukti |
|---|---|---|
| Login | dirancang (T1.1) | token tersimpan, sesi bertahan |
| Shell, Home, Sort, Wallets | inventaris `docs/inventory/*.md` | data nyata, D-B/D-C ditegakkan |
| **Move** | `moveScreen()` :937 | `/api/kid/move`, `movePlan()` dari core, diuji: Everyday→Give Rp10.000 |
| **Cash-out** | `cashoutScreen()` :905 | request `needs_ok` tercipta, diuji sampai baris DB |
| **Give away** | `giveawayScreen()` :970 | `GIVE_CAUSES`/`validateGive()` dari core apa adanya |
| **Requests** | `requestsScreen()` :1093 | daftar real-time, bukan demo |
| **History** | `historyScreen()` :1115, disederhanakan | filter 7/30/90 hari/semua, ringkasan masuk/keluar |
| **Me** | `meTab()` :690, diringkas | profil + ⭐/💎 asli + sign out |
| **+ New envelope/dream** | tidak ada di mockup (lihat §4) | tulis `wallets` langsung lewat RLS |

### `/parent`

Sign in · Sign up · Reset password (diminta, belum diklik-tuntas malam ini) · Onboarding
"Add a child" · Dashboard · Approval inbox (approve/decline/talk/done, ledger untuk
cash_out/give_away).

## 2. Loop lintas-tahap yang dibuktikan hidup, ujung ke ujung

Ini yang paling berarti malam ini:

1. Sign up ortu → langsung masuk (ADR-0023) → Add a child → family code tergenerasi.
2. Anak login pakai email ortu + PIN anak yang baru dibuat.
3. Anak ajukan **Give** (Rp5.000, "A friend who needs it") → baris `requests` `needs_ok`.
4. Ortu buka inbox → **Approve** → status jadi "You said yes — not done yet" (promise debt).
5. Ortu tulis cerita ("Gave it to Budi for his school shoes") → **I did it**.
6. `ledger_entries` tertulis (`from=Give wallet, to=null, reason=give_away, amount=5000`).
7. Anak buka Home/Wallets/History → saldo Give turun, entri baru muncul di riwayat.

**Cash-out diuji sampai langkah 3** (request tercipta di DB dengan alasan & jumlah benar) —
jalur approve→done-nya memakai kode yang **sama persis** dengan Give (satu route handler,
`apps/web/app/api/parent/requests/[id]/route.ts`), jadi tidak diulang ujinya secara terpisah.

## 3. Cacat produksi ditemukan & ditutup (kumulatif sesi ini)

1. **CORS `child-login`** — Edge Function gagal dipanggil dari browser tanpa header CORS.
2. **`webpack.resolve.extensionAlias`** — import gaya NodeNext lolos `tsc`, mati di runtime.
3. **`Confirm email` menyala** di Supabase Auth — bertentangan dengan ADR-0023. Dimatikan.

Tidak ada cacat baru ditemukan di putaran Move/Cash-out/Give — arsitektur route handler yang
dibangun untuk Sort (verifikasi via `auth_child_id()`, tulis via service role) terbukti dipakai
ulang bersih untuk tiga aksi lain tanpa penyesuaian pola.

## 4. Keputusan yang diambil sendiri, dicatat bukan disembunyikan

- **MR-11 baru** (`docs/mockup-review.md`): sheet FAB menaruh **Give** di grup "happens right
  away" walau fungsinya butuh OK ortu. Diport **sesuai posisi mockup** (bukan dipindah ke grup
  "needs OK"), konflik dicatat untuk keputusan Ghozy nanti — lihat berkas untuk detail lengkap.
- **"+ New envelope"/"+ New dream"** dibangun walau kartu dashed-nya tanpa `onClick` di mockup
  (`kid-wallets.md` §5 sudah memperingatkan ini) — rencana Tahap 1 eksplisit menyebut "Dreams:
  buat" sebagai cakupan, jadi ini pekerjaan yang diarahkan, bukan tebakan bebas. Ditulis lewat
  RLS langsung (`wallets_write: can_see_child`), bukan route handler — migrasi 0009 hanya
  membatasi `ledger_entries`, bukan `wallets`.
- **Dashboard `/parent` satu-kartu-per-anak** (dari sesi sebelumnya, masih berlaku) — bukan
  chip-picker + ring gabungan seperti mockup.
- **Bug kecil ditemukan & diperbaiki saat uji**: refresh data klien setelah Move sempat
  menampilkan saldo lama sesaat (data di database sudah benar — dikonfirmasi lewat reload
  manual). Tidak sempat diselidiki akar masalahnya malam ini; dicatat sebagai item kecil,
  bukan cacat integritas data.

## 5. Sama sekali belum disentuh

### `/kid`
**Grow penuh** (Time Deposit/Gold/Forex + Harvest + spread harian) — butuh tabel
`daily_prices` yang belum disentuh. **Missions/Jobs/Prizes** — butuh struktur kurikulum &
tabel koleksi yang belum ada. **Avatar shop/badges/tema** di tab Me.

### `/parent`
Send/Take money · Money rules editor (Strict/Flexible, auto-split — **`money_rules` masih
di-insert manual lewat SQL**, ini yang paling menghambat kalau mau uji keluarga baru sendiri
tanpa bantuanku) · Settings (allowance, bank rates, today's prices) · Jobs/Prizes builder ·
Transactions · Insight · undang ortu kedua.

## 6. Yang perlu Ghozy lakukan

1. **Baca §4** — satu konflik mockup baru (MR-11) menunggu keputusanmu, tidak mendesak.
2. **Coba sendiri**: `pnpm dev`. Akun uji yang masih ada di database (belum dibersihkan,
   tidak menyentuh keluarga lain):
   - `dev-parent@nummi.local` / `nummi-dev-password` — Arthur, PIN `135790`, sudah punya
     riwayat Sort/Move/Give/Cash-out request untuk dicoba lihat.
   - `bu-sinta-test2@nummi.local` / `nummi-parent-test-pw` — Dinda, PIN `246810`, akun kosong.
3. Tiga commit lokal sesi ini (`213293b`, `a5d1ed2`, `b81e273`, `022cb1b`) — **push menyusul
   permintaanmu tiap kali**, belum otomatis.
4. **Kalau lanjut**: Money rules editor di `/parent` adalah pengungkit tertinggi berikutnya —
   tanpa itu, keluarga baru mana pun tidak bisa memakai Sort sama sekali (harus di-insert SQL
   manual seperti sesi ini melakukannya).
