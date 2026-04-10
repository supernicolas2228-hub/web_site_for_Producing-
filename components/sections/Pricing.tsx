"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { pricing } from "@/config/content";
import { links } from "@/config/links";
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
  const joinCta = outboundAnchorProps(links.joinSellIsLife);

  return (
    <section
      id="pricing"
      ref={ref}
      className="scroll-mt-24 border-b border-stroke/15 bg-band/55 py-16 backdrop-blur-xl dark:border-white/10 dark:bg-band/35 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TypewriterText
          as="h2"
          text={pricing.title}
          className="font-display text-[clamp(1.75rem,4vw,3.25rem)] uppercase leading-tight tracking-tight text-zinc-900 dark:text-white"
          start={inView}
          speedMs={10}
          onComplete={() => setHeadDone(true)}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
        >
          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
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
                        ? "border-2 border-accent !bg-red-50/95 shadow-lift ring-2 ring-accent/25 backdrop-blur-xl dark:!border-accent/55 dark:!bg-black/50 dark:!shadow-plate dark:ring-accent/30 lg:scale-[1.03]"
                        : ""
                    }`}
                  >
                    {featured && (
                      <span className="absolute -top-3 right-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-accent/40">
                        Рекомендуем
                      </span>
                    )}
                    <p className="font-display text-xl uppercase text-zinc-900 dark:text-white">{plan.period}</p>
                    <p className="mt-4 font-body text-[1.6875rem] font-medium tabular-nums tracking-[-0.03em] text-zinc-700 antialiased dark:text-white sm:text-[1.875rem]">
                      {plan.price}
                    </p>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-white">
                      {plan.description}
                    </p>
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
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-16 rounded-2xl border border-stroke/20 bg-white/80 p-6 shadow-plate backdrop-blur-xl dark:border-white/20 dark:bg-black/50 sm:p-10"
          >
            <div className="max-w-3xl space-y-3 text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-white">
              {pricing.finalLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AnchorButton
                {...joinCta}
                onClick={chainOnClick(joinCta.onClick, () =>
                  void track("click_pricing", { plan: "final_cta", label: "join" })
                )}
              >
                {pricing.ctaPaid}
              </AnchorButton>
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
