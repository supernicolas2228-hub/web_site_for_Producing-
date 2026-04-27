"use client";

import { motion } from "framer-motion";
import { springHoverStrong } from "@/lib/motion";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      initial={false}
      whileHover={
        hover
          ? {
              y: -5,
              boxShadow:
                "var(--shadow-plate), var(--shadow-lift), 0 0 0 1px var(--ring-accent)",
            }
          : undefined
      }
      transition={springHoverStrong}
      className={`ornate-frame relative overflow-hidden rounded-[1.5rem] border border-stroke/18 bg-white/55 p-6 shadow-plate backdrop-blur-xl dark:border-white/12 dark:bg-white/5 ${className}`}
    >
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgb(var(--accent-rgb)/0.08),transparent_48%)]"
        aria-hidden
      />
      {children}
    </motion.div>
  );
}
