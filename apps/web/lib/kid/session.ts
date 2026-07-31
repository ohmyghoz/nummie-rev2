import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Sesi anak = token HS256 dari Edge Function `child-login` (ADR-0024), BUKAN sesi
 * Supabase Auth biasa — anak tidak punya baris `auth.users` (ADR-0012). `supabase-js`
 * mendukung token pihak-ketiga lewat opsi `accessToken` (bukan `auth.session`), itulah
 * yang dipakai di sini supaya RLS tetap membaca klaim `nummi_role`/`child_id`/`family_id`
 * dari token ini, bukan dari sesi Supabase.
 */
export interface KidSession {
  token: string;
  childId: string;
  tier: string;
  /** epoch ms. Edge Function menjanjikan 12 jam (supabase/README.md). */
  expiresAt: number;
}

const STORAGE_KEY = 'nummi_kid_session';

export function loadKidSession(): KidSession | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as KidSession;
    if (!session.token || session.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveKidSession(session: KidSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearKidSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export type LoginResult =
  | { ok: true; session: KidSession }
  | { ok: false; lockedMinutes?: number };

/** Memanggil Edge Function `child-login`. Satu pesan gagal untuk semua sebab (copy/en.ts §login). */
export async function loginKid(parentEmail: string, pin: string): Promise<LoginResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase env belum diisi.');

  const res = await fetch(`${url}/functions/v1/child-login`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ parentEmail, pin }),
  });

  if (!res.ok) return { ok: false };

  const body = (await res.json()) as {
    token: string;
    childId: string;
    tier: string;
    expiresInHours: number;
  };
  const session: KidSession = {
    token: body.token,
    childId: body.childId,
    tier: body.tier,
    expiresAt: Date.now() + body.expiresInHours * 60 * 60 * 1000,
  };
  saveKidSession(session);
  return { ok: true, session };
}

/**
 * Client Supabase berklaim anak. `accessToken` dipanggil PostgREST/Realtime setiap request —
 * mengembalikan token yang sama persis yang tersimpan, tanpa refresh (Edge Function tidak
 * punya endpoint refresh; sesi berakhir di 12 jam, anak login ulang).
 */
let cachedClient: SupabaseClient | null = null;
let cachedToken: string | null = null;

export function supabaseForKid(session: KidSession): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase env belum diisi.');

  if (cachedClient && cachedToken === session.token) return cachedClient;
  cachedToken = session.token;
  cachedClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    accessToken: async () => session.token,
  });
  return cachedClient;
}
