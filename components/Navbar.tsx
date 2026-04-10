"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/config/content";
import { Button } from "@/components/ui/Button";
import { useStarterPack } from "@/components/starter-pack/StarterPackProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { track } from "@/lib/track";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const starterPack = useStarterPack();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass =
    "text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600 transition hover:text-zinc-900 dark:text-white dark:hover:text-white sm:text-sm";

  const barBg = scrolled
    ? "border-b border-stroke/15 bg-[var(--nav-bg-scrolled)] shadow-[var(--nav-shadow)] backdrop-blur-md"
    : "border-b border-transparent bg-[var(--nav-bg-top)] backdrop-blur-sm";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors ${barBg}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-4 lg:px-8">
        <Link
          href="/"
          className="shrink-0 font-display text-xl uppercase tracking-wide text-zinc-900 dark:text-white sm:text-2xl"
        >
          Sell is Life
        </Link>

        <nav className="hidden flex-1 justify-center gap-6 lg:flex xl:gap-8">
          {nav.anchors.map((a) => (
            <a key={a.href} href={a.href} className={linkClass}>
              {a.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="hidden lg:block">
            <Button
              type="button"
              onClick={() => {
                void track("click_starter_pack", { from: "navbar" });
                starterPack.open("navbar");
              }}
              className="!min-h-[44px] !px-5 !py-2 !text-xs"
            >
              {nav.cta}
            </Button>
          </div>
          <button
            type="button"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border-2 border-zinc-300 bg-white text-zinc-900 shadow-md shadow-zinc-900/10 lg:hidden dark:border-white/20 dark:bg-black/50 dark:text-white dark:shadow-plate dark:backdrop-blur-xl"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Меню</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.25" />
              ) : (
                <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2.25" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-stroke/15 bg-[var(--nav-bg-scrolled)] shadow-lg backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {nav.anchors.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="min-h-[48px] py-3 text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-white"
                  onClick={() => setOpen(false)}
                >
                  {a.label}
                </a>
              ))}
              <Button
                type="button"
                className="mt-2 w-full !justify-center"
                onClick={() => {
                  setOpen(false);
                  void track("click_starter_pack", { from: "navbar_mobile" });
                  starterPack.open("navbar_mobile");
                }}
              >
                {nav.cta}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
