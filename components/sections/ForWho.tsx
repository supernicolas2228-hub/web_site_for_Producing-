"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { EmojiTone } from "@/components/EmojiTone";
import { PunchlineMarquee } from "@/components/PunchlineMarquee";
import { forWho } from "@/config/content";
import { TypewriterText } from "@/components/TypewriterText";
import { fadeUp, staggerContainer } from "@/lib/motion";

const itemEmojis = ["🎯", "⏳", "🧭", "💸", "🏠", "✨"] as const;

export function ForWho() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [headDone, setHeadDone] = useState(false);

  return (
    <section
      ref={ref}
      className="border-b border-stroke/15 bg-page/50 py-16 backdrop-blur-xl dark:border-white/10 dark:bg-page/35 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TypewriterText
          as="h2"
          text={forWho.title}
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
          <motion.ul variants={fadeUp} className="mt-10 grid gap-3 sm:gap-4 lg:max-w-4xl">
            {forWho.items.map((item, i) => (
              <li
                key={item}
                className="flex min-h-[48px] items-start gap-3 rounded-xl border border-stroke/20 bg-white/80 px-4 py-3 shadow-plate backdrop-blur-xl dark:border-white/20 dark:bg-black/50 sm:px-5"
              >
                <EmojiTone className="mt-0.5 shrink-0 text-lg leading-none sm:text-xl" aria-hidden>
                  {itemEmojis[i % itemEmojis.length]}
                </EmojiTone>
                <span className="text-base text-zinc-800 sm:text-lg dark:text-white">{item}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView && headDone ? "show" : "hidden"}
        className="mt-10 w-full"
      >
        <PunchlineMarquee text={forWho.punchline} />
      </motion.div>
    </section>
  );
}
