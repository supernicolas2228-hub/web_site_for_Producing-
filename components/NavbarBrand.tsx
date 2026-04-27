"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/content";
import { spring } from "@/lib/motion";

type Props = {
  mounted: boolean;
};

export function NavbarBrand({ mounted }: Props) {
  const reduceMotion = useReducedMotion();
  const raw = site.nameEn.trim() || "Kirill Sanchaev";
  const chars = Array.from(raw);

  return (
    <motion.a
      href="/"
      lang="en"
      translate="no"
      className="group relative min-w-0 shrink-0 select-none overflow-hidden rounded-lg py-1 pr-1"
      aria-label={site.metaTitle}
      initial={reduceMotion ? false : { opacity: 0, x: -14 }}
      animate={mounted ? { opacity: 1, x: 0 } : {}}
      transition={spring.navDrawer}
      whileHover={reduceMotion ? {} : { scale: 1.02 }}
      whileTap={reduceMotion ? {} : { scale: 0.98 }}
    >
      <span className="relative z-[1] block font-display text-[0.8125rem] font-semibold leading-tight tracking-[0.06em] sm:text-sm">
        {reduceMotion ? (
          <span className="text-zinc-900 dark:text-zinc-100">{raw}</span>
        ) : (
          <span className="relative inline-flex flex-wrap">
            {chars.map((ch, i) => (
              <motion.span
                key={`${i}-${ch}`}
                className={
                  ch === " "
                    ? "inline w-[0.3em] shrink-0"
                    : "inline-block text-zinc-900 dark:text-zinc-100"
                }
                initial={{ opacity: 0, y: 16, filter: "blur(8px)", rotateX: -50 }}
                animate={
                  mounted
                    ? { opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }
                    : { opacity: 0, y: 16, filter: "blur(8px)", rotateX: -50 }
                }
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                  mass: 0.52,
                  delay: i * 0.042,
                }}
                style={{ transformOrigin: "50% 100%" }}
              >
                {ch === " " ? "\u00a0" : ch}
              </motion.span>
            ))}
          </span>
        )}

        {!reduceMotion ? (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 top-0 -z-[1] rounded-md bg-gradient-to-r from-accent/0 via-accent/14 to-accent/0 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 dark:via-emerald-400/22"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[42%] bg-gradient-to-r from-white/0 via-white/35 to-white/0 opacity-0 group-hover:animate-nav-brand-sweep dark:via-white/20"
            />
          </>
        ) : null}
      </span>

      {!reduceMotion ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -bottom-0.5 left-0 h-[2px] w-full max-w-full origin-left rounded-full bg-gradient-to-r from-accent via-accent/55 to-transparent dark:from-emerald-300 dark:via-emerald-400/60 dark:to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={mounted ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 128, damping: 22, delay: 0.38 }}
        />
      ) : null}
    </motion.a>
  );
}
