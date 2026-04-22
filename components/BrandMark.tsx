"use client";

import { motion } from "framer-motion";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
};

const sizeMap = {
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-20 w-20",
} as const;

export function BrandMark({
  size = "md",
  animated = false,
  className = "",
}: BrandMarkProps) {
  return (
    <motion.span
      className={`relative inline-flex shrink-0 items-center justify-center ${sizeMap[size]} ${className}`}
      animate={
        animated
          ? {
              y: [0, -2, 0],
              filter: [
                "drop-shadow(0 10px 20px rgb(var(--accent-rgb) / 0.18))",
                "drop-shadow(0 14px 26px rgb(var(--accent-rgb) / 0.34))",
                "drop-shadow(0 10px 20px rgb(var(--accent-rgb) / 0.18))",
              ],
            }
          : undefined
      }
      transition={
        animated
          ? { duration: 4.6, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      aria-hidden
    >
      <span className="pointer-events-none absolute inset-[8%] rounded-[28%] bg-[radial-gradient(circle,rgb(var(--accent-rgb)/0.22),transparent_72%)] blur-xl" />
      <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[28%] border border-accent/30 bg-[linear-gradient(180deg,rgb(255_255_255/0.94),rgb(241_245_249/0.9))] shadow-[inset_0_1px_0_rgb(255_255_255/0.92),0_18px_38px_-24px_rgb(30_41_59/0.2)] dark:bg-[linear-gradient(180deg,rgb(30_36_48/0.96),rgb(18_22_30/0.98))]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[10%] rounded-[24%] border border-accent/18"
        />
        <span className="relative -mt-[2%] font-display text-[56%] font-semibold uppercase tracking-[0.04em] text-zinc-800 drop-shadow-[0_1px_0_rgb(255_255_255/0.4)] dark:text-zinc-100">
          А
        </span>
      </span>
    </motion.span>
  );
}
