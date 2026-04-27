"use client";

import { useEffect } from "react";

/**
 * Плавная прокрутка к якорям (#section) там, где нет Lenis (мобильные, WebView).
 */
export function AnchorSmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const el = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!el) return;
      const href = el.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      if (!id || id.includes("/")) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
