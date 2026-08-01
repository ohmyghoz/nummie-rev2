import { NextResponse } from 'next/server';
import { validateAllowance, type AllowanceFrequency } from '@core/settings';
import { bearerFrom, supabaseService, verifyParentToken } from '../../../../lib/parent/server';

/**
 * POST /api/parent/allowance — simpan jadwal uang saku.
 *
 * `allowance_schedules` cuma punya policy SELECT (`allowance_read`) — tidak ada jalur tulis
 * langsung untuk `authenticated`, sama seperti `ledger_entries`. Route handler + service role
 * inilah satu-satunya jalan, konsisten dengan pola Sort/Move/Add-a-child.
 */
export async function POST(request: Request) {
  const token = bearerFrom(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const identity = await verifyParentToken(token);
  if (!identity) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    childId?: string;
    enabled?: boolean;
    amount?: number;
    frequency?: AllowanceFrequency;
    day?: number;
    anchorDate?: string;
  } | null;
  if (!body?.childId || body.enabled === undefined || !body.frequency || body.day === undefined) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const db = supabaseService();

  const { data: child } = await db.from('children').select('family_id').eq('id', body.childId).maybeSingle();
  if (!child || child.family_id !== identity.familyId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const check = validateAllowance({
    enabled: body.enabled,
    amount: body.amount ?? 0,
    frequency: body.frequency,
    day: body.day,
    anchorDate: body.anchorDate,
  });
  if (!check.ok) return NextResponse.json({ error: check.errorKey }, { status: 400 });

  const { error } = await db.from('allowance_schedules').upsert(
    {
      child_id: body.childId,
      enabled: body.enabled,
      amount: body.amount ?? 0,
      frequency: body.frequency,
      day: body.day,
      anchor_date: body.anchorDate ?? null,
    },
    { onConflict: 'child_id' },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
