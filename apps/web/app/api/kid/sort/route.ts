import { NextResponse } from 'next/server';
import { sortPlan } from '@core/sort';
import type { Category, MoneyRules, Wallet } from '@core/types';
import { bearerFrom, supabaseService, verifyChildToken } from '../../../../lib/kid/server';
import { walletFromRow, type WalletRow } from '../../../../lib/kid/data';

/**
 * POST /api/kid/sort — menulis hasil Sort ke ledger.
 *
 * Rencana DIHITUNG ULANG di server dari `money_rules` + saldo Unsorted saat ini
 * (bukan dipercaya dari body klien) — precis alasan yang sama dengan kenapa
 * `packages/core` mengembalikan "rencana yang bisa dilihat, bukan langsung menulis
 * ledger" (sort.ts). Klien hanya mengirim `childId`; jumlah datang dari database.
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyChildToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { childId?: string } | null;
  if (!body?.childId || body.childId !== identity.childId) {
    return NextResponse.json({ error: 'childId mismatch' }, { status: 403 });
  }

  const db = supabaseService();
  const childId = identity.childId;

  const [walletsRes, balancesRes, rulesRes] = await Promise.all([
    db.from('wallets').select('*').eq('child_id', childId).is('archived_at', null),
    db.from('wallet_balances').select('wallet_id,balance').eq('child_id', childId),
    db.from('money_rules').select('*').eq('child_id', childId).maybeSingle(),
  ]);
  if (walletsRes.error) return NextResponse.json({ error: walletsRes.error.message }, { status: 500 });
  if (balancesRes.error) return NextResponse.json({ error: balancesRes.error.message }, { status: 500 });

  const wallets: Wallet[] = (walletsRes.data as WalletRow[]).map(walletFromRow);
  const balances: Record<string, number> = {};
  for (const row of (balancesRes.data ?? []) as Array<{ wallet_id: string; balance: number }>) {
    balances[row.wallet_id] = Number(row.balance);
  }

  const unsortedWallet = wallets.find((w) => w.category === 'unsorted');
  if (!unsortedWallet) return NextResponse.json({ error: 'no unsorted wallet' }, { status: 500 });
  const amount = balances[unsortedWallet.id] ?? 0;
  if (amount <= 0) return NextResponse.json({ error: 'nothing to sort' }, { status: 400 });

  const rulesRow = rulesRes.data as {
    mode: MoneyRules['mode'];
    auto_split_enabled: boolean;
    ratios: Partial<Record<Category, number>>;
    destinations: Partial<Record<Category, string>>;
  } | null;
  const rules: MoneyRules = rulesRow
    ? {
        childId,
        mode: rulesRow.mode,
        autoSplit: {
          enabled: rulesRow.auto_split_enabled,
          ratios: rulesRow.ratios ?? {},
          destinations: rulesRow.destinations ?? {},
        },
      }
    : { childId, mode: 'flexible', autoSplit: { enabled: false, ratios: {}, destinations: {} } };

  const plan = sortPlan(amount, rules, wallets);
  if (plan.slots.length === 0) {
    return NextResponse.json({ error: 'nothing to place — turn on auto-split first' }, { status: 400 });
  }

  const rows = plan.slots.map((slot) => ({
    child_id: childId,
    from_wallet_id: unsortedWallet.id,
    to_wallet_id: slot.wallet.id,
    amount: slot.amount,
    reason: 'sort' as const,
  }));

  const { error: insertError } = await db.from('ledger_entries').insert(rows);
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ ok: true, placed: rows.length, remainderToUnsorted: plan.remainderToUnsorted });
}
