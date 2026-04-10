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
      className={`group relative flex min-h-[280px] flex-col overflow-hidden p-6 shadow-[0_24px_56px_-32px_rgb(15_23_39_/_0.35)] dark:shadow-[0_28px_64px_-28px_rgb(0_0_0_/_0.65)] sm:min-h-[300px] sm:p-8 ${
        isEmber
          ? "rounded-[2rem_1rem_2rem_1.25rem] border border-accent/35 bg-gradient-to-br from-white via-white to-red-50/90 ring-1 ring-accent/20 dark:from-zinc-950 dark:via-zinc-950 dark:to-red-950/40 dark:ring-accent/30"
          : "rounded-[1rem_2rem_1.25rem_2rem] border border-stroke/25 bg-gradient-to-bl from-white via-zinc-50/90 to-white ring-1 ring-stroke/15 dark:border-white/15 dark:from-zinc-950 dark:via-zinc-900/95 dark:to-black dark:ring-white/10"
      }`}
    >
      {/* срезанный «луч» по углу */}
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
          isEmber
            ? "bg-accent/25 opacity-80 dark:bg-accent/35"
            : "bg-zinc-400/20 opacity-60 dark:bg-white/10"
        }`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.4] transition-opacity group-hover:opacity-[0.55] dark:opacity-[0.25] dark:group-hover:opacity-[0.4] ${
          isEmber
            ? "bg-[repeating-linear-gradient(-18deg,transparent,transparent_13px,rgb(224_28_28_/_0.04)_13px,rgb(224_28_28_/_0.04)_14px)]"
            : "bg-[repeating-linear-gradient(18deg,transparent,transparent_14px,rgb(9_9_11_/_0.03)_14px,rgb(9_9_11_/_0.03)_15px)] dark:bg-[repeating-linear-gradient(18deg,transparent,transparent_14px,rgb(255_255_255_/_0.02)_14px,rgb(255_255_255_/_0.02)_15px)]"
        }`}
        aria-hidden
      />
      <span
        className={`pointer-events-none absolute bottom-4 right-5 font-display text-[clamp(4rem,14vw,7rem)] font-black leading-none tracking-tighter select-none ${
          isEmber
            ? "text-accent/[0.07] transition-colors group-hover:text-accent/[0.14] dark:text-accent/[0.12] dark:group-hover:text-accent/[0.2]"
            : "text-zinc-900/[0.04] transition-colors group-hover:text-zinc-900/[0.08] dark:text-white/[0.06] dark:group-hover:text-white/[0.11]"
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

  const toProduct = (from: string) => {
    void track("click_product", { from });
    document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="two-paths"
      ref={ref}
      className="relative isolate overflow-hidden border-b border-stroke/15 py-16 sm:py-20 lg:py-28 dark:border-white/10"
    >
      {/* фон: сетка + акцентное пятно */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-band/88 dark:bg-band/52"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent_0%,rgb(224_28_28_/_0.06)_48%,transparent_100%)] opacity-70 dark:opacity-50"
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
      <p
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[min(42vw,520px)] font-black uppercase leading-none tracking-tighter text-zinc-900/[0.035] dark:text-white/[0.04]"
        aria-hidden
      >
        вход
      </p>

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
            className="mt-5 max-w-3xl font-display text-[clamp(1.9rem,4.6vw,3.5rem)] uppercase leading-[1.06] tracking-tight text-zinc-900 dark:text-white"
            start={inView}
            speedMs={9}
            onComplete={() => setHeadDone(true)}
          />
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-white">
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
                <span className="font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-white">
                  {twoPaths.starter.laneHint}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl uppercase leading-snug tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                {twoPaths.starter.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-white">
                {twoPaths.starter.text}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 border-t border-accent/15 pt-5 dark:border-white/10">
                {twoPaths.starter.perks.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/[0.07] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-800 dark:border-accent/30 dark:bg-accent/15 dark:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
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
                <span className="rounded-md border-2 border-zinc-900/85 px-2.5 py-1 font-display text-[9px] font-bold uppercase tracking-[0.24em] text-zinc-900 dark:border-white/65 dark:text-white">
                  {twoPaths.product.lane}
                </span>
                <span className="font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-white">
                  {twoPaths.product.laneHint}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl uppercase leading-snug tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                {twoPaths.product.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-white">
                {twoPaths.product.text}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 border-t border-stroke/20 pt-5 dark:border-white/10">
                {twoPaths.product.perks.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-1.5 rounded-full border border-stroke/15 bg-white/75 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:border-white/12 dark:bg-black/40 dark:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-zinc-400 dark:bg-white/50" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <AnchorButton
                href="#product"
                variant="secondary"
                className="mt-8 w-full !justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  toProduct("two_paths_product");
                }}
              >
                {twoPaths.product.cta}
              </AnchorButton>
            </PathCard>
          </div>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-12 max-w-md text-center text-xs leading-relaxed text-zinc-500 dark:text-white"
          >
            {twoPaths.footerNote}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
