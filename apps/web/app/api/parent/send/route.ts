import { NextResponse } from 'next/server';
import { validateSend, type SendSource } from '@core/parent';
import { bearerFrom, supabaseService, verifyParentToken } from '../../../../lib/parent/server';

/**
 * POST /api/parent/send — Send money selalu mendarat di Unsorted (packages/core/parent.ts
 * `sendLandsIn`), tidak pernah langsung ke kategori — anak yang menyortir, bukan ortu.
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyParentToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    childId?: string;
    amount?: number;
    source?: SendSource;
    note?: string;
  } | null;
  if (!body?.childId || !body.amount || !body.source) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const check = validateSend({ amount: body.amount, source: body.source, note: body.note });
  if (!check.ok) return NextResponse.json({ error: check.errorKey }, { status: 400 });

  const db = supabaseService();

  const { data: child } = await db.from('children').select('family_id').eq('id', body.childId).maybeSingle();
  if (!child || child.family_id !== identity.familyId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { data: unsorted } = await db
    .from('wallets')
    .select('id')
    .eq('child_id', body.childId)
    .eq('category', 'unsorted')
    .maybeSingle();
  if (!unsorted) return NextResponse.json({ error: 'no_unsorted_wallet' }, { status: 500 });

  const { error } = await db.from('ledger_entries').insert({
    child_id: body.childId,
    from_wallet_id: null,
    to_wallet_id: unsorted.id,
    amount: body.amount,
    reason: 'send_money',
    created_by: identity.userId,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
