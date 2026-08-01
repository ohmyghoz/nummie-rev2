import { NextResponse } from 'next/server';
import { approve, decline, markDone, talkAboutIt } from '@core/requests';
import { tdHarvestOutcome, tenorRate, type Tenor } from '@core/grow';
import type { Fulfilment, MoneyRequest, RequestStatus } from '@core/types';
import { bearerFrom, supabaseService, verifyParentToken } from '../../../../../lib/parent/server';

/**
 * POST /api/parent/requests/:id — approve ≠ fulfil (ADR-0002), lima jalur dari
 * packages/core/requests.ts. Ledger baru ditulis pada titik yang benar per jalur
 * (`postsLedgerOn`): instan (grow_in/harvest/mission_claim) saat approve, sisanya saat done.
 *
 * `mission_claim` masih belum menulis gem/ledger di sini — Missions penuh belum digarap
 * (docs/PROGRESS.md). `grow_in`/`harvest` (Time Deposit saja — Gold/FX belum diport) SEKARANG
 * menulis ledger sungguhan di sini, dijelaskan di bawah.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyParentToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { action?: string; story?: string } | null;
  if (!body?.action) return NextResponse.json({ error: 'missing_action' }, { status: 400 });

  const db = supabaseService();

  const { data: row, error: fetchError } = await db
    .from('requests')
    .select(
      'id,child_id,kind,amount,source_wallet_id,destination_wallet_id,status,fulfilment,fulfilment_story,harvest_choice,grow_tenor_months',
    )
    .eq('id', id)
    .single();
  if (fetchError || !row) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  // Pagar keluarga: request harus milik anak di keluarga ortu ini (bukan cuma "ada").
  const { data: child } = await db.from('children').select('family_id').eq('id', row.child_id).single();
  if (!child || child.family_id !== identity.familyId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const domainRequest: MoneyRequest = {
    id: row.id,
    childId: row.child_id,
    kind: row.kind,
    amount: Number(row.amount),
    sourceWalletId: row.source_wallet_id ?? undefined,
    status: row.status as RequestStatus,
    fulfilment: row.fulfilment as Fulfilment,
    fulfilmentStory: row.fulfilment_story ?? undefined,
  };

  let transition;
  switch (body.action) {
    case 'approve':
      transition = approve(domainRequest, identity.userId);
      break;
    case 'decline':
      transition = decline(domainRequest, identity.userId);
      break;
    case 'talk':
      transition = talkAboutIt(domainRequest, identity.userId);
      break;
    case 'done':
      transition = markDone(domainRequest, body.story);
      break;
    default:
      return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  }

  if (!transition.ok || !transition.request) {
    return NextResponse.json({ error: transition.errorKey }, { status: 400 });
  }
  const next = transition.request;

  const { error: updateError } = await db
    .from('requests')
    .update({
      status: next.status,
      fulfilment: next.fulfilment,
      fulfilment_story: next.fulfilmentStory ?? null,
      decided_by: identity.userId,
      decided_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // Ledger untuk cash_out/give_away hanya saat benar-benar "done" (uang keluar dunia nyata).
  if (body.action === 'done' && (row.kind === 'cash_out' || row.kind === 'give_away') && row.source_wallet_id) {
    const { error: ledgerError } = await db.from('ledger_entries').insert({
      child_id: row.child_id,
      from_wallet_id: row.source_wallet_id,
      to_wallet_id: null,
      amount: row.amount,
      reason: row.kind,
      request_id: row.id,
      created_by: identity.userId,
    });
    if (ledgerError) return NextResponse.json({ error: ledgerError.message }, { status: 500 });
  }

  // grow_in: jalur instan (INSTANT_KINDS) — ledger ditulis saat approve, bukan saat done.
  // Membekukan tenorMonths/lockedRatePct/startedAt di wallet instrumen (migrasi 0014: kesepakatan
  // deposito dikunci saat ortu menyetujui, bukan berubah kalau rate di Settings berubah nanti).
  if (body.action === 'approve' && row.kind === 'grow_in' && row.source_wallet_id && row.destination_wallet_id) {
    const [{ data: rates }, ledgerRes] = await Promise.all([
      db.from('bank_rates').select('m3,m6,m12').eq('family_id', identity.familyId).maybeSingle(),
      db.from('ledger_entries').insert({
        child_id: row.child_id,
        from_wallet_id: row.source_wallet_id,
        to_wallet_id: row.destination_wallet_id,
        amount: row.amount,
        reason: 'grow_in',
        request_id: row.id,
        created_by: identity.userId,
      }),
    ]);
    if (ledgerRes.error) return NextResponse.json({ error: ledgerRes.error.message }, { status: 500 });

    if (row.grow_tenor_months) {
      const tenor = row.grow_tenor_months as Tenor;
      const prices = {
        goldSellPerGram: 0,
        goldBuybackPerGram: 0,
        fxMid: {},
        fxSpread: 0,
        bankRates: { m3: Number(rates?.m3 ?? 0), m6: Number(rates?.m6 ?? 0), m12: Number(rates?.m12 ?? 0) },
        updatedAt: new Date().toISOString(),
      };
      await db
        .from('wallets')
        .update({
          tenor_months: tenor,
          locked_rate_pct: tenorRate(tenor, prices),
          started_at: new Date().toISOString().slice(0, 10),
        })
        .eq('id', row.destination_wallet_id);
    }
  }

  // harvest (TD saja): pokok dari saldo nyata wallet instrumen (bukan dipercaya dari klien),
  // bunga dari `locked_rate_pct` yang dibekukan saat approve grow_in di atas — TIDAK dihitung
  // ulang dari rate Settings sekarang, itu justru yang dicegah pembekuan 0014.
  if (body.action === 'approve' && row.kind === 'harvest' && row.source_wallet_id && row.destination_wallet_id) {
    const [{ data: tdWallet }, { data: balanceRow }] = await Promise.all([
      db.from('wallets').select('locked_rate_pct,tenor_months').eq('id', row.source_wallet_id).single(),
      db.from('wallet_balances').select('balance').eq('wallet_id', row.source_wallet_id).maybeSingle(),
    ]);
    const principal = Number((balanceRow as { balance: number } | null)?.balance ?? 0);
    const rate = Number(tdWallet?.locked_rate_pct ?? 0);
    const interest = Math.floor((principal * rate) / 100);
    const choice = (row.harvest_choice ?? 'cash_out') as 'cash_out' | 'roll_over' | 'take_profit';
    const outcome = tdHarvestOutcome(principal, interest, choice);

    // Bunga selalu "dibayar" ortu-sebagai-bank ke wallet TD dulu (uang masuk dari luar).
    const inserts: Array<{
      child_id: string;
      from_wallet_id: string | null;
      to_wallet_id: string | null;
      amount: number;
      reason: 'harvest';
      request_id: string;
      created_by: string;
    }> = [];
    if (interest > 0) {
      inserts.push({
        child_id: row.child_id,
        from_wallet_id: null,
        to_wallet_id: row.source_wallet_id,
        amount: interest,
        reason: 'harvest',
        request_id: row.id,
        created_by: identity.userId,
      });
    }
    if (outcome.toSave > 0) {
      inserts.push({
        child_id: row.child_id,
        from_wallet_id: row.source_wallet_id,
        to_wallet_id: row.destination_wallet_id,
        amount: outcome.toSave,
        reason: 'harvest',
        request_id: row.id,
        created_by: identity.userId,
      });
    }
    for (const entry of inserts) {
      const { error: harvestError } = await db.from('ledger_entries').insert(entry);
      if (harvestError) return NextResponse.json({ error: harvestError.message }, { status: 500 });
    }

    // roll_over/take_profit: kesepakatan baru mulai hari ini (tenor sama, rate mengikuti
    // Settings terbaru saat renewal — beda dengan setoran baru yang menguncinya).
    if (choice !== 'cash_out' && tdWallet?.tenor_months) {
      const { data: currentRates } = await db
        .from('bank_rates')
        .select('m3,m6,m12')
        .eq('family_id', identity.familyId)
        .maybeSingle();
      const renewalTenor = tdWallet.tenor_months as Tenor;
      const renewalPrices = {
        goldSellPerGram: 0,
        goldBuybackPerGram: 0,
        fxMid: {},
        fxSpread: 0,
        bankRates: {
          m3: Number(currentRates?.m3 ?? 0),
          m6: Number(currentRates?.m6 ?? 0),
          m12: Number(currentRates?.m12 ?? 0),
        },
        updatedAt: new Date().toISOString(),
      };
      await db
        .from('wallets')
        .update({
          locked_rate_pct: tenorRate(renewalTenor, renewalPrices),
          started_at: new Date().toISOString().slice(0, 10),
        })
        .eq('id', row.source_wallet_id);
    }
  }

  return NextResponse.json({ ok: true, status: next.status, fulfilment: next.fulfilment });
}
