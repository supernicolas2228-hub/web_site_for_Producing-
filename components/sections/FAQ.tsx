"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { faq, faqSectionTitle } from "@/config/content";
import { EmojiTone } from "@/components/EmojiTone";
import { Accordion } from "@/components/ui/Accordion";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { TypewriterText } from "@/components/TypewriterText";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [headDone, setHeadDone] = useState(false);

  const items = faq.map((item, idx) => ({
    id: `faq-${idx}`,
    title: item.question,
    content: item.youtubeEmbedUrl ? (
      <VideoEmbed src={item.youtubeEmbedUrl} title={item.question} />
    ) : item.answerText ? (
      <p className="m-0">
        {item.answerEmoji ? (
          <EmojiTone
            className="mr-2 inline-block align-[-0.12em] text-[1.1rem] sm:text-[1.25rem]"
            aria-hidden
          >
            {item.answerEmoji}
          </EmojiTone>
        ) : null}
        {item.answerText}
      </p>
    ) : null,
  }));

  return (
    <section
      id="faq"
      ref={ref}
      className="scroll-mt-24 border-b border-stroke/15 bg-page/50 py-16 backdrop-blur-xl dark:border-white/10 dark:bg-page/35 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl lg:px-8">
        <TypewriterText
          as="h2"
          text={faqSectionTitle}
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
          <motion.div variants={fadeUp} className="mt-10">
            <Accordion items={items} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
