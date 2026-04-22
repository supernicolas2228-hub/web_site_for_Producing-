"use client";

import { motion } from "framer-motion";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-[48px] items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-h-[52px] sm:px-7";

const variants: Record<Variant, string> = {
  primary:
    "border-accent/55 bg-accent/95 text-white shadow-[0_18px_38px_-22px_rgb(var(--accent-rgb)/0.85)] hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_22px_42px_-20px_rgb(var(--accent-rgb)/0.95)] active:translate-y-0 dark:border-accent/55",
  secondary:
    "border-accent/32 bg-transparent text-zinc-900 hover:-translate-y-0.5 hover:border-accent/55 hover:bg-accent/10 hover:text-zinc-950 dark:text-white dark:hover:bg-accent/12",
  ghost:
    "border-stroke/18 bg-white/55 text-zinc-900 shadow-plate backdrop-blur-xl hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-accent/35 dark:hover:bg-white/10",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<typeof motion.button> & { variant?: Variant }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnchorButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<typeof motion.a> & { variant?: Variant }) {
  return (
    <motion.a
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
