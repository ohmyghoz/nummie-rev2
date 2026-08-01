'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabaseBrowser } from '../../../lib/supabase-browser';
import { getParentSession, onParentAuthChange } from '../../../lib/parent/session';
import {
  loadChildren,
  loadParentFamily,
  loadPendingRequests,
  loadPromiseDebt,
  type ParentChildSummary,
  type ParentFamily,
  type ParentRequestRow,
} from '../../../lib/parent/data';
import { AuthGate } from './AuthGate';
import { Onboarding } from './Onboarding';
import { Dashboard } from './Dashboard';
import { RequestsInbox } from './RequestsInbox';
import { SettingsScreen } from './SettingsScreen';
import { InvestmentsScreen } from './InvestmentsScreen';
import { SendMoneyScreen, TakeMoneyScreen } from './SendTakeScreens';

type View = 'dashboard' | 'requests' | 'settings' | 'send' | 'take' | 'investments';

/** Root `/parent` — gerbang sesi Supabase Auth sungguhan, lalu family/children/requests. */
export function ParentApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [family, setFamily] = useState<ParentFamily | null>(null);
  const [children, setChildren] = useState<ParentChildSummary[]>([]);
  const [pending, setPending] = useState<ParentRequestRow[]>([]);
  const [promiseDebt, setPromiseDebt] = useState<ParentRequestRow[]>([]);
  const [view, setView] = useState<View>('dashboard');
  const [targetChild, setTargetChild] = useState<{ id: string; name: string } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    void getParentSession().then(setSession);
    return onParentAuthChange(setSession);
  }, []);

  const refresh = useCallback(async (s: Session) => {
    try {
      const fam = await loadParentFamily(supabaseBrowser(), s.user.id);
      if (!fam) {
        setLoadError('Your account is not linked to a family yet — try signing out and back in.');
        return;
      }
      setFamily(fam);
      const [kids, reqs, debt] = await Promise.all([
        loadChildren(supabaseBrowser(), fam.id),
        loadPendingRequests(supabaseBrowser(), fam.id),
        loadPromiseDebt(supabaseBrowser(), fam.id),
      ]);
      setChildren(kids);
      setPending(reqs);
      setPromiseDebt(debt);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load.');
    }
  }, []);

  useEffect(() => {
    if (session) void refresh(session);
  }, [session, refresh]);

  if (session === undefined) return null;
  if (!session) return <AuthGate onSignedIn={() => void getParentSession().then(setSession)} />;

  if (loadError) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--loss)' }}>{loadError}</div>
      </div>
    );
  }

  if (!family) return null;

  if (children.length === 0 || showOnboarding) {
    return (
      <Onboarding
        session={session}
        onCreated={() => {
          setShowOnboarding(false);
          void refresh(session);
        }}
      />
    );
  }

  if (view === 'requests') {
    return (
      <RequestsInbox
        session={session}
        pending={pending}
        promiseDebt={promiseDebt}
        onBack={() => setView('dashboard')}
        onChanged={() => void refresh(session)}
      />
    );
  }

  if (view === 'settings' && targetChild) {
    return (
      <SettingsScreen
        session={session}
        childId={targetChild.id}
        childName={targetChild.name}
        onBack={() => setView('dashboard')}
      />
    );
  }

  if (view === 'investments' && targetChild) {
    return (
      <InvestmentsScreen
        session={session}
        childId={targetChild.id}
        childName={targetChild.name}
        onBack={() => setView('dashboard')}
      />
    );
  }

  if (view === 'send' && targetChild) {
    return (
      <SendMoneyScreen
        session={session}
        childId={targetChild.id}
        childName={targetChild.name}
        onBack={() => setView('dashboard')}
        onDone={(msg) => {
          setToast(msg);
          setView('dashboard');
          void refresh(session);
        }}
      />
    );
  }

  if (view === 'take' && targetChild) {
    return (
      <TakeMoneyScreen
        session={session}
        childId={targetChild.id}
        childName={targetChild.name}
        onBack={() => setView('dashboard')}
        onDone={(msg) => {
          setToast(msg);
          setView('dashboard');
          void refresh(session);
        }}
      />
    );
  }

  return (
    <>
      <Dashboard
        family={family}
        children={children}
        pendingTotal={pending.length + promiseDebt.length}
        onOpenRequests={() => setView('requests')}
        onAddChild={() => setShowOnboarding(true)}
        onOpenSettings={(id, name) => {
          setTargetChild({ id, name });
          setView('settings');
        }}
        onOpenSend={(id, name) => {
          setTargetChild({ id, name });
          setView('send');
        }}
        onOpenTake={(id, name) => {
          setTargetChild({ id, name });
          setView('take');
        }}
        onOpenInvestments={(id, name) => {
          setTargetChild({ id, name });
          setView('investments');
        }}
      />
      {toast ? (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--ink)',
            color: '#fff',
            padding: '11px 18px',
            borderRadius: '14px',
            fontSize: '12.5px',
            fontWeight: 600,
            maxWidth: '90%',
            textAlign: 'center',
          }}
        >
          {toast}
        </div>
      ) : null}
    </>
  );
}
