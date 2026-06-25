"use client";

import { motion } from 'framer-motion';
import { storyEvents } from '@/lib/content';

export function StoryTimeline() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {storyEvents.map((event, index) => (
        <motion.article key={event.title} className="sac-panel p-6" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: index * 0.08 }}>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-sac-gold/20 bg-sac-gold/10 text-lg font-bold text-sac-gold">0{index + 1}</div>
          <h3 className="mb-3 text-xl font-semibold text-white">{event.title}</h3>
          <p className="text-sm leading-7 text-slate-300">{event.text}</p>
        </motion.article>
      ))}
    </div>
  );
}
