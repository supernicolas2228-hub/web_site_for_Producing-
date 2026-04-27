"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { casesSection } from "@/config/content";
import { SectionHeading } from "@/components/SectionHeading";
import { TelegramMark } from "@/components/icons/TelegramMark";
import { AnchorButton } from "@/components/ui/Button";
import { fadeUp, sectionEnter, springHover, staggerContainer } from "@/lib/motion";
import { outboundAnchorProps } from "@/lib/outbound-link";

const carousel = casesSection.testimonials;

function splitReview(full: string): { lead: string; rest: string } {
  const m = full.match(/^[^.!?]+[.!?]/);
  if (!m) return { lead: full.trim(), rest: "" };
  const lead = m[0].trim();
  const rest = full.slice(m[0].length).trim();
  return { lead, rest };
}

function visibleColumns(width: number): 1 | 2 | 3 {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CasesReviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduceMotion = useReducedMotion();
  const [headDone, setHeadDone] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [gap, setGap] = useState(16);
  const [cols, setCols] = useState<1 | 2 | 3>(1);

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const c = visibleColumns(window.innerWidth);
    const g = window.innerWidth >= 768 ? 16 : 12;
    setCols(c);
    setGap(g);
    const usable = w - g * (c - 1);
    setItemWidth(Math.max(240, usable / c));
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = viewportRef.current;
    if (!el || !itemWidth) return;
    const step = itemWidth + gap;
    const maxIndex = Math.max(0, carousel.length - cols);
    const rawIndex = step > 0 ? el.scrollLeft / step : 0;
    const currentIndex = Math.round(rawIndex);
    let nextIndex = currentIndex + dir;

    if (nextIndex > maxIndex) nextIndex = 0;
    if (nextIndex < 0) nextIndex = maxIndex;

    el.scrollTo({ left: nextIndex * step, behavior: "smooth" });
  };

  const moreTg = outboundAnchorProps(casesSection.moreReviewsUrl);
  const hasCards = carousel.length > 0;

  return (
    <motion.section
      id="cases"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={sectionEnter}
      className="scroll-mt-24 border-b border-stroke/15 py-14 dark:border-white/10 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-5xl lg:px-8">
        <div className="glass-panel px-6 py-8 sm:px-8 sm:py-10">
          {casesSection.eyebrow.trim() ? (
            <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-accent sm:text-xs">
              {casesSection.eyebrow}
            </p>
          ) : null}
          <SectionHeading
            inView={inView}
            className="font-display text-[clamp(1.5rem,3.4vw,2.15rem)] font-semibold uppercase leading-[1.08] tracking-tight text-zinc-900 dark:text-zinc-100"
            onAnimationComplete={() => setHeadDone(true)}
          >
            {casesSection.title}
          </SectionHeading>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="mt-4 text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-100"
          >
            {casesSection.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.06 }}
            className="mt-8"
          >
            <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-zinc-800 dark:text-zinc-200">
              {casesSection.testimonialsTitle}
            </p>

            {hasCards ? (
              <div className="relative mt-4">
                <motion.button
                  type="button"
                  aria-label="Предыдущие отзывы"
                  onClick={() => scrollByDir(-1)}
                  whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  transition={springHover}
                  className="group absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stroke/25 bg-white/90 text-zinc-900 shadow-md backdrop-blur-sm transition-colors duration-300 not-dark:hover:bg-white md:h-12 md:w-12 dark:border-emerald-400/25 dark:bg-zinc-950/70 dark:text-emerald-100 dark:shadow-[0_0_24px_-8px_rgb(0_0_0/0.9)] dark:hover:border-emerald-300/40 dark:hover:bg-emerald-950/85 dark:hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5 transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-90 md:h-6 md:w-6" />
                </motion.button>
                <motion.button
                  type="button"
                  aria-label="Следующие отзывы"
                  onClick={() => scrollByDir(1)}
                  whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  transition={springHover}
                  className="group absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stroke/25 bg-white/90 text-zinc-900 shadow-md backdrop-blur-sm transition-colors duration-300 not-dark:hover:bg-white md:h-12 md:w-12 dark:border-emerald-400/25 dark:bg-zinc-950/70 dark:text-emerald-100 dark:shadow-[0_0_24px_-8px_rgb(0_0_0/0.9)] dark:hover:border-emerald-300/40 dark:hover:bg-emerald-950/85 dark:hover:text-white"
                >
                  <ChevronRight className="h-5 w-5 transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-90 md:h-6 md:w-6" />
                </motion.button>

                <motion.div
                  ref={viewportRef}
                  variants={staggerContainer}
                  initial="hidden"
                  animate={inView ? "show" : "hidden"}
                  className="reviews-carousel-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 pt-1 md:gap-4 md:px-12"
                  style={{
                    scrollbarWidth: "thin",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {carousel.map((t, index) => {
                    const { lead, rest } = splitReview(t.text);
                    return (
                    <motion.article
                      key={t.author}
                      className="review-card group flex shrink-0 snap-start snap-always flex-col justify-between rounded-2xl border border-stroke/18 bg-white/50 p-6 shadow-plate backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-500 will-change-transform dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-emerald-400/28 dark:hover:shadow-[0_16px_48px_-22px_rgb(0_0_0/0.78),0_0_0_1px_rgb(52_211_153/0.12),0_0_28px_-8px_rgb(52_211_153/0.1)]"
                      style={{
                        width: itemWidth ? `${itemWidth}px` : "100%",
                        scrollSnapAlign: "start",
                      }}
                      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
                      transition={{ duration: 0.45, delay: 0.04 * index, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={
                        reduceMotion
                          ? undefined
                          : { y: -4, scale: 1.01, transition: springHover }
                      }
                    >
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-display text-sm font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
                            {t.author}
                          </p>
                          <span className="rounded-full border border-emerald-700/20 bg-emerald-500/10 px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
                            Результат
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                          {lead}
                        </p>
                        <p
                          className="mt-2 text-amber-500 dark:text-amber-400"
                          aria-label={`${t.stars} из 5`}
                        >
                          {"★".repeat(t.stars)}
                        </p>
                        {rest ? (
                          <p className="mt-3 whitespace-pre-line text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 md:text-[15px]">
                            {rest}
                          </p>
                        ) : null}
                      </div>
                    </motion.article>
                  );
                  })}
                </motion.div>
                <p className="mt-2 text-center text-sm text-zinc-600 opacity-90 dark:text-zinc-400 md:hidden">
                  {casesSection.carouselSwipeHint}
                </p>
              </div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 flex justify-center"
            >
              <AnchorButton
                {...moreTg}
                variant="secondary"
                attention
                className="reviews-telegram-cta group/rel w-full min-h-[46px] !justify-center gap-2.5 !px-6 !py-2.5 !text-xs sm:w-auto sm:!min-h-[52px] sm:!px-7 sm:!py-3 sm:!text-sm"
              >
                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-800 transition-all duration-300 group-hover/rel:scale-110 group-hover/rel:bg-emerald-500/25 group-hover/rel:text-emerald-950 dark:bg-emerald-400/12 dark:text-emerald-200 dark:group-hover/rel:bg-emerald-400/22 dark:group-hover/rel:text-white">
                  <TelegramMark className="h-4 w-4" />
                </span>
                <span className="text-balance">{casesSection.moreReviewsLabel}</span>
              </AnchorButton>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView && headDone ? "show" : "hidden"}
            className="mt-10 space-y-5"
          >
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50/95 via-white/92 to-teal-50/75 p-6 shadow-lift dark:border-emerald-400/25 dark:from-emerald-950/55 dark:via-[rgb(var(--surface-rgb)/0.95)] dark:to-zinc-950/88 sm:p-7"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl dark:bg-emerald-400/12"
                aria-hidden
              />
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-800 dark:text-emerald-300">
                Главный кейс
              </p>
              <p className="relative mt-3 text-[15px] font-medium leading-[1.75] text-emerald-950 dark:text-emerald-50/95">
                {casesSection.mainCase}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
