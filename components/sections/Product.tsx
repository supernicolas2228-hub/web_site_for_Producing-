"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { product as productContent } from "@/config/content";
import { links } from "@/config/links";
import { Card } from "@/components/ui/Card";
import { AnchorButton } from "@/components/ui/Button";
import { TypewriterText } from "@/components/TypewriterText";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { outboundAnchorProps } from "@/lib/outbound-link";

export function Product() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [headDone, setHeadDone] = useState(false);

  return (
    <section
      id="product"
      ref={ref}
      className="scroll-mt-24 border-b border-stroke/15 bg-page/50 py-16 backdrop-blur-xl dark:border-white/10 dark:bg-page/35 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TypewriterText
          as="h2"
          text={productContent.whatIs.title}
          className="max-w-3xl font-display text-[clamp(1.75rem,4vw,3.25rem)] uppercase leading-tight tracking-tight text-zinc-900 dark:text-white"
          start={inView}
          speedMs={10}
          onComplete={() => setHeadDone(true)}
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
        >
          <motion.div variants={fadeUp} className="mt-6 max-w-3xl">
            <p className="text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-white">
              {productContent.whatIs.body}
            </p>
          </motion.div>

          <motion.h3
            variants={fadeUp}
            className="mt-14 font-display text-xl uppercase tracking-wide text-zinc-900 sm:text-2xl dark:text-white"
          >
            {productContent.stepsTitle}
          </motion.h3>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-white"
          >
            {productContent.stepsLead}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 space-y-10">
            {(() => {
              let stepIndex = 0;
              return productContent.stepGroups.map((group) => (
                <div key={group.phase} className="space-y-4">
                  <div className="border-b border-stroke/20 pb-3 dark:border-white/10">
                    <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-accent sm:text-sm">
                      {group.phase}
                    </p>
                    <p className="mt-1.5 text-sm text-zinc-600 sm:text-base dark:text-white">{group.blurb}</p>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {group.steps.map((step) => {
                      stepIndex += 1;
                      const n = stepIndex;
                      return (
                        <Card
                          key={`${group.phase}-${step.title}`}
                          hover
                          className="flex gap-4 lg:col-span-1"
                        >
                          <span className="font-display text-2xl text-accent">{String(n).padStart(2, "0")}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-zinc-800 sm:text-base dark:text-white">
                              {step.title}
                            </p>
                            {step.hint ? (
                              <p className="mt-1.5 text-xs leading-snug text-zinc-500 dark:text-white">
                                {step.hint}
                              </p>
                            ) : null}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </motion.div>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <motion.div variants={fadeUp}>
              <h3 className="font-display text-xl uppercase tracking-wide text-zinc-900 sm:text-2xl dark:text-white">
                {productContent.insideTitle}
              </h3>
              <ul className="mt-6 space-y-3 text-zinc-700 dark:text-white">
                {productContent.inside.map((item) => (
                  <li key={item} className="flex gap-2 text-sm sm:text-base">
                    <span className="text-accent">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp}>
              <h3 className="font-display text-xl uppercase tracking-wide text-zinc-900 sm:text-2xl dark:text-white">
                {productContent.audienceTitle}
              </h3>
              <ul className="mt-6 space-y-3 text-zinc-700 dark:text-white">
                {productContent.audience.map((item) => (
                  <li key={item} className="flex gap-2 text-sm sm:text-base">
                    <span className="text-accent">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="mt-10">
            <AnchorButton
              {...outboundAnchorProps(links.productYoutubeShort)}
              variant="ghost"
              className="!normal-case !tracking-normal"
            >
              {productContent.shortBreakdownCta}
            </AnchorButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
