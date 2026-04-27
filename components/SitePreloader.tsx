"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const SESSION_KEY = "ks_preloader_done_v2";
const FX_WORDS = ["УСПЕХ", "ДЕНЬГИ", "ПОБЕДА", "РЕЗУЛЬТАТ"] as const;
const MAX_MS = 3000;
const COINS = 6;

function getSkipSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markDone() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function prefersReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function whenDomReady(fn: () => void) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }
}

/**
 * Удар по груше + взрыв текста. Рендер через portal в `document.body`, плюс
 * `html.site-preloader-active` скрывает #site-root — иначе next/image (Hero) в
 * части WebView/браузеров рисуется поверх z-index портала.
 */
export function SitePreloader() {
  const [active, setActive] = useState(true);
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const fistRef = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const safetyRef = useRef(0);
  const killedRef = useRef(false);
  const gsapTargetsRef = useRef<Element[]>([]);

  useLayoutEffect(() => {
    if (getSkipSession()) {
      setActive(false);
      return;
    }
    if (typeof document === "undefined") return;
    /* До setState: чтобы первый кадр после гидратации не показывал Hero поверх. */
    document.documentElement.classList.add("site-preloader-active");
    setMountTarget(document.body);
  }, []);

  useLayoutEffect(() => {
    if (!active) {
      document.documentElement.classList.remove("site-preloader-active");
    }
    return () => {
      document.documentElement.classList.remove("site-preloader-active");
    };
  }, [active]);

  useLayoutEffect(() => {
    if (!active || !mountTarget) return;

    killedRef.current = false;
    const elHtml = document.documentElement;
    const elBody = document.body;
    const prevBodyOverflow = elBody.style.overflow;
    const prevHtmlOverflow = elHtml.style.overflow;
    const unlock = () => {
      elBody.style.overflow = prevBodyOverflow;
      elHtml.style.overflow = prevHtmlOverflow;
    };

    const endAndHide = (clearT = true) => {
      if (clearT) window.clearTimeout(safetyRef.current);
      markDone();
      unlock();
      if (!killedRef.current) setActive(false);
    };

    const run = () => {
      if (killedRef.current) return;
      const root = rootRef.current;
      const box = boxRef.current;
      const fist = fistRef.current;
      const bag = bagRef.current;
      const fx = fxRef.current;
      if (!root || !box || !fist || !bag || !fx) {
        endAndHide();
        return;
      }

      const vfxEls = fx.querySelectorAll<HTMLElement>(".pre-fx");
      if (vfxEls.length === 0) {
        endAndHide();
        return;
      }

      const vfxArr = Array.from(vfxEls);
      gsapTargetsRef.current = [root, box, fist, bag, ...vfxArr];

      const lock = () => {
        elBody.style.overflow = "hidden";
        elHtml.style.overflow = "hidden";
      };
      lock();

      safetyRef.current = window.setTimeout(() => {
        try {
          gsap.killTweensOf(gsapTargetsRef.current);
        } catch {
          /* ignore */
        }
        gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
        endAndHide();
      }, MAX_MS);

      if (prefersReduced()) {
        gsap
          .timeline()
          .to(root, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" })
          .add(() => endAndHide());
        return;
      }

      const w = window.innerWidth;
      const isNarrow = w < 640;
      const burst = (i: number) => {
        const angle = (i / vfxArr.length) * Math.PI * 2 + Math.random() * 0.45;
        const r = (isNarrow ? 0.45 : 1) * (150 + Math.random() * 200);
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r - 18, rot: 140 + Math.random() * 220 };
      };

      gsap.set(vfxArr, { x: 0, y: 0, scale: 0.9, opacity: 1, rotation: 0, transformOrigin: "50% 50%" });
      gsap.set(fist, { x: isNarrow ? -56 : -88, transformOrigin: "100% 50%" });
      gsap.set(bag, { transformOrigin: "50% 70%", rotation: 0, x: 0, y: 0, scale: 1 });
      gsap.set([box], { transformOrigin: "50% 50%" });
      gsap.set(root, { autoAlpha: 1 });

      const tl = gsap.timeline();
      tl.fromTo(
        box,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
      )
        .to(fist, { x: 6, scale: 1.15, duration: 0.12, ease: "power4.in" }, "punch")
        .to(
          bag,
          { rotation: 5, x: 8, scale: 1.04, duration: 0.08, ease: "power2.in" },
          "punch"
        )
        .addLabel("hit", "punch+=0.06")
        .to(
          bag,
          { rotation: -3, x: 4, scale: 1, duration: 0.1, ease: "sine.inOut" },
          "hit"
        )
        .to(
          bag,
          { rotation: 0, x: 0, y: 0, duration: 0.14, ease: "sine.out" },
          "hit+=0.08"
        )
        .to(
          fist,
          { x: isNarrow ? -28 : -40, scale: 1, duration: 0.18, ease: "power2.out" },
          "hit+=0.04"
        );

      vfxArr.forEach((el, i) => {
        const b = burst(i);
        tl.to(
          el,
          {
            x: b.x,
            y: b.y,
            rotation: b.rot * (i % 2 ? 1 : -1),
            scale: 0.3 + Math.random() * 0.35,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "hit"
        );
      });

      tl.to({}, { duration: 0.75 }).to(root, {
        autoAlpha: 0,
        duration: 0.55,
        ease: "power2.inOut",
        onComplete: () => {
          window.clearTimeout(safetyRef.current);
          markDone();
          unlock();
          if (!killedRef.current) setActive(false);
        },
      });
    };

    whenDomReady(run);

    return () => {
      killedRef.current = true;
      window.clearTimeout(safetyRef.current);
      try {
        if (gsapTargetsRef.current.length) gsap.killTweensOf(gsapTargetsRef.current);
      } catch {
        /* ignore */
      }
      gsapTargetsRef.current = [];
      elBody.style.overflow = prevBodyOverflow;
      elHtml.style.overflow = prevHtmlOverflow;
    };
  }, [active, mountTarget]);

  if (!active) return null;
  if (typeof document === "undefined" || !mountTarget) return null;

  const overlay = (
    <div
      ref={rootRef}
      data-site-preloader="true"
      className="site-preloader pointer-events-auto fixed inset-0 isolate z-[2147483000] flex max-h-dvh w-full max-w-[100vw] items-center justify-center overflow-hidden bg-black [contain:layout_style_paint] will-change-transform transform-gpu [transform:translateZ(0)]"
      style={{ zIndex: 2147483000, isolation: "isolate" as const }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Загрузка"
    >
      <div
        ref={boxRef}
        className="relative flex flex-col items-center justify-center px-4"
        suppressHydrationWarning
      >
        <div className="flex items-end justify-center gap-0.5 sm:gap-1">
          <div
            ref={fistRef}
            className="relative z-20 select-none text-[3.2rem] leading-none sm:text-[4.2rem] motion-reduce:scale-100"
            aria-hidden
            style={{ filter: "drop-shadow(0 0 10px rgba(16,185,129,0.25))" }}
          >
            🥊
          </div>

          <div className="relative -ml-0.5 flex flex-col items-center sm:-ml-0">
            <div
              className="mb-0.5 h-2.5 w-7 rounded-sm bg-gradient-to-b from-zinc-600 to-zinc-800 sm:h-3 sm:w-8"
              aria-hidden
            />
            <div className="h-1 w-0.5 bg-zinc-500 sm:w-px" aria-hidden />
            <div
              ref={bagRef}
              className="relative w-[4.4rem] overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black shadow-[0_0_0_1px_rgb(16_185_129/0.15),0_0_32px_-8px_rgb(16_185_129/0.35),inset_0_-20px_24px_rgba(0,0,0,0.5)] sm:w-[5.2rem] sm:rounded-3xl"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.12)_2px,rgba(0,0,0,0.12)_3px)] opacity-50"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-0 right-0 top-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent"
                aria-hidden
              />
              <div
                ref={fxRef}
                className="absolute left-1/2 top-[38%] h-[58%] w-[90%] -translate-x-1/2 -translate-y-1/2"
              >
                {FX_WORDS.map((w, i) => (
                  <span
                    key={w}
                    className="pre-fx font-display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-emerald-300/95 [text-shadow:0_0_16px_rgb(16_185_129/0.5)] sm:text-[10px] md:text-xs"
                    style={{ marginLeft: `${(i % 2) * 20 - 10}px`, marginTop: `${Math.floor(i / 2) * 16 - 8}px` }}
                  >
                    {w}
                  </span>
                ))}
                {Array.from({ length: COINS }, (_, i) => (
                  <span
                    key={i}
                    className="pre-fx emoji-tone absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg sm:text-xl"
                    style={{
                      marginLeft: `${(i - COINS / 2) * 6}px`,
                      marginTop: `${(i % 3) * 4}px`,
                    }}
                    aria-hidden
                  >
                    💰
                  </span>
                ))}
              </div>
              <div className="relative aspect-[1/1.45] w-full" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, mountTarget);
}
