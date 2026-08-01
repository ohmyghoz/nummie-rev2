'use client';

import { useCallback, useEffect, useState } from 'react';
import { clearKidSession, loadKidSession, supabaseForKid, type KidSession } from '../../../lib/kid/session';
import { loadKidData, type KidData } from '../../../lib/kid/data';
import { Login } from './Login';
import { HomeTab } from './HomeTab';
import { WalletsTab } from './WalletsTab';
import { MeTab } from './MeTab';
import { SortScreen } from './SortScreen';
import { MoveScreen } from './MoveScreen';
import { CashoutScreen } from './CashoutScreen';
import { GiveAwayScreen } from './GiveAwayScreen';
import { RequestsScreen } from './RequestsScreen';
import { HistoryScreen } from './HistoryScreen';
import { MoneySheet } from './MoneySheet';
import { BottomNav, ScrollArea, Toast, type KidTab } from './shell';

type PushKey = 'sort' | 'move' | 'cashout' | 'giveaway' | 'requests' | 'history' | 'grow' | null;

/**
 * Root `/kid` — state machine tab/push/toast persis mockup (state-based, bukan
 * routing per tab — kid-shell.md §navigasi). Menangani gerbang sesi + tarikan data.
 */
export function KidApp() {
  const [session, setSession] = useState<KidSession | null | undefined>(undefined);
  const [data, setData] = useState<KidData | null>(null);
  const [tab, setTab] = useState<KidTab>('home');
  const [push, setPush] = useState<PushKey>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setSession(loadKidSession());
  }, []);

  const refresh = useCallback(async (s: KidSession) => {
    try {
      const client = supabaseForKid(s);
      const fresh = await loadKidData(client, s.childId);
      setData(fresh);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load.');
    }
  }, []);

  useEffect(() => {
    if (session) void refresh(session);
  }, [session, refresh]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  if (session === undefined) return null; // sebentar, baca localStorage

  if (!session) {
    return <Login onSuccess={(s) => setSession(s)} />;
  }

  function signOut() {
    clearKidSession();
    setSession(null);
    setData(null);
    setTab('home');
    setPush(null);
  }

  if (loadError) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--loss)' }}>{loadError}</div>
        <button onClick={signOut} style={{ marginTop: '16px', color: 'var(--brand)', fontWeight: 700 }}>
          Sign out
        </button>
      </div>
    );
  }

  if (!data) return null; // memuat

  function onPushDone(message: string) {
    setPush(null);
    setToast(message);
    void refresh(session as KidSession);
  }

  function onMoved() {
    setPush(null);
    void refresh(session as KidSession);
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden', background: 'var(--canvas)' }}>
      <ScrollArea>
        {tab === 'home' ? <HomeTab data={data} onTab={setTab} onPush={(p) => setPush(p as PushKey)} /> : null}
        {tab === 'wallets' ? (
          <WalletsTab
            data={data}
            session={session}
            onPush={(p) => setPush(p as PushKey)}
            onChanged={() => void refresh(session as KidSession)}
          />
        ) : null}
        {tab === 'missions' ? <ComingSoon label="Missions" /> : null}
        {tab === 'me' ? <MeTab data={data} onSignOut={signOut} /> : null}
      </ScrollArea>

      <BottomNav tab={tab} onTab={setTab} onMoney={() => setSheetOpen(true)} />

      {sheetOpen ? (
        <MoneySheet
          data={data}
          onClose={() => setSheetOpen(false)}
          onPush={(p) => setPush(p as PushKey)}
        />
      ) : null}

      {push === 'sort' ? (
        <SortScreen data={data} session={session} onBack={() => setPush(null)} onDone={onPushDone} />
      ) : null}
      {push === 'move' ? (
        <MoveScreen data={data} session={session} onBack={() => setPush(null)} onDone={onMoved} />
      ) : null}
      {push === 'cashout' ? (
        <CashoutScreen data={data} session={session} onBack={() => setPush(null)} onDone={onPushDone} />
      ) : null}
      {push === 'giveaway' ? (
        <GiveAwayScreen data={data} session={session} onBack={() => setPush(null)} onDone={onPushDone} />
      ) : null}
      {push === 'requests' ? <RequestsScreen session={session} onBack={() => setPush(null)} /> : null}
      {push === 'history' ? <HistoryScreen session={session} onBack={() => setPush(null)} /> : null}
      {push === 'grow' ? <ComingSoonPush label="Grow" onBack={() => setPush(null)} /> : null}

      <Toast message={toast} />
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: '13px' }}>
      {label} — not built yet (Tahap 1 lanjutan).
    </div>
  );
}

function ComingSoonPush({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--canvas)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{label} — full simulation not built yet.</div>
      <button onClick={onBack} style={{ color: 'var(--brand)', fontWeight: 700, fontSize: '13px' }}>
        Back
      </button>
    </div>
  );
}
