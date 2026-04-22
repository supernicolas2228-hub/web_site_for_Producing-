"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { twoPaths } from "@/config/content";
import { useStarterPack } from "@/components/starter-pack/StarterPackProvider";
import { AnchorButton, Button } from "@/components/ui/Button";
import { TypewriterText } from "@/components/TypewriterText";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { track } from "@/lib/track";

/** Графика «развилка» — фирменный якорь блока */
function ForkGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M160 100 V52"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-accent/90"
      />
      <path
        d="M160 52 L56 12"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        className="text-accent/75"
      />
      <path
        d="M160 52 L264 12"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        className="text-accent/75"
      />
      <circle cx="160" cy="52" r="5" className="fill-accent" />
      <circle cx="56" cy="12" r="4" className="fill-accent/50" />
      <circle cx="264" cy="12" r="4" className="fill-accent/50" />
    </svg>
  );
}

function PathCard({
  variant,
  index,
  children,
}: {
  variant: "ember" | "slate";
  index: "01" | "02";
  children: ReactNode;
}) {
  const isEmber = variant === "ember";
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 380, damping: 26 } }}
      className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl p-6 shadow-plate sm:min-h-[280px] sm:p-7 ${
        isEmber
          ? "border border-accent/30 bg-white/80 dark:border-accent/25 dark:bg-[rgb(var(--surface-rgb)/0.92)]"
          : "border border-stroke/20 bg-white/70 dark:border-white/10 dark:bg-[rgb(var(--surface-rgb)/0.88)]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
          isEmber ? "bg-accent/20 opacity-70 dark:bg-accent/25" : "bg-zinc-400/10 opacity-50 dark:bg-white/5"
        }`}
        aria-hidden
      />
      <span
        className={`pointer-events-none absolute bottom-4 right-5 font-display text-[clamp(4rem,14vw,7rem)] font-black leading-none tracking-tighter select-none ${
          isEmber
          ? "text-accent/[0.08] transition-colors group-hover:text-accent/[0.16] dark:text-accent/[0.12] dark:group-hover:text-accent/[0.2]"
          : "text-zinc-900/[0.04] transition-colors group-hover:text-zinc-900/[0.08] dark:text-white/[0.05] dark:group-hover:text-white/[0.09]"
        }`}
        aria-hidden
      >
        {index}
      </span>
      <div className="relative flex flex-1 flex-col">{children}</div>
    </motion.article>
  );
}

export function TwoPaths() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [headDone, setHeadDone] = useState(false);

  const starterPack = useStarterPack();

  const toPricing = (from: string) => {
    void track("click_product", { from });
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      id="two-paths"
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate overflow-hidden border-b border-stroke/15 py-14 sm:py-16 lg:py-20 dark:border-white/10"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-band/68 dark:bg-band/36"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent_0%,rgb(var(--accent-rgb)/0.08)_48%,transparent_100%)] opacity-70 dark:opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage: `linear-gradient(rgb(var(--stroke-rgb) / 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgb(var(--stroke-rgb) / 0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex w-full max-w-2xl items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/50 to-accent/80 dark:via-accent/40" />
            <p className="shrink-0 font-display text-[10px] font-bold uppercase tracking-[0.42em] text-accent">
              {twoPaths.eyebrow}
            </p>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-accent/50 to-accent/80 dark:via-accent/40" />
          </div>
          <TypewriterText
            as="h2"
            text={twoPaths.title}
            className="mt-5 max-w-4xl font-display text-[clamp(1.9rem,4.6vw,3.5rem)] uppercase leading-[1.03] tracking-tight text-zinc-900 dark:text-zinc-100"
            start={inView}
            speedMs={9}
            onComplete={() => setHeadDone(true)}
          />
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
            {twoPaths.lead}
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView && headDone ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.15 }}
            className="mt-8 w-full max-w-xs text-accent md:mt-10"
          >
            <ForkGlyph className="mx-auto w-full" />
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
          className="relative mt-10 md:mt-12"
        >
          {/* разделитель «или» — только desktop, между колонками */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-28 w-14 -translate-x-1/2 -translate-y-1/2 md:flex md:flex-col md:items-center md:justify-center"
            aria-hidden
          >
            <span className="h-full w-px bg-gradient-to-b from-transparent via-accent/45 to-transparent dark:via-accent/35" />
            <span className="absolute rounded-full border border-accent/40 bg-white/95 px-2.5 py-1 font-display text-[9px] font-bold uppercase tracking-[0.28em] text-accent shadow-plate backdrop-blur-sm dark:border-accent/50 dark:bg-black/80 dark:text-accent">
              или
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:gap-6 lg:gap-8">
            <PathCard variant="ember" index="01">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-accent px-2.5 py-1 font-display text-[9px] font-bold uppercase tracking-[0.24em] text-white shadow-md shadow-accent/25">
                  {twoPaths.starter.lane}
                </span>
                <span className="font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  {twoPaths.starter.laneHint}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl uppercase leading-snug tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
                {twoPaths.starter.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-300">
                {twoPaths.starter.text}
              </p>
              <Button
                type="button"
                className="mt-8 w-full !justify-center"
                onClick={() => {
                  void track("click_starter_pack", { from: "two_paths_starter" });
                  starterPack.open("two_paths_starter");
                }}
              >
                {twoPaths.starter.cta}
              </Button>
            </PathCard>

            <PathCard variant="slate" index="02">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-zinc-900/85 px-2.5 py-1 font-display text-[9px] font-bold uppercase tracking-[0.24em] text-zinc-900 dark:border-white/32 dark:text-zinc-100">
                  {twoPaths.product.lane}
                </span>
                <span className="font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  {twoPaths.product.laneHint}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl uppercase leading-snug tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
                {twoPaths.product.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-300">
                {twoPaths.product.text}
              </p>
              <AnchorButton
                href="#pricing"
                variant="secondary"
                className="mt-8 w-full !justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  toPricing("two_paths_product");
                }}
              >
                {twoPaths.product.cta}
              </AnchorButton>
            </PathCard>
          </div>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-12 max-w-md text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-500"
          >
            {twoPaths.footerNote}
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}
