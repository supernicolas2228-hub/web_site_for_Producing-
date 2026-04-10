"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { reviews } from "@/config/content";
import { links } from "@/config/links";
import { Card } from "@/components/ui/Card";
import { AnchorButton } from "@/components/ui/Button";
import { TypewriterText } from "@/components/TypewriterText";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { outboundAnchorProps } from "@/lib/outbound-link";

const reviewsTitleCls =
  "font-display text-[clamp(1.75rem,4vw,3.25rem)] uppercase leading-tight tracking-tight text-zinc-900 dark:text-white";

export function Reviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [headDone, setHeadDone] = useState(false);

  return (
    <section
      id="reviews"
      ref={ref}
      className="scroll-mt-24 border-b border-stroke/15 bg-band/55 py-16 backdrop-blur-xl dark:border-white/10 dark:bg-band/35 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
          {reviews.eyebrow}
        </p>
        <TypewriterText
          as="h2"
          text={reviews.title}
          className={reviewsTitleCls}
          start={inView}
          speedMs={10}
          onComplete={() => setHeadDone(true)}
        />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView && headDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35 }}
          className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-white"
        >
          {reviews.lead}
        </motion.p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
        >
          <motion.div
            variants={fadeUp}
            className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {reviews.items.map((r, idx) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 16 }}
                animate={inView && headDone ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.06 * idx, type: "spring", stiffness: 120, damping: 22 }}
              >
                <Card className="flex h-full flex-col" hover>
                  <div
                    className="relative mb-4 flex aspect-[5/3] w-full flex-col justify-between overflow-hidden rounded-lg border border-stroke/20 bg-gradient-to-br from-white via-surface-muted/60 to-red-50/40 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.65)] backdrop-blur-xl dark:border-white/18 dark:from-black/65 dark:via-black/45 dark:to-red-950/25"
                    aria-label={`${r.name} — ${r.result}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-stroke/15 bg-white/90 font-display text-sm font-bold uppercase text-zinc-800 shadow-sm dark:border-white/15 dark:bg-black/55 dark:text-white"
                        aria-hidden
                      >
                        {r.name.slice(0, 1)}
                      </div>
                      <span className="rounded-full bg-zinc-900/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 dark:bg-white/10 dark:text-white">
                        срок: {r.timeframe}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-white">
                        {r.niche}
                      </p>
                      <p className="mt-1 font-display text-[clamp(1.2rem,3.5vw,1.75rem)] uppercase leading-[1.05] tracking-tight text-zinc-900 dark:text-white">
                        {r.result}
                      </p>
                    </div>
                  </div>
                  <p className="font-display text-lg uppercase text-zinc-900 dark:text-white">{r.name}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-white">{r.quote}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="mt-10 flex justify-center">
            <AnchorButton
              {...outboundAnchorProps(links.telegramReviews)}
              variant="secondary"
            >
              {reviews.ctaAll}
            </AnchorButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
