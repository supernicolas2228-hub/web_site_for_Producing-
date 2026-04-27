"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { whatIGive } from "@/config/content";
import { SectionHeading } from "@/components/SectionHeading";
import { fadeUp, sectionEnter, staggerContainer } from "@/lib/motion";

export function WhatIGive() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [done, setDone] = useState(false);
  return (
    <motion.section
      id="what-i-give"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={sectionEnter}
      className="scroll-mt-24 border-b border-stroke/15 py-14 dark:border-white/10 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel px-6 py-8 sm:px-8 sm:py-10">
        {whatIGive.eyebrow.trim() ? (
          <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-accent sm:text-xs">
            {whatIGive.eyebrow}
          </p>
        ) : null}
        <SectionHeading
          inView={inView}
          className="font-display text-[clamp(1.5rem,3.4vw,2.15rem)] font-semibold uppercase leading-[1.08] tracking-tight text-zinc-900 dark:text-zinc-100"
          onAnimationComplete={() => setDone(true)}
        >
          {whatIGive.title}
        </SectionHeading>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.06 }}
          className="mt-4 text-[15px] font-medium leading-relaxed text-zinc-900 dark:text-zinc-100"
        >
          {whatIGive.intro}
        </motion.p>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate={inView && done ? "show" : "hidden"}
          className="mt-8 space-y-3"
        >
          {whatIGive.items.map((item) => (
            <motion.li
              key={item}
              variants={fadeUp}
              className="flex gap-3 rounded-xl border border-stroke/15 bg-white/40 px-4 py-3 text-[15px] font-medium leading-snug text-zinc-900 shadow-plate backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              {item}
            </motion.li>
          ))}
        </motion.ul>
        </div>
      </div>
    </motion.section>
  );
}
