import { NextResponse } from 'next/server';
import { bearerFrom, supabaseService, verifyParentToken } from '../../../../lib/parent/server';

/**
 * POST /api/parent/rates — "Your bank rates" (Settings :465). `bank_rates` cuma punya
 * policy SELECT (family-wide) — tulisnya lewat service role, sama pola dengan allowance.
 * Rate ini yang dipakai `tdInterest()` core saat anak mengajukan/menerima Time Deposit.
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyParentToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { m3?: number; m6?: number; m12?: number } | null;
  if (body?.m3 === undefined || body.m6 === undefined || body.m12 === undefined) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if ([body.m3, body.m6, body.m12].some((r) => r < 0)) {
    return NextResponse.json({ error: 'ratesNegative' }, { status: 400 });
  }
  if ([body.m3, body.m6, body.m12].some((r) => r > 50)) {
    return NextResponse.json({ error: 'ratesTooHigh' }, { status: 400 });
  }

  const db = supabaseService();
  const { error } = await db
    .from('bank_rates')
    .upsert({ family_id: identity.familyId, m3: body.m3, m6: body.m6, m12: body.m12 }, { onConflict: 'family_id' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
