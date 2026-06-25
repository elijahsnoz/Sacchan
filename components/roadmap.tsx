"use client";

import { motion } from 'framer-motion';
import { roadmapItems } from '@/lib/content';

export function Roadmap() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
      {roadmapItems.map((item, index) => (
        <motion.article key={item.title} className="sac-panel p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.06 }}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-sac-gold">{item.phase}</p>
          <h3 className="mb-3 text-xl font-semibold text-white">{item.title}</h3>
          <p className="text-sm leading-7 text-slate-300">{item.text}</p>
        </motion.article>
      ))}
    </div>
  );
}
