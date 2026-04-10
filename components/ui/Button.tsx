"use client";

import { motion } from "framer-motion";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-[48px] items-center justify-center rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-lg shadow-accent/35 ring-1 ring-white/25 hover:bg-[#ff2a2a] hover:shadow-xl hover:shadow-accent/40 active:bg-[#b91515] dark:ring-white/15",
  secondary:
    "border-2 border-accent bg-transparent text-zinc-900 hover:border-accent hover:bg-red-50/90 dark:text-white dark:hover:border-accent/80 dark:hover:bg-accent/15",
  ghost:
    "border-2 border-zinc-300 bg-zinc-50 text-zinc-900 hover:border-zinc-400 hover:bg-white dark:border-white/20 dark:bg-black/45 dark:text-white dark:shadow-plate dark:backdrop-blur-xl dark:hover:border-white/35 dark:hover:bg-black/55",
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
