"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { forWho } from "@/config/content";
import { PunchlineMarquee } from "@/components/PunchlineMarquee";
import { SectionHeading } from "@/components/SectionHeading";
import { fadeUp, sectionEnter, springHover, staggerContainer } from "@/lib/motion";

export function ForWho() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [headDone, setHeadDone] = useState(false);

  return (
    <motion.section
      id="for-who"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={sectionEnter}
      className="scroll-mt-24 border-b border-stroke/15 py-14 dark:border-white/10 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel px-6 py-8 sm:px-8 sm:py-10">
        {forWho.eyebrow.trim() ? (
          <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-accent sm:text-xs">
            {forWho.eyebrow}
          </p>
        ) : null}
        <SectionHeading
          inView={inView}
          className="font-display text-[clamp(1.5rem,3.4vw,2.15rem)] font-semibold uppercase leading-[1.08] tracking-tight text-zinc-900 dark:text-zinc-100"
          onAnimationComplete={() => setHeadDone(true)}
        >
          {forWho.title}
        </SectionHeading>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
          className="mt-6 space-y-3.5"
        >
          {forWho.items.map((item) => (
            <motion.li
              key={item.text}
              variants={fadeUp}
              whileHover={{ x: 5, transition: springHover }}
              className="flex gap-3.5 rounded-2xl border border-stroke/14 bg-white/50 py-3 pl-3 pr-4 shadow-sm backdrop-blur-sm transition-colors hover:border-accent/35 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-accent/40"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-lg shadow-inner dark:bg-accent/15"
                aria-hidden
              >
                {item.icon}
              </span>
              <p className="min-w-0 pt-0.5 text-[15px] font-medium leading-snug text-zinc-900 dark:text-zinc-100">
                {item.text}
              </p>
            </motion.li>
          ))}
        </motion.ul>
        </div>
      </div>

      {forWho.punchline.trim() ? (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
          className="mx-auto mt-8 w-full max-w-2xl px-4 sm:px-6 lg:px-8"
        >
          <div className="glass-panel overflow-hidden p-0">
            <PunchlineMarquee text={forWho.punchline} className="rounded-[1.85rem] border-0" />
          </div>
        </motion.div>
      ) : null}
    </motion.section>
  );
}
