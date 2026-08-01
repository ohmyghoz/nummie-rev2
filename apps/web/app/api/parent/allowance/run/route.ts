import { NextResponse } from 'next/server';
import { bearerFrom, supabaseService, verifyParentToken } from '../../../../../lib/parent/server';

/**
 * POST /api/parent/allowance/run — "▶ Run the next payment now" (mockup :433, ditandai
 * "demo"). Di sini SUNGGUHAN: satu baris ledger `allowance` ke Unsorted, bukan simulasi.
 *
 * Scheduler harian otomatis SENGAJA di luar cakupan (nummi-web-plan.md "Di luar cakupan") —
 * ini jalan manual pengganti sampai scheduler itu ada, satu-satunya cara uang saku masuk
 * tanpa SQL manual.
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyParentToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { childId?: string } | null;
  if (!body?.childId) return NextResponse.json({ error: 'invalid_body' }, { status: 400 });

  const db = supabaseService();

  const [{ data: child }, { data: schedule }, { data: unsorted }] = await Promise.all([
    db.from('children').select('family_id').eq('id', body.childId).maybeSingle(),
    db.from('allowance_schedules').select('enabled,amount').eq('child_id', body.childId).maybeSingle(),
    db.from('wallets').select('id').eq('child_id', body.childId).eq('category', 'unsorted').maybeSingle(),
  ]);
  if (!child || child.family_id !== identity.familyId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  if (!schedule?.enabled || !schedule.amount) {
    return NextResponse.json({ error: 'no_schedule' }, { status: 400 });
  }
  if (!unsorted) return NextResponse.json({ error: 'no_unsorted_wallet' }, { status: 500 });

  const { error } = await db.from('ledger_entries').insert({
    child_id: body.childId,
    from_wallet_id: null,
    to_wallet_id: unsorted.id,
    amount: schedule.amount,
    reason: 'allowance',
    created_by: identity.userId,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, amount: schedule.amount });
}
