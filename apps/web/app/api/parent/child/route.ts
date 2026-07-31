import { NextResponse } from 'next/server';
import { validateChild } from '@core/onboarding';
import { STARTER_WALLETS } from '@core/onboarding';
import { bearerFrom, supabaseService, verifyParentToken } from '../../../../lib/parent/server';

/**
 * POST /api/parent/child — onboarding "Add a child" (Tahap 2 no.4).
 *
 * `create_child()` (0012/0013/0021) sudah menegakkan aturan PIN di database — pemeriksaan
 * `validateChild()` di sini adalah lapis PERTAMA (pesan galat yang tepat guna sebelum
 * menyentuh jaringan), bukan satu-satunya. Kalau lapis ini lolos tapi database menolak,
 * responsnya tetap error dari database — bukan dianggap sukses.
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyParentToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    birthMonth?: number;
    birthYear?: number;
    pin?: string;
  } | null;
  if (!body?.name || !body.birthMonth || !body.birthYear || !body.pin) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const db = supabaseService();

  const { data: pinTaken } = await db.rpc('family_pin_taken', {
    p_family_id: identity.familyId,
    p_pin: body.pin,
  });

  const check = validateChild(
    { name: body.name, birthMonth: body.birthMonth, birthYear: body.birthYear, tier: 'middle', pin: body.pin },
    new Date().toISOString().slice(0, 10),
    { pinTakenInFamily: Boolean(pinTaken) },
  );
  if (!check.ok) return NextResponse.json({ error: check.errorKey }, { status: 400 });

  const { data: childId, error } = await db.rpc('create_child', {
    p_family_id: identity.familyId,
    p_name: body.name,
    p_birth_month: body.birthMonth,
    p_birth_year: body.birthYear,
    p_tier: 'middle',
    p_pin: body.pin,
    p_wallets: STARTER_WALLETS,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, childId });
}
