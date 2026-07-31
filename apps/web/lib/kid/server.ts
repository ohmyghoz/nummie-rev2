import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Verifikasi & tulis ledger dari route handler — SERVER SAJA.
 *
 * `SUPABASE_SECRET_KEY` tidak pernah diturunkan ke klien (.env.example). Route handler ini
 * TIDAK mendekode JWT anak sendiri (itu akan butuh `CHILD_JWT_SECRET`, yang menurut
 * `docs/DEPLOY.md` §2 sengaja TIDAK boleh dipasang di Vercel — ia milik Edge Function di
 * Supabase). Sebagai gantinya, verifikasi didelegasikan ke Postgres/PostgREST sendiri:
 * token anak dipasang sebagai `accessToken` pada client sekali-pakai, lalu dipanggil
 * `auth_child_id()` (granted ke `authenticated`, migrasi 0004) — kalau tanda tangannya
 * salah atau kedaluwarsa, panggilan itu sendiri yang gagal.
 *
 * Penulisan ledger memakai client TERPISAH berkunci service role (melewati RLS by design —
 * migrasi 0009 mencabut hak tulis langsung `authenticated`, jadi service role di server
 * tepercaya inilah satu-satunya jalan, persis seperti dicatat `.env.example`).
 */

export async function verifyChildToken(token: string): Promise<{ childId: string } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase env belum diisi.');

  const asChild = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    accessToken: async () => token,
  });
  const { data, error } = await asChild.rpc('auth_child_id');
  if (error || !data) return null;
  return { childId: data as string };
}

let serviceClient: SupabaseClient | null = null;

export function supabaseService(): SupabaseClient {
  if (serviceClient) return serviceClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('SUPABASE_SECRET_KEY belum diisi (server saja).');
  serviceClient = createClient(url, key, { auth: { persistSession: false } });
  return serviceClient;
}

export function bearerFrom(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length);
}
