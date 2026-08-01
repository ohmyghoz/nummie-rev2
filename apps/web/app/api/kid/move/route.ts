import { NextResponse } from 'next/server';
import { movePlan } from '@core/move';
import type { Category, MoneyRules, Wallet } from '@core/types';
import { bearerFrom, supabaseService, verifyChildToken } from '../../../../lib/kid/server';
import { walletFromRow, type WalletRow } from '../../../../lib/kid/data';

/**
 * POST /api/kid/move — perpindahan langsung anak-ke-anak (tanpa OK ortu, mockup :938 "Move
 * happens right away"). Sama pola verifikasi dengan /api/kid/sort: identitas lewat
 * `auth_child_id()`, tulis ledger lewat service role. `movePlan()` divalidasi ulang di
 * server dari saldo & `money_rules` sungguhan — bukan dipercaya dari body klien.
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyChildToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    childId?: string;
    fromWalletId?: string;
    toWalletId?: string;
    amount?: number;
  } | null;
  if (!body?.childId || body.childId !== identity.childId || !body.fromWalletId || !body.toWalletId || !body.amount) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const db = supabaseService();
  const childId = identity.childId;

  const [walletsRes, balancesRes, rulesRes] = await Promise.all([
    db.from('wallets').select('*').eq('child_id', childId).is('archived_at', null),
    db.from('wallet_balances').select('wallet_id,balance').eq('child_id', childId),
    db.from('money_rules').select('*').eq('child_id', childId).maybeSingle(),
  ]);
  if (walletsRes.error) return NextResponse.json({ error: walletsRes.error.message }, { status: 500 });

  const wallets: Wallet[] = (walletsRes.data as WalletRow[]).map(walletFromRow);
  const balances: Record<string, number> = {};
  for (const row of (balancesRes.data ?? []) as Array<{ wallet_id: string; balance: number }>) {
    balances[row.wallet_id] = Number(row.balance);
  }

  const from = wallets.find((w) => w.id === body.fromWalletId);
  const to = wallets.find((w) => w.id === body.toWalletId);
  if (!from || !to) return NextResponse.json({ error: 'unknown_wallet' }, { status: 400 });

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

  const plan = movePlan(from, to, body.amount, rules, balances);
  if (!plan.ok) return NextResponse.json({ error: plan.errorKey }, { status: 400 });

  const { error: insertError } = await db.from('ledger_entries').insert({
    child_id: childId,
    from_wallet_id: from.id,
    to_wallet_id: to.id,
    amount: plan.amount,
    reason: 'move',
  });
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  // Denda ⭐ "merampok" dream — dihitung movePlan(), ditulis di sini kalau > 0.
  if (plan.starPenalty > 0) {
    const { data: economy } = await db.from('child_economy').select('stars_balance').eq('child_id', childId).maybeSingle();
    const current = economy?.stars_balance ?? 0;
    await db
      .from('child_economy')
      .upsert({ child_id: childId, stars_balance: Math.max(0, current - plan.starPenalty) });
  }

  return NextResponse.json({ ok: true, fromAfter: plan.fromAfter, toAfter: plan.toAfter, starPenalty: plan.starPenalty });
}
