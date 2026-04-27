"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { about } from "@/config/content";
import { easePremium, sectionEnter, staggerContainer } from "@/lib/motion";

const textEase = [0.22, 1, 0.36, 1] as const;

/** Анимации текста: только смещение и прозрачность — без наклона и scale, «ровный» кегль */
const aboutLine = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay: 0.05 + i * 0.1, ease: textEase },
  }),
};

const aboutBlock = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: textEase },
  },
};

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const [headDone, setHeadDone] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (inView && reduceMotion) setHeadDone(true);
  }, [inView, reduceMotion]);

  return (
    <motion.section
      id="about"
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
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
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: easePremium }}
            className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
          >
            <div className="group about-photo-frame relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] border-2 border-emerald-500/55 bg-zinc-900/20 shadow-[0_0_0_1px_rgb(16_185_129/0.2),0_0_48px_-8px_rgb(52_211_153/0.3),0_24px_64px_-24px_rgb(4_120_72/0.4)] transition-shadow duration-500 dark:border-emerald-400/50 dark:shadow-[0_0_0_1px_rgb(52_211_153/0.2),0_0_56px_-10px_rgb(52_211_153/0.2),0_28px_72px_-22px_rgb(0_0_0/0.8)] lg:group-hover:shadow-[0_0_0_1px_rgb(52_211_153/0.3),0_0_64px_-6px_rgb(52_211_153/0.25)]">
              <div
                className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-zinc-950/50 via-transparent to-zinc-950/10"
                aria-hidden
              />
              <Image
                src={about.portraitSrc}
                alt={about.portraitAlt}
                fill
                className={about.portraitCoverClass}
                sizes="(max-width: 1024px) 90vw, 400px"
                loading="lazy"
              />
            </div>
            <motion.div
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              variants={{
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                hidden: {},
              }}
              className="mt-4 grid grid-cols-3 gap-2 sm:gap-3"
            >
              {about.stats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: textEase } },
                  }}
                  className="rounded-2xl border border-emerald-800/20 bg-white/55 px-2 py-3 text-center shadow-sm backdrop-blur-sm dark:border-emerald-400/15 dark:bg-white/[0.07]"
                >
                  <p className="font-display text-lg font-bold tabular-nums text-emerald-800 dark:text-emerald-300 sm:text-xl">
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-[10px] font-medium leading-snug text-zinc-700 dark:text-zinc-300 sm:text-[11px]">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="mt-8 min-w-0 text-left lg:mt-0">
            {about.eyebrow.trim() ? (
              <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                {about.eyebrow}
              </p>
            ) : null}

            <div className="min-w-0 max-w-2xl">
              <motion.h2
                translate="no"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, ease: textEase }}
                onAnimationComplete={() => setHeadDone(true)}
                className="font-display text-2xl font-semibold leading-snug tracking-[-0.02em] text-balance text-zinc-900 sm:text-[1.65rem] sm:leading-tight md:text-3xl dark:text-zinc-50"
              >
                {about.title}
              </motion.h2>
              <motion.div
                className="mt-3 h-0.5 max-w-[12rem] rounded-full bg-gradient-to-r from-emerald-600/80 via-emerald-500/60 to-transparent dark:from-emerald-400/80 dark:via-emerald-400/50"
                initial={reduceMotion ? false : { scaleX: 0, originX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: textEase }}
                aria-hidden
              />

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.12, ease: textEase }}
                className="mt-4 text-[16px] font-normal leading-[1.65] text-pretty text-zinc-800 antialiased sm:text-[17px] sm:leading-[1.7] dark:text-zinc-200"
              >
                {about.subtitle}
              </motion.p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={inView && headDone ? "show" : "hidden"}
              className="mt-8 max-w-2xl space-y-4 text-pretty"
            >
              {about.intro.map((p, i) => (
                <motion.p
                  key={i}
                  variants={aboutLine}
                  custom={i}
                  className="text-[16px] font-normal leading-[1.7] text-zinc-800 antialiased sm:text-[17px] sm:leading-[1.75] dark:text-zinc-200"
                >
                  {p}
                </motion.p>
              ))}

              <motion.div
                variants={aboutBlock}
                className="relative overflow-hidden rounded-2xl border border-emerald-800/15 bg-gradient-to-br from-emerald-50/95 via-white/90 to-zinc-50/90 px-5 py-4 dark:border-emerald-400/20 dark:from-emerald-950/55 dark:via-[rgb(var(--surface-rgb)/0.92)] dark:to-zinc-950/80"
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-400/15 blur-2xl dark:bg-emerald-400/10"
                  aria-hidden
                />
                <p className="relative flex gap-3 text-[16px] font-normal leading-[1.65] text-emerald-950 antialiased sm:leading-[1.7] dark:text-emerald-50/95">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white shadow-sm dark:bg-emerald-500">
                    ✓
                  </span>
                  <span className="min-w-0 text-pretty">{about.trustLine}</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
