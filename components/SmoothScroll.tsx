"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Плавная прокрутка вверх/вниз. ResizeObserver вызывает lenis.resize() при смене высоты
 * (тайпрайтер, аккордеон, картинки) — иначе после скролла в конец инерция «отваливается».
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
      // syncTouch часто ломает плавность у верхнего/нижнего края при жестах
      syncTouch: false,
      anchors: true,
      overscroll: true,
      autoResize: true,
    });

    let resizeRaf = 0;
    const scheduleResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        lenis.resize();
      });
    };

    const ro = new ResizeObserver(scheduleResize);
    ro.observe(document.body);

    const onVisibility = () => {
      if (!document.hidden) scheduleResize();
    };

    const onPageShow = () => scheduleResize();

    window.addEventListener("resize", scheduleResize);
    window.addEventListener("orientationchange", scheduleResize);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);

    // Контент после первого кадра (шрифты, картинки)
    requestAnimationFrame(scheduleResize);
    const delayed = window.setTimeout(scheduleResize, 350);

    return () => {
      window.clearTimeout(delayed);
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("orientationchange", scheduleResize);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
    };
  }, []);

  return null;
}
