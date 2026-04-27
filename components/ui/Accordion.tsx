"use client";

import { AnimatePresence, motion } from "framer-motion";
import { easePremium } from "@/lib/motion";
import { useState, type ReactNode } from "react";

export type AccordionItemData = {
  id: string;
  title: string;
  content: ReactNode;
};

export function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-[1.5rem] border border-stroke/18 bg-white/55 shadow-plate backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full min-h-[56px] items-center justify-between gap-4 px-4 py-4 text-left font-display text-base uppercase tracking-[0.08em] sm:px-6 sm:text-lg"
            >
              <span className="text-zinc-900 dark:text-zinc-100">{item.title}</span>
              <span
                className={`shrink-0 text-accent transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.36, ease: easePremium }}
                  className="border-t border-stroke/15 bg-white/65 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                >
                  <div className="px-4 py-4 text-sm font-medium leading-relaxed text-zinc-900 dark:text-zinc-100 sm:px-6 sm:text-base">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
