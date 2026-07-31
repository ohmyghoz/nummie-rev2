import { NextResponse } from 'next/server';
import { approve, decline, markDone, talkAboutIt } from '@core/requests';
import type { Fulfilment, MoneyRequest, RequestStatus } from '@core/types';
import { bearerFrom, supabaseService, verifyParentToken } from '../../../../../lib/parent/server';

/**
 * POST /api/parent/requests/:id — approve ≠ fulfil (ADR-0002), lima jalur dari
 * packages/core/requests.ts. Ledger baru ditulis pada titik yang benar per jalur
 * (`postsLedgerOn`): instan (grow_in/harvest/mission_claim) saat approve, sisanya saat done.
 *
 * Sesi ini hanya melengkapi tulisan ledger untuk `cash_out` & `give_away` (satu-satunya yang
 * punya layar sisi anak yang sudah jalan). `grow_in`/`harvest`/`mission_claim` bisa
 * approve/decline/talk (statusnya berubah, diuji), tapi TIDAK menulis ledger/gem di sini —
 * itu bagian Grow/Missions penuh yang belum digarap (docs/PROGRESS.md).
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
      'id,child_id,kind,amount,source_wallet_id,destination_wallet_id,status,fulfilment,fulfilment_story',
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

  // Ledger hanya untuk cash_out/give_away, hanya saat benar-benar "done" (uang keluar dunia nyata).
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

  return NextResponse.json({ ok: true, status: next.status, fulfilment: next.fulfilment });
}
