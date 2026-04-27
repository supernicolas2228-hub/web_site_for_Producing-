"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";

type Props = {
  phrases: readonly string[];
};

const rowCls =
  "whitespace-nowrap font-body font-bold uppercase tracking-[0.16em] text-zinc-950 [text-shadow:0_0_1px_rgb(255_255_255/0.95),0_1px_2px_rgb(255_255_255/0.9),0_0_14px_rgb(255_255_255/0.55)] dark:text-zinc-50 dark:[text-shadow:0_2px_10px_rgb(0_0_0/0.85),0_0_2px_rgb(0_0_0/0.9)]";

export function HeroMarquee({ phrases }: Props) {
  if (!phrases.length) return null;

  const looped = [...phrases, ...phrases];

  return (
    <motion.div
      className="glass-panel mt-10 border-y border-stroke/15 !rounded-none px-0 py-0 dark:border-white/10 sm:mt-14"
      aria-hidden
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.marquee}
    >
      <div className="motion-reduce:flex hidden flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3.5 text-center sm:gap-x-8">
        {phrases.map((p) => (
          <span key={p} className={`${rowCls} text-[11px] sm:text-xs`}>
            {p}
          </span>
        ))}
      </div>

      <div className="motion-reduce:hidden relative overflow-hidden py-3">
        <div className="flex w-max animate-marquee-slow motion-reduce:animate-none">
          {looped.map((p, i) => (
            <span key={`${p}-a-${i}`} className={`${rowCls} mx-6 shrink-0 text-[11px] sm:mx-10 sm:text-xs`}>
              {p}
            </span>
          ))}
        </div>
        <div className="flex w-max animate-marquee-slow-reverse motion-reduce:animate-none">
          {looped.map((p, i) => (
            <span
              key={`${p}-b-${i}`}
              className={`${rowCls} mx-8 shrink-0 text-[10px] sm:mx-12 sm:text-[11px] md:text-xs`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
