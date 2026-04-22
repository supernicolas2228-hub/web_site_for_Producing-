"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { pricing } from "@/config/content";
import { links, isPlaceholderLink } from "@/config/links";
import { useStarterPack } from "@/components/starter-pack/StarterPackProvider";
import { Card } from "@/components/ui/Card";
import { AnchorButton, Button } from "@/components/ui/Button";
import { TypewriterText } from "@/components/TypewriterText";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { chainOnClick, outboundAnchorProps } from "@/lib/outbound-link";
import { track } from "@/lib/track";

export function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [headDone, setHeadDone] = useState(false);
  const starterPack = useStarterPack();
  const joinHref = links.joinSellIsLife;
  const joinCta = outboundAnchorProps(joinHref);
  const payLinkReady = !isPlaceholderLink(joinHref);

  return (
    <section
      id="pricing"
      ref={ref}
      className="scroll-mt-24 border-b border-stroke/15 bg-band/34 py-16 backdrop-blur-xl dark:border-white/10 dark:bg-band/24 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-[11px] uppercase tracking-[0.28em] text-accent">Контакт и запись</p>
        <TypewriterText
          as="h2"
          text={pricing.title}
          className="mt-3 font-display text-[clamp(1.9rem,4vw,3.7rem)] uppercase leading-[1.02] tracking-tight text-zinc-900 dark:text-zinc-100"
          start={inView}
          speedMs={10}
          onComplete={() => setHeadDone(true)}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
        >
          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
            {pricing.plans.map((plan) => {
              const featured = plan.featured;
              return (
                <motion.div
                  key={plan.id}
                  variants={fadeUp}
                  className={featured ? "lg:-mt-2 lg:mb-2" : ""}
                >
                  <Card
                    hover
                    className={`relative flex h-full flex-col ${
                      featured
                        ? "overflow-visible border-2 border-accent !bg-slate-200/95 pt-10 shadow-lift ring-2 ring-accent/25 backdrop-blur-xl dark:!border-accent/55 dark:!bg-[#1a2330] dark:!shadow-plate dark:ring-accent/26 lg:scale-[1.03]"
                        : ""
                    }`}
                  >
                    {featured && (
                      <>
                        <motion.span
                          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
                          animate={{ opacity: [0.35, 1, 0.35], scaleX: [0.9, 1, 0.9] }}
                          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                          aria-hidden
                        />
                        <motion.span
                          className="pointer-events-none absolute inset-y-10 right-6 w-20 rounded-full bg-[radial-gradient(circle,rgb(var(--accent-rgb)/0.16),transparent_70%)] blur-2xl"
                          animate={{ opacity: [0.2, 0.42, 0.2], scale: [0.92, 1.06, 0.92] }}
                          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                          aria-hidden
                        />
                      </>
                    )}
                    {featured && (
                      <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-accent/40">
                        Рекомендуем
                      </span>
                    )}
                    <p className="font-display text-xl uppercase tracking-[0.08em] text-zinc-900 dark:text-zinc-100">
                      {plan.period}
                    </p>
                    <p className="mt-4 font-body text-[1.45rem] font-medium tabular-nums tracking-[-0.03em] text-zinc-700 antialiased dark:text-zinc-200 sm:text-[1.625rem]">
                      {plan.price}
                    </p>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {plan.description}
                    </p>
                    {payLinkReady ? (
                      <AnchorButton
                        {...joinCta}
                        variant={featured ? "primary" : "secondary"}
                        className="mt-6 w-full !justify-center"
                        onClick={chainOnClick(joinCta.onClick, () =>
                          void track("click_pricing", { plan: plan.id, period: plan.period })
                        )}
                      >
                        Выбрать
                      </AnchorButton>
                    ) : (
                      <Button
                        type="button"
                        variant={featured ? "primary" : "secondary"}
                        className="mt-6 w-full !justify-center"
                        onClick={() => {
                          void track("click_pricing", { plan: plan.id, period: plan.period, via: "starter_pack" });
                          starterPack.open(`pricing_plan_${plan.id}`);
                        }}
                      >
                        Записаться
                      </Button>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={fadeUp}
            className="ornate-frame mt-16 rounded-[2rem] border border-stroke/20 bg-white/55 p-6 shadow-plate backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-10"
          >
            <div className="max-w-3xl space-y-3 text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-300">
              {pricing.finalLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {payLinkReady ? (
                <AnchorButton
                  {...joinCta}
                  onClick={chainOnClick(joinCta.onClick, () =>
                    void track("click_pricing", { plan: "final_cta", label: "join" })
                  )}
                >
                  {pricing.ctaPaid}
                </AnchorButton>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    void track("click_pricing", { plan: "final_cta", label: "starter_pack" });
                    starterPack.open("pricing_final_paid");
                  }}
                >
                  {pricing.ctaPaid}
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  void track("click_starter_pack", { from: "pricing_final" });
                  starterPack.open("pricing_final");
                }}
              >
                {pricing.ctaStarter}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
