import type { Session } from '@supabase/supabase-js';
import { supabaseBrowser } from '../supabase-browser';

/**
 * Auth ortu = Supabase Auth sungguhan (ADR-0023), beda total dengan sesi anak
 * (lib/kid/session.ts, token custom Edge Function). Di sini `supabase-js` MEMANG
 * mengelola sesi sendiri (refresh, storage) — tidak perlu wrapper token manual.
 */

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  country: string;
  province: string;
  city: string;
}

/**
 * Trigger 0020 (`handle_new_parent_signup`) yang melahirkan `families`+`parents`+
 * `parent_profiles` dari `raw_user_meta_data` — bukan kode di sini. Field-nya HARUS
 * cocok nama yang dibaca trigger: `full_name`, `phone`, `country`, `province`, `city`.
 */
export async function signUpParent(input: SignUpInput) {
  const client = supabaseBrowser();
  return client.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        phone: input.phone,
        country: input.country,
        province: input.province,
        city: input.city,
      },
    },
  });
}

export async function signInParent(email: string, password: string) {
  const client = supabaseBrowser();
  return client.auth.signInWithPassword({ email, password });
}

/**
 * `redirectTo` WAJIB terdaftar di Supabase Auth → URL Configuration → Redirect URLs
 * (docs/DEPLOY.md §1), atau Supabase menolak tautannya.
 */
export async function requestPasswordReset(email: string) {
  const client = supabaseBrowser();
  const redirectTo =
    typeof window !== 'undefined' ? `${window.location.origin}/parent?resetPassword=1` : undefined;
  return client.auth.resetPasswordForEmail(email, { redirectTo });
}

export async function setNewPassword(newPassword: string) {
  const client = supabaseBrowser();
  return client.auth.updateUser({ password: newPassword });
}

export async function signOutParent() {
  const client = supabaseBrowser();
  return client.auth.signOut();
}

export async function getParentSession(): Promise<Session | null> {
  const client = supabaseBrowser();
  const { data } = await client.auth.getSession();
  return data.session;
}

export function onParentAuthChange(callback: (session: Session | null) => void) {
  const client = supabaseBrowser();
  const { data } = client.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
