"use client";



import { motion, useInView } from "framer-motion";

import { useRef, useState } from "react";

import { about } from "@/config/content";

import { TypewriterText } from "@/components/TypewriterText";

import { Card } from "@/components/ui/Card";

import { VideoPlaceholder } from "@/components/ui/VideoPlaceholder";

import { fadeUp, staggerContainer } from "@/lib/motion";



/** Только превью видео — фото идёт в герое; без повтора портрета и полоски «фото · видео». */

function AboutVideoBlock() {

  return (

    <div

      className="w-full min-w-0 overflow-hidden rounded-[1.75rem] border border-stroke/20 bg-white/60 shadow-plate ring-1 ring-black/[0.04] backdrop-blur-xl dark:border-white/14 dark:bg-black/40 dark:ring-white/[0.06] lg:sticky lg:top-24 lg:max-w-none lg:self-start"

      role="group"

      aria-label="Видео-материалы"

    >

      <VideoPlaceholder

        title="Видео-материалы"

        overline={about.video.overline}

        headline={about.video.headline}

        description={about.video.description}

        className="!rounded-none !border-0 !shadow-none !ring-0"

      />

    </div>

  );

}



export function About() {

  const ref = useRef(null);

  const inView = useInView(ref, { once: true, margin: "-12%" });

  const [headDone, setHeadDone] = useState(false);



  return (

    <section

      id="about"

      ref={ref}

      className="scroll-mt-24 border-b border-stroke/15 bg-band/55 py-16 backdrop-blur-xl dark:border-white/10 dark:bg-band/35 sm:py-20 lg:py-28"

    >

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-accent sm:text-sm">

          {about.eyebrow}

        </p>

        <TypewriterText

          as="h2"

          text={about.title}

          className="max-w-4xl font-display text-[clamp(1.75rem,4vw,3.25rem)] uppercase leading-tight tracking-tight text-zinc-900 dark:text-white"

          start={inView}

          speedMs={10}

          onComplete={() => setHeadDone(true)}

        />

        <motion.div

          variants={staggerContainer}

          initial="hidden"

          animate={inView && headDone ? "show" : "hidden"}

        >

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">

            <motion.div

              variants={fadeUp}

              className="flex flex-col justify-between gap-6 rounded-2xl border border-stroke/12 bg-white/40 p-6 shadow-[0_1px_0_rgb(15_23_39_/0.05)] backdrop-blur-md dark:border-white/10 dark:bg-black/25 dark:shadow-[0_1px_0_rgb(255_255_255_/0.06)] sm:p-8 lg:min-h-[min(100%,720px)]"

            >

              <div className="space-y-5">

                {about.intro.map((p, i) => (

                  <p

                    key={i}

                    className="text-[15px] leading-[1.75] text-zinc-700 sm:text-[16px] dark:text-white"

                  >

                    {p}

                  </p>

                ))}

              </div>

              <p className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3.5 text-[15px] font-medium leading-[1.72] text-zinc-800 dark:border-accent/25 dark:bg-accent/10 dark:text-white">

                {about.trustLine}

              </p>

              <ul className="space-y-3.5 border-t border-stroke/15 pt-6 text-[15px] leading-relaxed text-zinc-700 dark:border-white/10 dark:text-white sm:text-[16px]">

                <li className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-white">

                  Факты и цифры

                </li>

                {about.bullets.map((line) => (

                  <li key={line} className="flex gap-3">

                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />

                    <span>{line}</span>

                  </li>

                ))}

              </ul>

            </motion.div>



            <motion.div variants={fadeUp} className="flex flex-col lg:w-full">

              <AboutVideoBlock />

            </motion.div>

          </div>



          <motion.div

            variants={fadeUp}

            className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"

          >

            {about.stats.map((s) => (

              <Card key={s.label} hover>

                <p className="font-display text-3xl uppercase text-zinc-900 sm:text-4xl dark:text-white">{s.value}</p>

                <p className="mt-2 text-sm text-zinc-600 dark:text-white">{s.label}</p>

              </Card>

            ))}

          </motion.div>

        </motion.div>

      </div>

    </section>

  );

}

