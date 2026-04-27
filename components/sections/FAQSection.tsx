"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { faq } from "@/config/content";
import { links, isPlaceholderLink } from "@/config/links";
import { SectionHeading } from "@/components/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { AnchorButton, Button } from "@/components/ui/Button";
import { useStarterPack } from "@/components/starter-pack/StarterPackProvider";
import { sectionEnter } from "@/lib/motion";
import { track } from "@/lib/track";
import { outboundAnchorProps } from "@/lib/outbound-link";

export function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const starterPack = useStarterPack();
  const items = faq.items.map((item) => ({
    id: item.id,
    title: item.question,
    content: <p className="whitespace-pre-wrap">{item.answer}</p>,
  }));

  const tg = outboundAnchorProps(links.telegram);
  const hasTg = !isPlaceholderLink(links.telegram);

  return (
    <motion.section
      id="faq"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={sectionEnter}
      className="scroll-mt-24 border-b border-stroke/15 py-14 dark:border-white/10 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel px-6 py-8 sm:px-8 sm:py-10">
        {faq.eyebrow.trim() ? (
          <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-accent sm:text-xs">
            {faq.eyebrow}
          </p>
        ) : null}
        <SectionHeading
          inView={inView}
          className="font-display text-[clamp(1.5rem,3.4vw,2.15rem)] font-semibold uppercase leading-[1.08] tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          {faq.title}
        </SectionHeading>
        <div className="mt-10">
          <Accordion items={items} />
        </div>

        <motion.div
          className="mt-14 rounded-2xl border border-emerald-900/12 bg-gradient-to-br from-emerald-50/90 via-white/85 to-teal-50/70 p-6 shadow-plate dark:border-emerald-400/18 dark:from-emerald-950/40 dark:via-[rgb(var(--surface-rgb)/0.92)] dark:to-zinc-950/85 sm:p-8"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-emerald-900 dark:text-emerald-200">
            {faq.contactTitle}
          </h3>
          {faq.contactHint.trim() ? (
            <p className="mt-2 text-sm font-medium leading-relaxed text-emerald-950 dark:text-emerald-50">
              {faq.contactHint}
            </p>
          ) : null}
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {hasTg ? (
                <AnchorButton {...tg} variant="primary" className="!min-h-[46px] w-full !justify-center sm:w-auto">
                  {faq.telegramChannelCta}
                </AnchorButton>
              ) : null}
              {!hasTg ? (
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full !min-h-[46px] !justify-center sm:w-auto"
                    onClick={() => {
                      void track("click_starter_pack", { from: "faq_contact" });
                      starterPack.open("faq_contact");
                    }}
                  >
                    Записаться
                  </Button>
                  <p className="max-w-xl text-sm font-medium leading-relaxed text-emerald-950 dark:text-emerald-50/95">
                    {faq.socialLinksLaterHint}
                  </p>
                </div>
              ) : null}
            </div>
            {hasTg && faq.telegramVpnHint.trim() ? (
              <p className="text-[11px] font-medium leading-snug text-emerald-900/55 dark:text-emerald-100/45">
                {faq.telegramVpnHint}
              </p>
            ) : null}
          </div>
        </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
