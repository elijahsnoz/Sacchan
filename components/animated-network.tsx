"use client";

import { motion } from 'framer-motion';

const nodes = [
  { x: '12%', y: '16%', delay: 0.2 },
  { x: '24%', y: '62%', delay: 0.6 },
  { x: '38%', y: '24%', delay: 1 },
  { x: '58%', y: '14%', delay: 0.4 },
  { x: '70%', y: '44%', delay: 0.8 },
  { x: '84%', y: '22%', delay: 1.2 },
  { x: '82%', y: '72%', delay: 1.4 },
  { x: '56%', y: '78%', delay: 1.1 }
];

export function AnimatedNetwork() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-sac-grid opacity-[0.12]" />
      <svg viewBox="0 0 1000 700" className="absolute inset-0 h-full w-full opacity-70">
        <defs>
          <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#63a7ff" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#d7b56d" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f5ead7" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <motion.path d="M80 120 C220 40, 310 110, 430 130 S670 170, 840 90" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="10 12" animate={{ pathLength: [0.25, 1, 0.25] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.path d="M120 520 C250 410, 350 520, 490 470 S750 360, 900 480" fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="8 14" animate={{ pathLength: [0.2, 1, 0.2] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.circle cx="500" cy="350" r="126" fill="rgba(8, 17, 31, 0.25)" stroke="rgba(215, 181, 109, 0.28)" strokeWidth="1.5" animate={{ scale: [1, 1.04, 1], opacity: [0.75, 1, 0.75] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      </svg>

      {nodes.map((node) => (
        <motion.span
          key={`${node.x}-${node.y}`}
          className="absolute h-3 w-3 rounded-full bg-sac-gold shadow-[0_0_30px_rgba(215,181,109,0.75)]"
          style={{ left: node.x, top: node.y }}
          animate={{ scale: [1, 1.65, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 4.5, delay: node.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div className="absolute left-1/2 top-1/2 flex h-56 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sac-gold/35 bg-[#0a1220]/90 shadow-glow" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="absolute inset-4 rounded-full border border-white/8 bg-[radial-gradient(circle_at_top,#1c2f4c,#090f1c_72%)]" />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-sac-cream/25 bg-gradient-to-br from-sac-cream/20 via-sac-gold/15 to-sac-blue/15 text-center text-4xl font-black tracking-[0.2em] text-sac-cream">SAC</div>
      </motion.div>
    </div>
  );
}
