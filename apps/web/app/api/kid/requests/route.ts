import { NextResponse } from 'next/server';
import { canCashOutFrom } from '@core/rules';
import { walletFromRow, type WalletRow } from '../../../../lib/kid/data';
import { bearerFrom, supabaseService, verifyChildToken } from '../../../../lib/kid/server';

/**
 * POST /api/kid/requests — membuat request `cash_out` / `give_away`. TIDAK menulis ledger
 * (ADR-0002 approve ≠ fulfil) — cuma baris `requests` berstatus `needs_ok`. Ledgernya baru
 * ditulis ortu saat "done" (lihat /api/parent/requests/[id]).
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyChildToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    childId?: string;
    kind?: 'cash_out' | 'give_away';
    amount?: number;
    sourceWalletId?: string;
    reason?: string;
  } | null;
  if (
    !body?.childId ||
    body.childId !== identity.childId ||
    !body.kind ||
    !body.amount ||
    body.amount <= 0 ||
    !body.sourceWalletId
  ) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if (body.kind === 'cash_out' && !body.reason?.trim()) {
    return NextResponse.json({ error: 'reason_required' }, { status: 400 });
  }

  const db = supabaseService();
  const childId = identity.childId;

  const [walletRes, balanceRes] = await Promise.all([
    db.from('wallets').select('*').eq('id', body.sourceWalletId).eq('child_id', childId).maybeSingle(),
    db.from('wallet_balances').select('balance').eq('wallet_id', body.sourceWalletId).maybeSingle(),
  ]);
  if (!walletRes.data) return NextResponse.json({ error: 'unknown_wallet' }, { status: 400 });

  const wallet = walletFromRow(walletRes.data as WalletRow);
  const balance = Number((balanceRes.data as { balance: number } | null)?.balance ?? 0);

  if (body.kind === 'cash_out' && !canCashOutFrom(wallet)) {
    return NextResponse.json({ error: 'source_not_allowed' }, { status: 400 });
  }
  if (body.kind === 'give_away' && wallet.category !== 'give') {
    return NextResponse.json({ error: 'source_not_allowed' }, { status: 400 });
  }
  if (body.amount > balance) return NextResponse.json({ error: 'not_enough' }, { status: 400 });

  const { data, error } = await db
    .from('requests')
    .insert({
      child_id: childId,
      kind: body.kind,
      amount: body.amount,
      source_wallet_id: body.sourceWalletId,
      reason: body.reason?.trim() || null,
    })
    .select('id')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, requestId: data.id });
}
