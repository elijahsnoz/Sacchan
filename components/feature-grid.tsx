"use client";

import { motion } from 'framer-motion';
import { utilityItems } from '@/lib/content';

export function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {utilityItems.map((item, index) => (
        <motion.div key={item} className="sac-panel flex items-center gap-4 p-5" initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.05 }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sac-blue/25 bg-sac-blue/10 text-sac-cream">✦</div>
          <span className="text-base font-medium text-white">{item}</span>
        </motion.div>
      ))}
    </div>
  );
}
