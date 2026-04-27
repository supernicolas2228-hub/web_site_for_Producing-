"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { faq } from "@/config/content";
import { SectionHeading } from "@/components/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { sectionEnter } from "@/lib/motion";

export function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const items = faq.items.map((item) => ({
    id: item.id,
    title: item.question,
    content: <p className="whitespace-pre-wrap">{item.answer}</p>,
  }));

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

        {faq.contactMovedNote?.trim() ? (
          <motion.p
            className="mt-10 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            {faq.contactMovedNote}
          </motion.p>
        ) : null}
        </div>
      </div>
    </motion.section>
  );
}
