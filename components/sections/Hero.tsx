"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { hero } from "@/config/content";
import { useStarterPack } from "@/components/starter-pack/StarterPackProvider";
import { HeroMarquee } from "@/components/HeroMarquee";
import { TypewriterText } from "@/components/TypewriterText";
import { AnchorButton, Button } from "@/components/ui/Button";
import { track } from "@/lib/track";

const titleCls =
  "font-display text-[clamp(1.35rem,3.8vw,2.65rem)] uppercase leading-[1.14] tracking-[0.02em] text-zinc-950 sm:leading-[1.08] lg:leading-[1.02] [text-shadow:0_1px_0_rgb(255_255_255/0.85),0_0_24px_rgb(255_255_255/0.35)] dark:text-white dark:[text-shadow:0_2px_24px_rgb(0_0_0/0.45)] dark:drop-shadow-[0_0_28px_rgba(255,255,255,0.08)]";
const subtitleCls =
  "mt-6 max-w-xl text-pretty text-base font-medium leading-[1.7] text-zinc-700 sm:text-lg dark:text-white lg:max-w-none";

const hasHeroSubtitle = hero.subtitle.trim().length > 0;

const HERO_IMG_SRC = "/images/hero-main.png?v=1";

function HeroPhotoCard() {
  return (
    <>
      {/* Обычный img: стабильно в standalone и на телефоне, без сюрпризов от оптимизатора */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMG_SRC}
        alt="Sell is Life — настроение пути: движение и пространство для роста"
        width={960}
        height={960}
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-center scale-[1.03] [filter:brightness(1.14)_contrast(1.06)_saturate(1.09)] dark:[filter:brightness(1.16)_contrast(1.07)_saturate(1.1)]"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--hero-photo-bottom)" }}
      />
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [heroClient, setHeroClient] = useState(false);
  const [titleDone, setTitleDone] = useState(false);
  const [subtitleDone, setSubtitleDone] = useState(!hasHeroSubtitle);

  useEffect(() => {
    setHeroClient(true);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 56]);

  const starterPack = useStarterPack();

  const scrollToProduct = () => {
    void track("click_product", { from: "hero_secondary" });
    document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-stroke/15 pt-28 pb-16 dark:border-white/10 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--hero-gradient)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Cpath d=%22M0 48h48v1H0zM48 0v48h-1V0z%22 fill=%22%2364748b%22 fill-opacity=%22.22%22/%3E%3C/svg%3E')]"
        style={{ opacity: "var(--pattern-opacity)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y }}
          className="mb-8 flex justify-center lg:mb-0 lg:hidden"
        >
          <motion.div
            className="relative aspect-square w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-stroke/20 bg-white/85 shadow-plate backdrop-blur-xl dark:border-white/20 dark:bg-black/50 sm:max-w-[320px]"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.12 }}
          >
            <HeroPhotoCard />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: heroClient ? 1 : 0, y: heroClient ? 0 : 8 }}
          transition={{ duration: 0.35 }}
          className="mb-2.5 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-accent [text-shadow:0_1px_0_rgb(255_255_255/0.9)] dark:[text-shadow:0_1px_12px_rgb(0_0_0/0.5)] sm:text-[11px]"
        >
          <span aria-hidden className="text-accent">
            ✦
          </span>{" "}
          {hero.kicker}{" "}
          <span aria-hidden className="text-accent">
            ✦
          </span>
        </motion.p>

        <TypewriterText
          as="h1"
          text={hero.title}
          className={titleCls}
          start={heroClient}
          speedMs={10}
          onComplete={() => setTitleDone(true)}
        />

        <motion.div
          style={{ y }}
          className="relative mt-4 hidden aspect-square w-[min(380px,36vw)] max-w-[380px] shrink-0 overflow-hidden rounded-2xl border border-stroke/20 bg-white/85 shadow-plate [shape-outside:inset(0_round_1rem)] backdrop-blur-xl dark:border-white/20 dark:bg-black/50 lg:float-right lg:ml-8 lg:mt-1 lg:mb-5 lg:block"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.12 }}
        >
          <HeroPhotoCard />
        </motion.div>

        {hasHeroSubtitle ? (
          <TypewriterText
            as="p"
            text={hero.subtitle}
            className={subtitleCls}
            start={titleDone}
            speedMs={7}
            showCursor={false}
            onComplete={() => setSubtitleDone(true)}
          />
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={subtitleDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          className="clear-both mt-8"
        >
          <motion.div
            className="relative flex flex-col gap-3 rounded-2xl border border-stroke/15 bg-white/40 p-4 shadow-plate backdrop-blur-md dark:border-white/12 dark:bg-black/35 sm:flex-row sm:flex-wrap sm:items-center sm:p-5"
            initial={{ opacity: 0 }}
            animate={subtitleDone ? { opacity: 1 } : {}}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            <motion.span
              className="pointer-events-none absolute -inset-px rounded-2xl bg-[radial-gradient(ellipse_at_50%_0%,rgb(224_28_28_/_0.14),transparent_55%)] blur-[1px] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgb(224_28_28_/_0.2),transparent_58%)]"
              animate={
                subtitleDone
                  ? { opacity: [0.25, 0.45, 0.25] }
                  : { opacity: 0 }
              }
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <div className="relative flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={subtitleDone ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
              >
                <Button
                  type="button"
                  onClick={() => {
                    void track("click_starter_pack", { from: "hero_primary" });
                    starterPack.open("hero_primary");
                  }}
                  className="w-full sm:w-auto"
                >
                  {hero.ctaPrimary}
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={subtitleDone ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.18 }}
              >
                <AnchorButton
                  href="#product"
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToProduct();
                  }}
                  className="w-full sm:w-auto"
                >
                  {hero.ctaSecondary}
                </AnchorButton>
              </motion.div>
            </div>
          </motion.div>
          {hero.ctaHint ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={subtitleDone ? { opacity: 1 } : {}}
              transition={{ delay: 0.35, duration: 0.35 }}
              className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-white"
            >
              {hero.ctaHint}
            </motion.p>
          ) : null}
        </motion.div>
      </div>

      <HeroMarquee phrases={hero.marqueePhrases} />
    </section>
  );
}
