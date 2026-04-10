"use client";

import { motion } from "framer-motion";
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
              y: -6,
              boxShadow:
                "var(--shadow-plate), var(--shadow-lift), 0 0 0 1px var(--ring-accent)",
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={`rounded-xl border border-stroke/18 bg-white/75 p-6 shadow-plate backdrop-blur-xl dark:border-white/20 dark:bg-black/50 ${className}`}
    >
      {children}
    </motion.div>
  );
}
