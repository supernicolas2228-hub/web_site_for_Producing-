"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";

export type AccordionItemData = {
  id: string;
  title: string;
  content: ReactNode;
};

export function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-stroke/18 bg-white/75 shadow-plate backdrop-blur-xl dark:border-white/20 dark:bg-black/50"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full min-h-[48px] items-center justify-between gap-4 px-4 py-3 text-left font-display text-base uppercase tracking-wide sm:px-5 sm:text-lg"
            >
              <span className="text-zinc-900 dark:text-white">{item.title}</span>
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
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="border-t border-stroke/15 bg-white/80 backdrop-blur-md dark:border-white/15 dark:bg-black/40"
                >
                  <div className="px-4 py-4 text-sm leading-relaxed text-zinc-700 dark:text-white sm:px-5 sm:text-base">
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
