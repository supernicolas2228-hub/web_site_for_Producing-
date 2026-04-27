"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { site } from "@/config/content";
import { easeFloat, easePremium, fadeUp, staggerSnappy } from "@/lib/motion";

const deployRef =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_DEPLOY_REF?.trim()
    ? process.env.NEXT_PUBLIC_DEPLOY_REF.trim()
    : "";

export function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <footer
      ref={ref}
      className="relative border-t border-stroke/15 py-12 dark:border-white/10"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: easePremium }}
      >
        <motion.span
          className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-transparent via-accent/70 to-transparent"
          animate={
            inView
              ? { x: ["-100%", "220%"] }
              : { x: "-100%" }
          }
          transition={{ duration: 2.8, ease: easeFloat, repeat: Infinity, repeatDelay: 4 }}
        />
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel px-6 py-8 sm:px-8">
        <motion.div
          variants={staggerSnappy}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex flex-col gap-6"
        >
          {site.legalEntity?.trim() ? (
            <motion.p
              variants={fadeUp}
              className="max-w-lg text-xs font-medium leading-relaxed text-zinc-800 dark:text-zinc-200"
            >
              {site.legalEntity.trim()}
            </motion.p>
          ) : null}

          {deployRef ? (
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-medium tabular-nums tracking-wide text-zinc-500 dark:text-zinc-400"
              translate="no"
            >
              Сборка: {deployRef}
            </motion.p>
          ) : null}

          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200"
          >
            {site.copyright}
          </motion.p>
        </motion.div>
        </div>
      </div>
    </footer>
  );
}
