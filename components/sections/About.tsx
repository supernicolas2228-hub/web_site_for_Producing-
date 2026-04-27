"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { about, hero } from "@/config/content";
import { SectionHeading } from "@/components/SectionHeading";
import { easePremium, fadeUp, sectionEnter, staggerContainer } from "@/lib/motion";

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
      transition={sectionEnter}
      className="relative scroll-mt-24 overflow-hidden border-b border-stroke/15 py-14 dark:border-white/10 sm:py-16 lg:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 20% 0%, rgb(var(--accent-rgb) / 0.35), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgb(var(--stroke-rgb) / 0.2), transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel px-6 py-8 sm:px-8 sm:py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-10 lg:py-12">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: easePremium }}
            className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] border-2 border-emerald-600/50 bg-zinc-900/20 shadow-[0_0_40px_-12px_rgb(52_211_153/0.35),0_20px_60px_-24px_rgb(4_120_72/0.35)] dark:border-emerald-400/40 dark:shadow-[0_0_48px_-10px_rgb(52_211_153/0.25),0_24px_64px_-20px_rgb(0_0_0/0.75)]">
              <Image
                src={hero.portraitSrc}
                alt={hero.portraitAlt}
                fill
                className="object-cover object-[center_22%]"
                sizes="(max-width: 1024px) 90vw, 400px"
                loading="lazy"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {about.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-emerald-800/20 bg-white/55 px-2 py-3 text-center shadow-sm backdrop-blur-sm dark:border-emerald-400/15 dark:bg-white/[0.07]"
                >
                  <p className="font-display text-lg font-bold tabular-nums text-emerald-800 dark:text-emerald-300 sm:text-xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[9px] font-semibold uppercase leading-tight tracking-[0.06em] text-zinc-700 dark:text-zinc-300 sm:text-[10px]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mt-8 min-w-0 lg:mt-0">
            {about.eyebrow.trim() ? (
              <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-accent sm:text-xs">
                {about.eyebrow}
              </p>
            ) : null}

            <SectionHeading
              inView={inView}
              className="relative font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold uppercase leading-[1.08] tracking-tight text-zinc-900 dark:text-zinc-100"
              onAnimationComplete={() => setHeadDone(true)}
            >
              {about.title}
            </SectionHeading>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.42, delay: 0.08, ease: easePremium }}
              className="mt-3 text-[15px] font-medium leading-relaxed text-zinc-900 dark:text-zinc-100"
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
                  className="text-[15px] leading-[1.75] text-zinc-900 dark:text-zinc-100"
                >
                  {p}
                </motion.p>
              ))}

              <motion.div
                variants={fadeUp}
                className="relative overflow-hidden rounded-2xl border border-emerald-800/15 bg-gradient-to-br from-emerald-50/95 via-white/90 to-zinc-50/90 px-5 py-4 dark:border-emerald-400/20 dark:from-emerald-950/55 dark:via-[rgb(var(--surface-rgb)/0.92)] dark:to-zinc-950/80"
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-400/15 blur-2xl dark:bg-emerald-400/10"
                  aria-hidden
                />
                <p className="relative flex gap-3 text-[15px] font-medium leading-relaxed text-emerald-950 dark:text-emerald-50/95">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white shadow-sm dark:bg-emerald-500">
                    ✓
                  </span>
                  <span className="min-w-0">{about.trustLine}</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
