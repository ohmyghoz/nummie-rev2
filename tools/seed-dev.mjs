#!/usr/bin/env node
/**
 * `pnpm seed:dev` — satu keluarga uji yang bisa dipakai KEDUA jalur login.
 *
 * Menghasilkan: 1 ortu (email + password) · 1 keluarga · 1 anak Middle dengan wallet awal.
 * Setelah selesai, ortu bisa masuk lewat `/parent` dan anak lewat kode keluarga + PIN.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEDANYA DENGAN `supabase/seed.sql` — jangan sampai tertukar:
 *
 *   seed.sql   ANGKA KANONIK. Arthur dengan ledger yang totalnya harus Rp484.711, cermin
 *              `packages/core/src/seed.ts`. Gunanya membandingkan permukaan dengan angka yang
 *              sudah dikunci. Ia SENGAJA tidak membuat ortu, karena `parents.id` mereferensi
 *              `auth.users` dan di dunia OTP ortu dibuat tangan.
 *
 *   seed:dev   KELUARGA YANG BISA DIMASUKI. Nol ledger, saldo nol — produksi mulai kosong
 *              (AGENTS.md §6), dan begitu juga keluarga uji ini. Gunanya membuktikan alur
 *              pendaftaran & login bekerja, bukan membuktikan angka.
 *
 * Jalankan keduanya kalau butuh keduanya; mereka tidak saling menimpa.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * SETIAP TULISAN LEWAT JALUR RESMI. Skrip ini tidak pernah `insert` ke `families`, `parents`,
 * `wallets`, atau `ledger_entries` secara langsung:
 *
 *   ortu  → Admin API `POST /auth/v1/admin/users` → trigger 0020 melahirkan
 *           `families` + `parents` + `parent_profiles` dalam satu transaksi
 *   anak  → RPC `create_child()` (0012/0013/0021) dengan `STARTER_WALLETS` dari packages/core
 *
 * Alasannya sama dengan AGENTS.md §4: semua mutasi lewat fungsi `SECURITY DEFINER`. Skrip seed
 * yang memotong jalur akan menghasilkan keluarga yang tidak mungkin lahir dari app — dan bug
 * yang hanya muncul di produksi.
 *
 * Nol dependency: `fetch` bawaan Node 18+, bukan @supabase/supabase-js.
 */

const URL_ENV = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
// `SUPABASE_SECRET_KEY` (`sb_secret_…`) adalah nama yang dipakai repo ini; `SUPABASE_SERVICE_ROLE_KEY`
// diterima sebagai nama lama supaya `.env` yang sudah ada tidak perlu disunting lebih dulu.
const KEY = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

const EMAIL = process.env.NUMMI_SEED_EMAIL ?? 'dev-parent@nummi.local';
const PASSWORD = process.env.NUMMI_SEED_PASSWORD ?? 'nummi-dev-password';
const CHILD_NAME = process.env.NUMMI_SEED_CHILD ?? 'Arthur';
const CHILD_PIN = process.env.NUMMI_SEED_PIN ?? '135790';

/** Cermin `STARTER_WALLETS` di packages/core/src/onboarding.ts — dibaca, tidak disalin. */
const STARTER_WALLETS_PATH = new URL('../packages/core/src/onboarding.ts', import.meta.url);

function die(message, hint) {
  console.error(`\n✗ seed:dev — ${message}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

// ── Gerbang 1: bukan produksi ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  die('NODE_ENV=production.', 'Produksi mulai kosong (AGENTS.md §6). Tidak ada seed di sana, titik.');
}

if (!URL_ENV || !KEY) {
  die(
    'butuh NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SECRET_KEY.',
    'Salin .env.example jadi .env.local lalu isi. Kunci rahasia TIDAK PERNAH masuk kode klien.',
  );
}

const ref = new URL(URL_ENV).hostname.split('.')[0];

// ── Gerbang 2: project harus disebut namanya ─────────────────────────────────
//
// Menyebutkan project secara eksplisit, bukan mewarisinya dari `.env` yang kebetulan sedang
// terpasang. Gerbang ini yang mencegah kecelakaan paling mungkin: `.env` masih menunjuk project
// sungguhan, lalu seseorang menjalankan seed:dev karena mengira ia menunjuk yang lain.
if (process.env.NUMMI_SEED_PROJECT_REF !== ref) {
  die(
    `project ref '${ref}' tidak dikonfirmasi.`,
    `Jalankan ulang dengan: NUMMI_SEED_PROJECT_REF=${ref} pnpm seed:dev\n` +
      `  Sebutkan project-nya dengan sengaja — jangan warisi dari .env yang kebetulan terpasang.`,
  );
}

async function api(path, init = {}) {
  const res = await fetch(`${URL_ENV}${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = body?.message ?? body?.error_description ?? body?.msg ?? text;
    throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status}: ${msg}`);
  }
  return body;
}

/** Dibaca dari core, bukan ditulis ulang — kalau daftarnya berubah, seed ikut berubah. */
async function starterWallets() {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(STARTER_WALLETS_PATH, 'utf8');
  const block = src.match(/export const STARTER_WALLETS[^=]*=\s*(\[[\s\S]*?\]);/);
  if (!block) die('tidak menemukan STARTER_WALLETS di packages/core/src/onboarding.ts.');
  // Objek TS bergaya `{ name: 'Unsorted', category: 'unsorted', kind: 'unsorted' }` → JSON.
  const json = block[1]
    .replace(/'/g, '"')
    .replace(/(\w+):/g, '"$1":')
    .replace(/,(\s*[}\]])/g, '$1');

  let wallets;
  try {
    wallets = JSON.parse(json);
  } catch {
    die(
      'gagal membaca STARTER_WALLETS dari packages/core.',
      'Bentuk berkasnya berubah? Pembacaan di sini memakai regex, jadi ia rapuh terhadap format.',
    );
  }

  // Pemeriksaan bentuk. Tanpa ini, regex yang meleset akan menghasilkan daftar wallet yang
  // "kelihatan masuk akal" lalu melahirkan anak yang cacat — dan `create_child()` menerimanya,
  // karena ia menerima daftar wallet apa pun sebagai parameter (itu memang disengaja, 0012).
  const problems = [];
  if (!Array.isArray(wallets) || wallets.length === 0) problems.push('bukan array berisi');
  else {
    if (!wallets.every((w) => w?.name && w?.category && w?.kind)) {
      problems.push('ada entri tanpa name/category/kind');
    }
    if (wallets.filter((w) => w.kind === 'unsorted').length !== 1) {
      problems.push('harus ada TEPAT satu wallet unsorted (index `one_unsorted_per_child`, 0001)');
    }
  }
  if (problems.length) {
    die(`STARTER_WALLETS terbaca tapi bentuknya salah: ${problems.join('; ')}.`);
  }

  return wallets;
}

async function main() {
  console.log(`▸ Project  : ${ref}`);
  console.log(`▸ Ortu     : ${EMAIL}`);

  // 1. Ortu. Trigger 0020 yang melahirkan keluarganya — bukan skrip ini.
  let userId;
  const existing = await api(`/auth/v1/admin/users?email=${encodeURIComponent(EMAIL)}`);
  const found = existing?.users?.find((u) => u.email === EMAIL);

  if (found) {
    userId = found.id;
    console.log('  (ortu sudah ada — dipakai ulang, tidak dibuat dua kali)');
  } else {
    const created = await api('/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
        // Verifikasi email tidak memblokir pemakaian (ADR-0023), dan di lingkungan dev
        // tidak ada kotak masuk untuk mengonfirmasinya.
        email_confirm: true,
        user_metadata: {
          full_name: 'Dev Parent',
          phone: '+628000000000',
          country: 'ID',
          province: 'Jawa Barat',
          city: 'Kota Bandung',
        },
      }),
    });
    userId = created.id;
    console.log('  ortu dibuat → trigger 0020 melahirkan keluarga');
  }

  // 2. Keluarga hasil trigger.
  const parents = await api(`/rest/v1/parents?id=eq.${userId}&select=family_id`);
  const familyId = parents?.[0]?.family_id;
  if (!familyId) {
    die(
      'ortu ada tapi tidak punya baris `parents`.',
      'Migrasi 0020 belum jalan di project ini — jalankan `supabase db push` dulu.',
    );
  }

  const families = await api(`/rest/v1/families?id=eq.${familyId}&select=name,family_code`);
  const family = families[0];

  // 3. Anak, lewat create_child() — satu transaksi, PIN divalidasi di server (0021).
  const children = await api(
    `/rest/v1/children?family_id=eq.${familyId}&select=id,name`,
  );

  if (children.length > 0) {
    console.log(`  (anak sudah ada: ${children.map((c) => c.name).join(', ')} — dilewati)`);
  } else {
    const wallets = await starterWallets();
    await api('/rest/v1/rpc/create_child', {
      method: 'POST',
      body: JSON.stringify({
        p_family_id: familyId,
        p_name: CHILD_NAME,
        p_birth_month: 5,
        p_birth_year: 2015,
        p_tier: 'middle', // Middle saja untuk MVP (ADR-0020)
        p_pin: CHILD_PIN,
        p_wallets: wallets,
      }),
    });
    console.log(`  anak dibuat: ${CHILD_NAME} (${wallets.length} wallet awal)`);
  }

  console.log(`
✓ Selesai.

  Masuk sebagai ORTU  →  /parent
      email     ${EMAIL}
      password  ${PASSWORD}

  Masuk sebagai ANAK  →  /kid   (Edge Function child-login)
      kode keluarga  ${family.family_code}
      PIN            ${CHILD_PIN}

  Saldo nol, ledger kosong — sengaja. Untuk angka kanonik (Rp484.711),
  jalankan supabase/seed.sql; keduanya tidak saling menimpa.
`);
}

main().catch((err) => die(err.message));
