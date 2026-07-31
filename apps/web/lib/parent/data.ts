import type { SupabaseClient } from '@supabase/supabase-js';
import { walletFromRow, walletsTotal, categoryTotal, type WalletRow } from '../kid/data';

export interface ParentFamily {
  id: string;
  name: string;
  familyCode: string;
}

export interface ParentChildSummary {
  id: string;
  name: string;
  tier: string;
  total: number;
  unsorted: number;
  pendingCount: number;
}

/** Null kalau ortu belum tertaut keluarga (tidak pernah terjadi lewat trigger 0020, tapi dijaga). */
export async function loadParentFamily(
  client: SupabaseClient,
  userId: string,
): Promise<ParentFamily | null> {
  const { data: parentRow, error } = await client
    .from('parents')
    .select('family_id')
    .eq('id', userId)
    .maybeSingle();
  if (error || !parentRow) return null;

  const { data: family } = await client
    .from('families')
    .select('id,name,family_code')
    .eq('id', parentRow.family_id)
    .single();
  if (!family) return null;

  return { id: family.id, name: family.name, familyCode: family.family_code };
}

export async function loadChildren(
  client: SupabaseClient,
  familyId: string,
): Promise<ParentChildSummary[]> {
  const { data: children, error } = await client
    .from('children')
    .select('id,name,tier')
    .eq('family_id', familyId);
  if (error || !children) return [];

  const summaries: ParentChildSummary[] = [];
  for (const child of children as Array<{ id: string; name: string; tier: string }>) {
    const [walletsRes, balancesRes, requestsRes] = await Promise.all([
      client.from('wallets').select('*').eq('child_id', child.id).is('archived_at', null),
      client.from('wallet_balances').select('wallet_id,balance').eq('child_id', child.id),
      client
        .from('requests')
        .select('id', { count: 'exact', head: true })
        .eq('child_id', child.id)
        .eq('status', 'needs_ok'),
    ]);

    const wallets = ((walletsRes.data ?? []) as WalletRow[]).map(walletFromRow);
    const balances: Record<string, number> = {};
    for (const row of (balancesRes.data ?? []) as Array<{ wallet_id: string; balance: number }>) {
      balances[row.wallet_id] = Number(row.balance);
    }

    summaries.push({
      id: child.id,
      name: child.name,
      tier: child.tier,
      total: walletsTotal(wallets, balances),
      unsorted: categoryTotal(wallets, balances, 'unsorted'),
      pendingCount: requestsRes.count ?? 0,
    });
  }
  return summaries;
}

export interface ParentRequestRow {
  id: string;
  childId: string;
  childName: string;
  kind: string;
  amount: number;
  reason: string | null;
  status: string;
  fulfilment: string;
  sourceWalletId: string | null;
  createdAt: string;
}

/** Approval inbox — semua request `needs_ok`/`talk_about_it` lintas anak keluarga ini. */
export async function loadPendingRequests(
  client: SupabaseClient,
  familyId: string,
): Promise<ParentRequestRow[]> {
  const { data: children } = await client.from('children').select('id,name').eq('family_id', familyId);
  const byId = new Map(((children ?? []) as Array<{ id: string; name: string }>).map((c) => [c.id, c.name]));
  const childIds = Array.from(byId.keys());
  if (childIds.length === 0) return [];

  const { data, error } = await client
    .from('requests')
    .select('id,child_id,kind,amount,reason,status,fulfilment,source_wallet_id,created_at')
    .in('child_id', childIds)
    .in('status', ['needs_ok', 'talk_about_it'])
    .order('created_at', { ascending: true });
  if (error || !data) return [];

  return (
    data as Array<{
      id: string;
      child_id: string;
      kind: string;
      amount: number;
      reason: string | null;
      status: string;
      fulfilment: string;
      source_wallet_id: string | null;
      created_at: string;
    }>
  ).map((r) => ({
    id: r.id,
    childId: r.child_id,
    childName: byId.get(r.child_id) ?? '?',
    kind: r.kind,
    amount: Number(r.amount),
    reason: r.reason,
    status: r.status,
    fulfilment: r.fulfilment,
    sourceWalletId: r.source_wallet_id,
    createdAt: r.created_at,
  }));
}

/** "Promise debt" (ADR-0002 §promiseDebt di packages/core/rules.ts) — approved tapi belum done. */
export async function loadPromiseDebt(
  client: SupabaseClient,
  familyId: string,
): Promise<ParentRequestRow[]> {
  const { data: children } = await client.from('children').select('id,name').eq('family_id', familyId);
  const byId = new Map(((children ?? []) as Array<{ id: string; name: string }>).map((c) => [c.id, c.name]));
  const childIds = Array.from(byId.keys());
  if (childIds.length === 0) return [];

  const { data } = await client
    .from('requests')
    .select('id,child_id,kind,amount,reason,status,fulfilment,source_wallet_id,created_at')
    .in('child_id', childIds)
    .eq('status', 'approved')
    .eq('fulfilment', 'todo')
    .order('created_at', { ascending: true });

  return (
    (data ?? []) as Array<{
      id: string;
      child_id: string;
      kind: string;
      amount: number;
      reason: string | null;
      status: string;
      fulfilment: string;
      source_wallet_id: string | null;
      created_at: string;
    }>
  ).map((r) => ({
    id: r.id,
    childId: r.child_id,
    childName: byId.get(r.child_id) ?? '?',
    kind: r.kind,
    amount: Number(r.amount),
    reason: r.reason,
    status: r.status,
    fulfilment: r.fulfilment,
    sourceWalletId: r.source_wallet_id,
    createdAt: r.created_at,
  }));
}
