"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { about } from "@/config/content";
import { TypewriterText } from "@/components/TypewriterText";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [headDone, setHeadDone] = useState(false);

  return (
    <motion.section
      id="about"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24 border-b border-stroke/15 bg-band/35 py-14 backdrop-blur-xl dark:border-white/10 dark:bg-band/22 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {about.eyebrow.trim() ? (
          <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-accent sm:text-xs">
            {about.eyebrow}
          </p>
        ) : null}

        <TypewriterText
          as="h2"
          text={about.title}
          className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold uppercase leading-[1.08] tracking-tight text-zinc-900 dark:text-zinc-100"
          start={inView}
          speedMs={12}
          onComplete={() => setHeadDone(true)}
        />

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="mt-3 text-[15px] font-medium leading-relaxed text-zinc-700 dark:text-zinc-300"
        >
          {about.subtitle}
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
          className="mt-8 space-y-4"
        >
          {about.intro.map((p, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className="text-[15px] leading-[1.75] text-zinc-700 dark:text-zinc-300"
            >
              {p}
            </motion.p>
          ))}

          <motion.p
            variants={fadeUp}
            className="rounded-2xl border border-accent/25 bg-accent/[0.12] px-4 py-4 text-[15px] font-medium leading-relaxed text-zinc-900 backdrop-blur-sm dark:border-accent/30 dark:bg-accent/[0.14] dark:text-zinc-100"
          >
            {about.trustLine}
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}
