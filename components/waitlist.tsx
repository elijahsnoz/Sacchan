'use client';

import { CheckCircle2, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { WAITLIST_ENDPOINT } from '@/lib/site';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function Waitlist() {
  const configured = WAITLIST_ENDPOINT.length > 0;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="sac-panel flex flex-col justify-between gap-6 p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-sac-blue">Launch updates</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Be first when SAC goes live</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Get token launch, airdrop, and campaign news before anyone else. No spam — just the milestones that matter.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">You&apos;re on the list. Welcome to the town.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 focus-within:border-sac-blue/60">
            <Mail className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!configured || status === 'loading'}
              placeholder={configured ? 'you@example.com' : 'Waitlist opening soon'}
              className="w-full bg-transparent py-1 text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={!configured || status === 'loading'}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sac-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
            {configured ? 'Notify me' : 'Opening soon'}
          </button>
          {status === 'error' && (
            <p className="text-xs text-rose-300">Something went wrong. Please try again in a moment.</p>
          )}
        </form>
      )}
    </div>
  );
}
