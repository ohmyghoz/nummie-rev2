import { NextResponse } from 'next/server';
import { canGrowInFrom } from '@core/grow';
import { walletFromRow, type WalletRow } from '../../../../../lib/kid/data';
import { bearerFrom, supabaseService, verifyChildToken } from '../../../../../lib/kid/server';

/**
 * POST /api/kid/grow/buy — Time Deposit saja (Gold/FX belum diport, lihat docs/PROGRESS.md).
 * Membuat wallet instrumen BARU (belum "started" — dibekukan saat ortu approve, migrasi 0014)
 * + request `grow_in`. Ledger baru ditulis saat approve (grow_in = jalur instan,
 * packages/core/requests.ts INSTANT_KINDS).
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyChildToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    childId?: string;
    sourceWalletId?: string;
    amount?: number;
    tenorMonths?: 3 | 6 | 12;
  } | null;
  if (!body?.childId || body.childId !== identity.childId || !body.sourceWalletId || !body.amount || !body.tenorMonths) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const db = supabaseService();
  const childId = identity.childId;

  const [{ data: sourceRow }, { data: balanceRow }] = await Promise.all([
    db.from('wallets').select('*').eq('id', body.sourceWalletId).eq('child_id', childId).maybeSingle(),
    db.from('wallet_balances').select('balance').eq('wallet_id', body.sourceWalletId).maybeSingle(),
  ]);
  if (!sourceRow) return NextResponse.json({ error: 'unknown_wallet' }, { status: 400 });

  const source = walletFromRow(sourceRow as WalletRow);
  const balance = Number((balanceRow as { balance: number } | null)?.balance ?? 0);
  if (!canGrowInFrom(source)) return NextResponse.json({ error: 'source_not_allowed' }, { status: 400 });
  if (body.amount > balance) return NextResponse.json({ error: 'not_enough' }, { status: 400 });

  // tenor_months/locked_rate_pct/started_at TIDAK diisi di sini — migrasi 0014
  // (deposit_terms_all_or_none) menuntut ketiganya sekaligus atau tidak sama sekali.
  // Kesepakatan baru terbentuk saat ortu approve (lihat requests/[id]/route.ts); tenor pilihan
  // anak untuk sementara hidup di requests.grow_tenor_months.
  const { data: newWallet, error: walletError } = await db
    .from('wallets')
    .insert({
      child_id: childId,
      name: `Time Deposit · ${body.tenorMonths}mo`,
      category: 'grow',
      kind: 'instrument',
      instrument: 'time_deposit',
    })
    .select('id')
    .single();
  if (walletError) return NextResponse.json({ error: walletError.message }, { status: 500 });

  const { data: req, error: reqError } = await db
    .from('requests')
    .insert({
      child_id: childId,
      kind: 'grow_in',
      amount: body.amount,
      source_wallet_id: body.sourceWalletId,
      destination_wallet_id: newWallet.id,
      grow_tenor_months: body.tenorMonths,
    })
    .select('id')
    .single();
  if (reqError) return NextResponse.json({ error: reqError.message }, { status: 500 });

  return NextResponse.json({ ok: true, requestId: req.id });
}
