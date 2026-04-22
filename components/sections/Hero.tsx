"use client";

import { motion } from "framer-motion";

import { useEffect, useRef, useState } from "react";

import { hero } from "@/config/content";

import { useStarterPack } from "@/components/starter-pack/StarterPackProvider";

import { HeroMarquee } from "@/components/HeroMarquee";

import { AnchorButton, Button } from "@/components/ui/Button";

import { track } from "@/lib/track";

const titleCls =
  "font-display text-[clamp(1.5rem,4.9vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-950 sm:leading-[1.06] dark:text-zinc-100";

const subtitleCls =
  "mt-3 max-w-lg text-pretty text-[13px] font-medium leading-[1.65] text-zinc-700 sm:mt-4 sm:text-[14px] dark:text-zinc-300";

const hasHeroKicker = hero.kicker.trim().length > 0;

function HeroPortraitPlaceholder() {
  return (
    <div className="relative mx-auto w-full max-w-[26rem] overflow-hidden rounded-[2rem] border border-stroke/18 bg-[linear-gradient(165deg,rgb(var(--surface-rgb)),rgb(var(--band-rgb)/0.85))] p-4 shadow-plate dark:border-white/10 sm:p-5 lg:mx-0">
      <div className="ornate-frame relative flex aspect-[4/5] w-full max-h-[min(72vh,520px)] flex-col items-center justify-center gap-3 rounded-[1.65rem] border border-stroke/12 bg-[rgb(var(--surface-rgb)/0.65)] p-6 text-center dark:border-white/8 dark:bg-black/12 sm:gap-4">
        <p className="font-display text-[15px] font-semibold tracking-[0.06em] text-zinc-800 dark:text-zinc-200 sm:text-base">
          Портрет
        </p>
        <p className="max-w-[14rem] text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          Здесь будет фото — подставьте своё изображение.
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  const [heroClient, setHeroClient] = useState(false);

  useEffect(() => {
    setHeroClient(true);
  }, []);

  const starterPack = useStarterPack();

  const scrollToPricing = () => {
    void track("click_product", { from: "hero_secondary" });

    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  const textEase = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-stroke/15 pt-[8.5rem] pb-14 dark:border-white/10 sm:pt-[9rem] sm:pb-16 lg:pt-[9.5rem] lg:pb-24"
    >
      <div
        className="pointer-events-none absolute inset-0 motion-reduce:animate-none"
        style={{ background: "var(--hero-gradient)" }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 animate-hero-glow motion-reduce:animate-none bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgb(var(--accent-rgb)/0.14),transparent_55%)]"
        style={{ opacity: "var(--pattern-opacity)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
          <motion.div
            className="order-1 w-full lg:justify-self-stretch"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={heroClient ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              delay: 0.02,
            }}
          >
            <HeroPortraitPlaceholder />
          </motion.div>

          <div className="order-2 w-full max-w-[35rem] lg:justify-self-end">
            {hasHeroKicker ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: heroClient ? 1 : 0, y: heroClient ? 0 : 8 }}
                transition={{ duration: 0.35 }}
                className="mb-3 inline-flex items-center gap-3 rounded-full border border-accent/25 bg-white/40 px-4 py-2 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent shadow-plate backdrop-blur-sm dark:bg-white/5 sm:text-[11px]"
              >
                <span aria-hidden className="text-accent">
                  ✦
                </span>

                {hero.kicker}
              </motion.p>
            ) : null}

            <motion.h1
              className={titleCls}
              initial={{ opacity: 0, y: 14 }}
              animate={heroClient ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.55, ease: textEase }}
            >
              {hero.title}
            </motion.h1>

            <motion.p
              className={subtitleCls}
              initial={{ opacity: 0, y: 12 }}
              animate={heroClient ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5, delay: 0.08, ease: textEase }}
            >
              {hero.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={heroClient ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.16, ease: textEase }}
              className="mt-4 max-w-lg rounded-xl border border-accent/25 bg-zinc-950/[0.04] px-4 py-3 text-[13px] font-semibold leading-snug text-zinc-800 backdrop-blur-[2px] dark:border-accent/35 dark:bg-white/[0.06] dark:text-zinc-200"
            >
              {hero.pullQuote}
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={heroClient ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.22, ease: textEase }}
          className="mt-8 lg:mt-11"
        >
          <div className="ornate-frame relative mx-auto flex max-w-[42rem] flex-col items-center gap-4 rounded-[1.75rem] border border-stroke/16 bg-white/40 p-4 text-center shadow-plate backdrop-blur-md dark:border-white/10 dark:bg-white/5 sm:p-5">
            <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <Button
                type="button"
                onClick={() => {
                  void track("click_starter_pack", { from: "hero_primary" });

                  starterPack.open("hero_primary");
                }}
                className="w-full !min-h-[42px] !px-5 !py-2 !text-[11px] sm:w-auto sm:!text-xs"
              >
                {hero.ctaPrimary}
              </Button>

              <AnchorButton
                href="#pricing"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();

                  scrollToPricing();
                }}
                className="w-full !min-h-[42px] !px-5 !py-2 !text-[11px] sm:w-auto sm:!text-xs"
              >
                {hero.ctaSecondary}
              </AnchorButton>
            </div>

            {hero.ctaHint ? (
              <p className="relative max-w-[30rem] text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                {hero.ctaHint}
              </p>
            ) : null}
          </div>
        </motion.div>
      </div>

      <HeroMarquee phrases={hero.marqueePhrases} />
    </section>
  );
}
