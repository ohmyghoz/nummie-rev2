import { createClient } from '@supabase/supabase-js';
import { bearerFrom, supabaseService } from '../kid/server';

export { bearerFrom, supabaseService };

/**
 * Sama pola dengan verifyChildToken (lib/kid/server.ts): verifikasi didelegasikan ke
 * Postgres lewat `auth_family_id()`, bukan didekode manual di sini.
 */
export async function verifyParentToken(
  token: string,
): Promise<{ userId: string; familyId: string } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase env belum diisi.');

  const asParent = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    accessToken: async () => token,
  });
  // Client TERPISAH, tanpa opsi `accessToken`: supabase-js menolak `auth.getUser()` di client
  // yang dikonfigurasi `accessToken` ("Supabase Client is configured with the accessToken
  // option, accessing supabase.auth.getUser is not possible"). `getUser(token)` di client
  // polos ini memvalidasi token yang dioper eksplisit, tidak butuh sesi client itu sendiri.
  const plain = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const [{ data: familyId, error: familyError }, { data: userRes }] = await Promise.all([
    asParent.rpc('auth_family_id'),
    plain.auth.getUser(token),
  ]);
  if (familyError || !familyId || !userRes.user) return null;
  return { userId: userRes.user.id, familyId: familyId as string };
}
