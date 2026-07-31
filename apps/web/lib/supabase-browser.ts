import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Client browser bersama, kunci publishable saja — RLS yang menjaga (migrasi 0002/0009).
 * Dipakai `/kid` (dengan JWT anak dipasang manual, lihat lib/kid/session.ts) dan `/parent`
 * (dengan sesi Supabase Auth normal).
 */
let cached: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY belum diisi.');
  }
  cached = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return cached;
}
