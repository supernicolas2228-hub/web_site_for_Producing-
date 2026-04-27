"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { contactSection } from "@/config/content";
import { links, isPlaceholderLink } from "@/config/links";
import { TelegramMark } from "@/components/icons/TelegramMark";
import { SectionHeading } from "@/components/SectionHeading";
import { AnchorButton } from "@/components/ui/Button";
import { sectionEnter, fadeUp, staggerSnappy } from "@/lib/motion";
import { outboundAnchorProps, chainOnClick } from "@/lib/outbound-link";
import { track } from "@/lib/track";

const SOCIAL: { key: "telegram" | "youtube" | "instagram" | "vk"; label: string; hint: string }[] = [
  { key: "telegram", label: "Telegram", hint: "Канал / личка" },
  { key: "youtube", label: "YouTube", hint: "Видео" },
  { key: "instagram", label: "Instagram", hint: "Stories / посты" },
  { key: "vk", label: "ВКонтакте", hint: "Сообщество" },
];

export function ContactSocial() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.section
      id={contactSection.id}
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={sectionEnter}
      className="scroll-mt-24 border-b border-stroke/15 py-12 dark:border-white/10 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel overflow-hidden p-0 sm:p-0">
          <div className="grid gap-0 lg:grid-cols-2 lg:items-stretch">
            <div className="relative min-h-[220px] w-full sm:min-h-[280px] lg:min-h-[360px]">
              <Image
                src={contactSection.portraitSrc}
                alt={contactSection.portraitAlt}
                fill
                className={contactSection.portraitCoverClass}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 lg:bg-gradient-to-r"
                aria-hidden
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <SectionHeading
                inView={inView}
                className="font-display text-[clamp(1.4rem,3vw,1.9rem)] font-bold uppercase leading-tight tracking-tight text-zinc-900 dark:text-zinc-100"
              >
                {contactSection.title}
              </SectionHeading>
              {contactSection.hint.trim() ? (
                <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {contactSection.hint}
                </p>
              ) : null}
              <motion.div
                className="mt-8 flex flex-col gap-2.5"
                variants={staggerSnappy}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
              >
                {SOCIAL.map((s) => {
                  const href = links[s.key];
                  if (isPlaceholderLink(href)) return null;
                  const base = outboundAnchorProps(href);

                  if (s.key === "telegram") {
                    return (
                      <motion.div key={s.key} variants={fadeUp} className="w-full">
                        <AnchorButton
                          {...base}
                          variant="secondary"
                          attention
                          onClick={chainOnClick(base.onClick, () =>
                            void track("click_social", { network: s.key, from: "contact_section" }),
                          )}
                          className="reviews-telegram-cta group/rel w-full min-h-[46px] !justify-center gap-2.5 !px-6 !py-2.5 !text-xs sm:!min-h-[52px] sm:!px-7 sm:!py-3 sm:!text-sm"
                        >
                          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-800 transition-all duration-300 group-hover/rel:scale-110 group-hover/rel:bg-emerald-500/25 group-hover/rel:text-emerald-950 dark:bg-emerald-400/12 dark:text-emerald-200 dark:group-hover/rel:bg-emerald-400/22 dark:group-hover/rel:text-white">
                            <TelegramMark className="h-4 w-4" />
                          </span>
                          <span className="flex flex-col items-start gap-0.5 text-balance">
                            <span>{s.label}</span>
                            <span className="text-[11px] font-medium normal-case tracking-normal opacity-90">
                              {s.hint}
                            </span>
                          </span>
                        </AnchorButton>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.a
                      key={s.key}
                      href={base.href}
                      onClick={chainOnClick(base.onClick, () =>
                        void track("click_social", { network: s.key, from: "contact_section" }),
                      )}
                      target={base.target}
                      rel={base.rel}
                      variants={fadeUp}
                      className="cta-social-invite group flex min-h-[48px] items-center justify-between gap-3 rounded-2xl border border-stroke/20 bg-white/60 px-4 py-3 text-left shadow-plate transition hover:border-accent/35 hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
                    >
                      <div>
                        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-zinc-900 dark:text-zinc-100">
                          {s.label}
                        </p>
                        <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">{s.hint}</p>
                      </div>
                      <span
                        className="text-accent transition group-hover:translate-x-0.5"
                        aria-hidden
                      >
                        ↗
                      </span>
                    </motion.a>
                  );
                })}
                {SOCIAL.every((s) => isPlaceholderLink(links[s.key])) ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Ссылки на мессенджеры задаются в <code className="rounded bg-zinc-200/60 px-1.5 py-0.5 text-xs dark:bg-white/10">.env</code> (NEXT_PUBLIC_TELEGRAM_URL и т.д.).
                  </p>
                ) : null}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
