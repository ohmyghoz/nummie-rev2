import type { SupabaseClient } from '@supabase/supabase-js';
import type { Category, MoneyRules, Pocket, Wallet } from '@core/types';

/**
 * Baris mentah dari Postgres (snake_case) → tipe `packages/core` (camelCase).
 * Satu tempat untuk pemetaan ini — supaya screen tidak masing-masing menebak nama kolom.
 */

export interface WalletRow {
  id: string;
  child_id: string;
  name: string;
  category: Pocket;
  kind: Wallet['kind'];
  target_amount: number | null;
  instrument: Wallet['instrument'] | null;
  tenor_months: number | null;
  locked_rate_pct: number | null;
  started_at: string | null;
}

export function walletFromRow(row: WalletRow): Wallet {
  return {
    id: row.id,
    childId: row.child_id,
    name: row.name,
    category: row.category,
    kind: row.kind,
    targetAmount: row.target_amount ?? undefined,
    instrument: row.instrument ?? undefined,
    tenorMonths: (row.tenor_months ?? undefined) as Wallet['tenorMonths'],
    lockedRatePct: row.locked_rate_pct ?? undefined,
    startedAt: row.started_at ?? undefined,
  };
}

export interface KidData {
  child: { id: string; name: string; tier: string };
  wallets: Wallet[];
  balances: Record<string, number>;
  rules: MoneyRules;
  starsBalance: number;
  gemsBalance: number;
  pendingRequestCount: number;
  ledger: Array<{
    id: string;
    fromWalletId: string | null;
    toWalletId: string | null;
    amount: number;
    reason: string;
    createdAt: string;
  }>;
}

/** Satu tarikan data yang dipakai Home/Sort/Wallets. RLS memagari lewat klaim `child_id`. */
export async function loadKidData(client: SupabaseClient, childId: string): Promise<KidData> {
  const [childRes, walletsRes, balancesRes, rulesRes, economyRes, gemsRes, requestsRes, ledgerRes] =
    await Promise.all([
      client.from('children').select('id,name,tier').eq('id', childId).single(),
      client.from('wallets').select('*').eq('child_id', childId).is('archived_at', null),
      client.from('wallet_balances').select('wallet_id,balance').eq('child_id', childId),
      client.from('money_rules').select('*').eq('child_id', childId).maybeSingle(),
      client.from('child_economy').select('stars_balance').eq('child_id', childId).maybeSingle(),
      client.from('gem_balances').select('balance').eq('child_id', childId).maybeSingle(),
      client.from('requests').select('id,status').eq('child_id', childId).eq('status', 'needs_ok'),
      client
        .from('ledger_entries')
        .select('id,from_wallet_id,to_wallet_id,amount,reason,created_at')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

  if (childRes.error) throw childRes.error;
  if (walletsRes.error) throw walletsRes.error;
  if (balancesRes.error) throw balancesRes.error;

  const wallets = (walletsRes.data as WalletRow[]).map(walletFromRow);
  const balances: Record<string, number> = {};
  for (const row of (balancesRes.data ?? []) as Array<{ wallet_id: string; balance: number }>) {
    balances[row.wallet_id] = Number(row.balance);
  }

  const rulesRow = rulesRes.data as {
    mode: 'flexible' | 'strict';
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

  return {
    child: {
      id: childRes.data.id,
      name: childRes.data.name,
      tier: childRes.data.tier,
    },
    wallets,
    balances,
    rules,
    starsBalance: (economyRes.data as { stars_balance: number } | null)?.stars_balance ?? 0,
    gemsBalance: (gemsRes.data as { balance: number } | null)?.balance ?? 0,
    pendingRequestCount: requestsRes.data?.length ?? 0,
    ledger: ((ledgerRes.data ?? []) as Array<{
      id: string;
      from_wallet_id: string | null;
      to_wallet_id: string | null;
      amount: number;
      reason: string;
      created_at: string;
    }>).map((r) => ({
      id: r.id,
      fromWalletId: r.from_wallet_id,
      toWalletId: r.to_wallet_id,
      amount: Number(r.amount),
      reason: r.reason,
      createdAt: r.created_at,
    })),
  };
}

export function walletsTotal(wallets: Wallet[], balances: Record<string, number>): number {
  return wallets.reduce((sum, w) => sum + (balances[w.id] ?? 0), 0);
}

export function categoryTotal(
  wallets: Wallet[],
  balances: Record<string, number>,
  category: Pocket,
): number {
  return wallets
    .filter((w) => w.category === category)
    .reduce((sum, w) => sum + (balances[w.id] ?? 0), 0);
}
