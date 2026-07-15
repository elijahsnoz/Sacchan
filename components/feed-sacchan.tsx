'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SITE_URL } from '@/lib/site';
import { XIcon } from './social-icons';

const STORAGE_KEY = 'sac-feed-count';

// Rank the visitor climbs by feeding Sacchan — pure client-side stickiness.
const TIERS = [
  { at: 0, title: 'Passer-by' },
  { at: 5, title: 'Neighbor' },
  { at: 20, title: 'Regular' },
  { at: 50, title: 'Caretaker' },
  { at: 100, title: 'Local Legend' },
  { at: 500, title: 'Town Hero' }
];

function rankFor(count: number) {
  let current = TIERS[0];
  let next: (typeof TIERS)[number] | null = null;
  for (const tier of TIERS) {
    if (count >= tier.at) current = tier;
    else {
      next = tier;
      break;
    }
  }
  const span = next ? next.at - current.at : 1;
  const progress = next ? Math.min(1, (count - current.at) / span) : 1;
  return { current, next, progress };
}

export function FeedSacchan() {
  const [count, setCount] = useState(0);
  const [pop, setPop] = useState(false);

  // Load the persisted count after mount (initial 0 matches SSR — no hydration jump).
  useEffect(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY) ?? '0');
    if (Number.isFinite(saved) && saved > 0) setCount(saved);
  }, []);

  function feed() {
    setCount((c) => {
      const next = c + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
    setPop(true);
    window.setTimeout(() => setPop(false), 200);
  }

  const { current, next, progress } = rankFor(count);
  const shareText = `I've fed Sacchan ${count} time${count === 1 ? '' : 's'} 🍚 Join the town that feeds Sacchan $SAC`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SITE_URL)}`;

  return (
    <div className="sac-panel flex flex-col justify-between gap-6 p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-sac-gold">Join the ritual</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Feed Sacchan</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          The town fed one dog, one snack at a time. Add yours — every tap counts toward your rank.
        </p>
      </div>

      <div className="flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={feed}
          aria-label="Feed Sacchan"
          className="group relative flex h-40 w-40 items-center justify-center rounded-full border border-sac-gold/30 bg-sac-gold/10 shadow-glow transition active:scale-95"
        >
          <span
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(215,181,109,0.28),transparent_65%)] transition-transform duration-200"
            style={{ transform: pop ? 'scale(1.12)' : 'scale(1)' }}
          />
          <span className="relative h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-black/40">
            <Image src="/logo.JPG" alt="Sacchan" width={96} height={96} className="h-full w-full object-cover" />
          </span>
          <span
            className="pointer-events-none absolute -top-1 text-3xl transition-all duration-200"
            style={{ opacity: pop ? 1 : 0, transform: pop ? 'translateY(-14px)' : 'translateY(0)' }}
            aria-hidden="true"
          >
            🍚
          </span>
        </button>

        <div className="text-center">
          <p className="text-4xl font-semibold text-white tabular-nums">{count.toLocaleString('en-US')}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">meals contributed</p>
        </div>

        <div className="w-full max-w-xs">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
            <span className="text-sac-cream">{current.title}</span>
            <span className="text-slate-500">
              {next ? `${next.at - count} to ${next.title}` : 'Max rank reached'}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sac-gold to-sac-cream transition-all duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-sac-cream px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-white"
      >
        <XIcon className="h-4 w-4" />
        Share your streak on X
      </a>
    </div>
  );
}
