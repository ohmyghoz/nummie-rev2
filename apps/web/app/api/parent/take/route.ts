import { NextResponse } from 'next/server';
import { validateTake } from '@core/parent';
import { walletFromRow, type WalletRow } from '../../../../lib/kid/data';
import { bearerFrom, supabaseService, verifyParentToken } from '../../../../lib/parent/server';

/**
 * POST /api/parent/take — Take money hormati kantong terlindungi (ADR-0007): dream/Give/Grow
 * tidak bisa ditarik ortu. `validateTake()` dari core menegakkannya + alasan wajib, simetris
 * dengan anak yang wajib menjelaskan saat Cash out.
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyParentToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    childId?: string;
    walletId?: string;
    amount?: number;
    reason?: string;
  } | null;
  if (!body?.childId || !body.walletId || !body.amount) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const db = supabaseService();

  const { data: child } = await db.from('children').select('family_id').eq('id', body.childId).maybeSingle();
  if (!child || child.family_id !== identity.familyId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const [{ data: walletRow }, { data: balanceRow }] = await Promise.all([
    db.from('wallets').select('*').eq('id', body.walletId).eq('child_id', body.childId).maybeSingle(),
    db.from('wallet_balances').select('balance').eq('wallet_id', body.walletId).maybeSingle(),
  ]);
  if (!walletRow) return NextResponse.json({ error: 'unknown_wallet' }, { status: 400 });

  const wallet = walletFromRow(walletRow as WalletRow);
  const balance = Number((balanceRow as { balance: number } | null)?.balance ?? 0);

  const check = validateTake(wallet, body.amount, balance, body.reason);
  if (!check.ok) return NextResponse.json({ error: check.errorKey }, { status: 400 });

  const { error } = await db.from('ledger_entries').insert({
    child_id: body.childId,
    from_wallet_id: body.walletId,
    to_wallet_id: null,
    amount: body.amount,
    reason: 'take_money',
    created_by: identity.userId,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
