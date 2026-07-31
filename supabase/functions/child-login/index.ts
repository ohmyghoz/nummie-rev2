/**
 * Edge Function: login anak (ADR-0012, pengenalnya diamandemen ADR-0024).
 *
 * Anak tidak punya email — jadi ia memakai EMAIL ORANG TUANYA + PIN, dan fungsi ini menerbitkan
 * JWT ber-claim yang dibaca RLS. Ortu mana pun di keluarga itu berlaku.
 *
 * Sampai 31 Juli 2026 pengenalnya adalah KODE KELUARGA. Mockup mengatakan lain
 * (*"Type your grown-up's email, then your PIN"*), dan mockup menang (AGENTS.md §0) — duduk
 * perkaranya di `docs/mockup-review.md` §MR-6, keputusannya di ADR-0024.
 *
 * Kenapa tidak diperiksa di sisi klien saja: backlog C-5 sudah menetapkan bahwa aturan akses
 * harus jadi kebijakan sisi server, bukan penyembunyian di sisi klien. Untuk app uang, model
 * kepercayaannya runtuh kalau anak yang tahu inspect element bisa membuka layar ortu.
 *
 * TIDAK ADA `childId` di sini, dan itu keputusan (U-7 opsi 2). Versi sebelumnya menuntutnya,
 * padahal anak tidak mungkin mengetik UUID — dan daftar anak per keluarga tak punya jalur baca
 * yang sah, karena RLS menuntut token yang justru belum terbit. Jadi tidak ada daftar sama
 * sekali: `find_child_by_parent_email()` mencari sendiri, dan MENOLAK kalau dua anak sama-sama
 * cocok.
 *
 * PIN 6 digit = 1.000.000 kombinasi, tapi tiap anak menambah satu PIN yang sah di ruang itu.
 * RATE LIMITING DI BAWAH BUKAN OPSIONAL — dan sejak ADR-0024 ia menanggung beban baru, lihat
 * catatan di `isRateLimited()`.
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { create, getNumericDate } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';
// TIDAK ADA bcrypt di sini, dan itu disengaja — lihat migrasi 0006_verify_child_pin.sql.
// Ringkasnya: `deno.land/x/bcrypt` async memakai Worker, yang tidak ada di Edge Runtime
// (`ReferenceError: Worker is not defined` → 500). Perbandingan PIN sekarang dikerjakan
// Postgres lewat pgcrypto, sehingga `pin_hash` tidak pernah keluar dari database.

const MAX_ATTEMPTS = 5;          // per (keluarga, IP)
const MAX_ATTEMPTS_FAMILY = 20;  // per keluarga dari IP mana pun — lihat isRateLimited()
const LOCKOUT_MINUTES = 15;

/**
 * Lapis keluarga dikunci LEBIH PENDEK daripada lapis per-IP, dan itu bukan salah ketik.
 *
 * Di bawah ADR-0012 kunci lapis ini adalah kode keluarga: acak, ≈729 juta kemungkinan, tidak
 * bocor ke mana-mana. Sejak ADR-0024 kuncinya **email ortu** — alamat yang bisa diketahui siapa
 * saja. Siapa pun yang tahu email seorang ortu kini bisa mengunci anaknya dari uangnya sendiri
 * berulang-ulang, tanpa menebak apa pun.
 *
 * 5 menit adalah peredam, bukan penutup. Pertahanan terhadap tebakan PIN tidak berkurang — itu
 * pekerjaan lapis per-IP yang tetap 5/15 menit. Yang dipendekkan hanya lama gangguan yang bisa
 * ditimbulkan orang yang sekadar tahu sebuah alamat email. Hitungan lengkapnya di ADR-0024.
 */
const FAMILY_LOCKOUT_MINUTES = 5;

const SESSION_HOURS = 12;

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req: Request) => {
  // CORS: dipanggil dari browser (`/kid`), origin beda dengan project Supabase —
  // baik di dev (localhost) maupun produksi (Vercel). Tanpa ini preflight `OPTIONS`
  // gagal dan fetch() gugur diam-diam sebagai "Failed to fetch", sebelum sempat
  // menyentuh body POST sama sekali.
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const { parentEmail, pin } = await req.json().catch(() => ({}));
  if (!parentEmail || !pin) return json({ error: 'missing_fields' }, 400);

  // Normalisasi di klien-side fungsi ini DAN di SQL-nya. Yang mengetik adalah anak sembilan
  // tahun di keyboard HP yang gemar mengapitalkan huruf pertama.
  const email = String(parentEmail).trim().toLowerCase();
  const ip = clientIp(req);

  // 1. Keluarganya dicari lebih dulu — BUKAN untuk memberi tahu penebak bahwa emailnya benar
  // (jawabannya tetap seragam), melainkan supaya rate limit punya kunci. Email yang tidak ada
  // tetap dihitung, hanya saja per-IP.
  //
  // Lewat RPC `security definer`, bukan query langsung: `auth.users` tidak boleh dibaca dari
  // sini, dan lookup-nya harus tetap satu perjalanan.
  const { data: familyId } = await admin
    .rpc('find_family_by_parent_email', { p_email: email });

  const family = familyId ? { id: familyId as string } : null;

  // 2. Rate limit SEBELUM menyentuh hash.
  // Menit yang dilaporkan mengikuti lapis yang benar-benar mengunci — kedua lapis kini punya
  // jendela berbeda, dan menyuruh anak menunggu 15 menit untuk kunci 5 menit adalah berbohong.
  const lockedFor = await isRateLimited(family?.id ?? null, ip);
  if (lockedFor !== null) {
    return json({ error: 'too_many_attempts', retryAfterMinutes: lockedFor }, 429);
  }

  // 3. Siapa anak yang PIN-nya cocok di keluarga itu? Perbandingan bcrypt dikerjakan Postgres
  // (0022), jadi `pin_hash` tidak pernah keluar dari database. Nol baris berarti salah satu
  // dari: email salah, PIN salah, atau DUA anak sama-sama cocok — dan ketiganya memang harus
  // menghasilkan jawaban yang sama persis di sini.
  const { data: matches } = await admin
    .rpc('find_child_by_parent_email', { p_email: email, p_pin: String(pin) });

  const child = Array.isArray(matches) ? matches[0] : null;

  if (!child) {
    await recordFailure(family?.id ?? null, ip);
    // Pesan galat sengaja seragam — jangan bocorkan bagian mana yang salah.
    return json({ error: 'invalid_credentials' }, 401);
  }

  await clearFailures(family?.id ?? null, ip);

  // 4. Terbitkan JWT dengan claim yang dibaca auth_role_kind() / auth_child_id() / auth_family_id().
  // CATATAN: namanya BUKAN SUPABASE_JWT_SECRET. Supabase mereservasi prefix `SUPABASE_`
  // untuk secrets — `supabase secrets set SUPABASE_...` ditolak, dan JWT secret tidak
  // termasuk yang di-inject otomatis (hanya URL, ANON_KEY, SERVICE_ROLE_KEY, DB_URL).
  // Memakai nama berprefix itu membuat nilainya undefined saat runtime.
  //   supabase secrets set CHILD_JWT_SECRET=<jwt secret proyek>
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(Deno.env.get('CHILD_JWT_SECRET')!),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  // Nama kolomnya datang dari find_child_by_parent_email(): child_id, family_id, tier.
  const token = await create({ alg: 'HS256', typ: 'JWT' }, {
    aud: 'authenticated',
    role: 'authenticated',
    sub: child.child_id,
    exp: getNumericDate(SESSION_HOURS * 60 * 60),
    nummi_role: 'child',
    child_id: child.child_id,
    family_id: child.family_id,
    tier: child.tier,
  }, key);

  return json({ token, childId: child.child_id, tier: child.tier, expiresInHours: SESSION_HOURS });
});

/**
 * `x-forwarded-for` adalah RANTAI: "klien, proxy1, proxy2". Hop terakhir adalah proxy Supabase
 * sendiri dan BERGANTI tiap permintaan (99.83.104.104, .107, .110, …). Memakai string utuh
 * sebagai kunci membuat setiap percobaan tampak datang dari IP baru — dan itulah sebabnya
 * rate limiting tidak pernah menyala sekali pun sampai 29 Juli 2026, walau kodenya ada.
 */
function clientIp(req: Request): string {
  const first = (req.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim();
  return first || 'unknown';
}

/**
 * Kuncinya KELUARGA + IP, bukan anak + IP (0007) — anak justru bagian yang belum diketahui saat
 * percobaan gagal.
 *
 * DUA lapis, karena hop pertama `x-forwarded-for` dikirim klien dan **bisa dipalsukan**:
 *
 *   (a) per (keluarga, IP)  — 5 / 15 menit. Menangkap penebak biasa.
 *   (b) per keluarga saja   — 20 / **5** menit. Menangkap yang merotasi IP palsu.
 *
 * ⚠️ ALASAN LAPIS (b) MELEMAH SEJAK ADR-0024, dan ini harus diketahui siapa pun yang menyentuhnya.
 *
 * ADR-0012 membenarkan lapis (b) begini: *"kode keluarga tidak bisa ikut dipalsukan, karena harus
 * benar agar tebakannya ada gunanya"* — jadi mengunci sebuah keluarga menuntut pengetahuan yang
 * langka. Harganya diambil sadar: siapa pun yang **tahu kode keluarga** bisa mengunci keluarga itu.
 *
 * Sejak pengenalnya berganti jadi **email ortu**, pengetahuan itu tidak langka lagi. Siapa pun
 * yang tahu email seorang ortu — teman sekelas, siapa pun yang pernah menerima email darinya —
 * bisa mengunci anaknya dari uangnya sendiri, berulang-ulang, **tanpa menebak apa pun.**
 *
 * Karena itu lapis (b) memakai jendela lebih pendek (`FAMILY_LOCKOUT_MINUTES`) daripada lapis (a).
 * Pertahanan terhadap tebakan PIN tidak berkurang — itu pekerjaan lapis (a). Yang dipendekkan
 * adalah lama gangguan yang bisa ditimbulkan orang yang sekadar tahu sebuah alamat email.
 *
 * Penutup sebenarnya butuh sesuatu yang tidak dimiliki penyerang: perangkat yang sudah dikenal,
 * atau kode keluarga sebagai faktor kedua. Keduanya di luar cakupan sekarang — lihat ADR-0024.
 */
/** Mengembalikan berapa menit lagi boleh mencoba, atau `null` kalau tidak terkunci. */
async function isRateLimited(familyId: string | null, ip: string): Promise<number | null> {
  const since = new Date(Date.now() - LOCKOUT_MINUTES * 60_000).toISOString();

  let perIp = admin
    .from('child_login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', since);
  perIp = familyId ? perIp.eq('family_id', familyId) : perIp.is('family_id', null);
  const { count: byIp } = await perIp;
  if ((byIp ?? 0) >= MAX_ATTEMPTS) return LOCKOUT_MINUTES;

  if (!familyId) return null;

  // Jendela sendiri, lebih pendek — lihat catatan di atas.
  const sinceFamily = new Date(Date.now() - FAMILY_LOCKOUT_MINUTES * 60_000).toISOString();

  const { count: byFamily } = await admin
    .from('child_login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('family_id', familyId)
    .gte('created_at', sinceFamily);
  return (byFamily ?? 0) >= MAX_ATTEMPTS_FAMILY ? FAMILY_LOCKOUT_MINUTES : null;
}

async function recordFailure(familyId: string | null, ip: string) {
  await admin.from('child_login_attempts').insert({ family_id: familyId, ip });
}

async function clearFailures(familyId: string | null, ip: string) {
  let q = admin.from('child_login_attempts').delete().eq('ip', ip);
  q = familyId ? q.eq('family_id', familyId) : q.is('family_id', null);
  await q;
}

/**
 * `*` sengaja, bukan allowlist domain: token yang diterbitkan di sini hanya berlaku untuk
 * membaca/menulis milik anak itu sendiri (RLS via klaim JWT) — kerahasiaan asal permintaan
 * tidak menjaga apa pun di jalur ini yang belum dijaga rate limit + verifikasi PIN di atas.
 */
const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS },
  });
}
