"use client";

import { useEffect } from "react";

/**
 * Плавные переходы по якорям на мобильных и везде, где Lenis отключён.
 * На десктопе с Lenis оставляем нативную обработку якорей библиотекой.
 */
export function AnchorSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldHandle = () => window.matchMedia("(max-width: 1023px)").matches;

    const onClick = (e: MouseEvent) => {
      if (!shouldHandle()) return;
      const target = (e.target as Element | null)?.closest?.("a[href^='#']");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;
      const id = href.slice(1);
      if (!/^[a-zA-Z0-9_-]+$/.test(id)) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
