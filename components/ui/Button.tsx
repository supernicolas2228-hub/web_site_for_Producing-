"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps } from "react";
import { springHover } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "relative overflow-visible inline-flex min-h-[48px] items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none sm:min-h-[52px] sm:px-7";

const attentionCls = "cta-attention motion-reduce:animate-none";

/** `not-dark:*` — чтобы `hover:bg-white` и светлые градиенты не срабатывали в `html.dark` (иначе белая кнопка + белый текст). */
const variants: Record<Variant, string> = {
  primary:
    "border-emerald-800/35 bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-500 text-zinc-950 shadow-[0_10px_36px_-14px_rgb(4_120_72/0.35),inset_0_1px_0_rgb(255_255_255/0.65)] backdrop-blur-[2px] hover:-translate-y-0.5 not-dark:hover:from-emerald-300 not-dark:hover:via-emerald-400 not-dark:hover:to-emerald-600 not-dark:hover:text-zinc-950 not-dark:hover:shadow-[0_14px_40px_-12px_rgb(4_120_72/0.42),inset_0_1px_0_rgb(255_255_255/0.55)] active:translate-y-0 dark:border-emerald-800/35 dark:bg-gradient-to-b dark:from-emerald-200 dark:via-emerald-300 dark:to-emerald-500 dark:text-zinc-950 dark:shadow-[0_10px_36px_-14px_rgb(4_120_72/0.35),inset_0_1px_0_rgb(255_255_255/0.65)] dark:hover:from-emerald-300 dark:hover:via-emerald-400 dark:hover:to-emerald-600 dark:hover:text-zinc-950 dark:hover:shadow-[0_14px_40px_-12px_rgb(4_120_72/0.42),inset_0_1px_0_rgb(255_255_255/0.55)]",
  secondary:
    "border-2 border-emerald-800/45 bg-white/88 text-zinc-950 shadow-[0_2px_14px_-6px_rgb(15_40_25/0.18)] backdrop-blur-sm hover:-translate-y-0.5 not-dark:hover:border-emerald-800/65 not-dark:hover:bg-white not-dark:hover:text-zinc-950 not-dark:hover:shadow-[0_6px_22px_-10px_rgb(15_40_25/0.22)] not-dark:active:bg-white/95 not-dark:active:text-zinc-950 dark:border-emerald-400/45 dark:bg-emerald-950/80 dark:text-white dark:shadow-[0_6px_28px_-10px_rgb(0_0_0/0.55)] dark:hover:border-emerald-300/55 dark:hover:bg-emerald-800/50 dark:hover:text-zinc-50 dark:hover:shadow-[0_10px_36px_-14px_rgb(0_0_0/0.6),0_0_0_1px_rgb(52_211_153/0.18)] dark:active:bg-emerald-800/65 dark:active:text-white",
  ghost:
    "border-stroke/18 bg-white/55 text-zinc-900 shadow-plate backdrop-blur-xl hover:-translate-y-0.5 not-dark:hover:border-accent/40 not-dark:hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-accent/35 dark:hover:bg-white/10 lg:dark:!border-white/15 lg:dark:!bg-zinc-950/55 lg:dark:!shadow-[0_8px_28px_-12px_rgb(0_0_0/0.5)] lg:dark:hover:!bg-zinc-950/70",
};

function useMicroMotion() {
  const reduce = useReducedMotion();
  return {
    hover: reduce ? undefined : { scale: 1.02, y: -2, transition: springHover },
    tap: reduce ? undefined : { scale: 0.978, transition: { type: "spring" as const, stiffness: 520, damping: 32 } },
  };
}

export function Button({
  variant = "primary",
  className = "",
  attention,
  children,
  ...props
}: ComponentProps<typeof motion.button> & { variant?: Variant; attention?: boolean }) {
  const { hover, tap } = useMicroMotion();
  const pulse = attention ?? variant === "primary";
  return (
    <motion.button
      whileHover={hover}
      whileTap={tap}
      className={`${base} ${variants[variant]} ${pulse ? attentionCls : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnchorButton({
  variant = "primary",
  className = "",
  attention,
  children,
  ...props
}: ComponentProps<typeof motion.a> & { variant?: Variant; attention?: boolean }) {
  const { hover, tap } = useMicroMotion();
  const pulse = attention ?? variant === "primary";
  return (
    <motion.a
      whileHover={hover}
      whileTap={tap}
      className={`${base} ${variants[variant]} ${pulse ? attentionCls : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
