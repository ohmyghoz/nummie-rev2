import { NextResponse } from 'next/server';
import { harvestDestinations } from '@core/grow';
import { walletFromRow, type WalletRow } from '../../../../../lib/kid/data';
import { bearerFrom, supabaseService, verifyChildToken } from '../../../../../lib/kid/server';

/**
 * POST /api/kid/grow/harvest — mengajukan Harvest Time Deposit (Fase 3, tiga pilihan).
 * `amount` sengaja TIDAK dikirim — bunga & pokok dihitung ulang server-side saat approve dari
 * `locked_rate_pct` yang dibekukan (migrasi 0014), bukan dipercaya dari klien.
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyChildToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    childId?: string;
    walletId?: string;
    choice?: 'cash_out' | 'roll_over' | 'take_profit';
  } | null;
  if (!body?.childId || body.childId !== identity.childId || !body.walletId || !body.choice) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const db = supabaseService();
  const childId = identity.childId;

  const [{ data: walletRow }, { data: wallets }] = await Promise.all([
    db.from('wallets').select('*').eq('id', body.walletId).eq('child_id', childId).maybeSingle(),
    db.from('wallets').select('*').eq('child_id', childId).is('archived_at', null),
  ]);
  if (!walletRow) return NextResponse.json({ error: 'unknown_wallet' }, { status: 400 });

  const wallet = walletFromRow(walletRow as WalletRow);
  if (wallet.instrument !== 'time_deposit' || !wallet.startedAt) {
    return NextResponse.json({ error: 'not_matured' }, { status: 400 });
  }

  const destination = harvestDestinations(((wallets ?? []) as WalletRow[]).map(walletFromRow))[0];
  if (!destination) return NextResponse.json({ error: 'no_save_wallet' }, { status: 500 });

  const { data: req, error } = await db
    .from('requests')
    .insert({
      child_id: childId,
      kind: 'harvest',
      source_wallet_id: body.walletId,
      destination_wallet_id: destination.id,
      harvest_choice: body.choice,
    })
    .select('id')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, requestId: req.id });
}
