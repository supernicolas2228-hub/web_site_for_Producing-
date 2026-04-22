"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { forWho } from "@/config/content";
import { PunchlineMarquee } from "@/components/PunchlineMarquee";
import { TypewriterText } from "@/components/TypewriterText";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function ForWho() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [headDone, setHeadDone] = useState(false);

  return (
    <motion.section
      id="for-who"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24 border-b border-stroke/15 bg-page/35 py-14 backdrop-blur-xl dark:border-white/10 dark:bg-page/22 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <TypewriterText
          as="h2"
          text={forWho.title}
          className="font-display text-[clamp(1.5rem,3.4vw,2.15rem)] font-semibold uppercase leading-[1.08] tracking-tight text-zinc-900 dark:text-zinc-100"
          start={inView}
          speedMs={11}
          onComplete={() => setHeadDone(true)}
        />
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
          className="mt-6 space-y-3"
        >
          {forWho.items.map((item) => (
            <motion.li
              key={item}
              variants={fadeUp}
              className="border-l-2 border-accent/50 pl-4 text-[15px] leading-snug text-zinc-800 dark:text-zinc-200"
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {forWho.punchline.trim() ? (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView && headDone ? "show" : "hidden"}
          className="mt-8 w-full"
        >
          <PunchlineMarquee text={forWho.punchline} />
        </motion.div>
      ) : null}
    </motion.section>
  );
}
