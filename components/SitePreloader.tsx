"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const SESSION_KEY = "ks_preloader_done_v5";
const FX_WORDS = [
  "УСПЕХ",
  "ДЕНЬГИ",
  "ДОХОД",
  "ПОБЕДА",
  "РЕЗУЛЬТАТ",
  "РОСТ",
] as const;
const MAX_MS = 5600;
const DOLLAR_MARKS = 12;

/** Показать сцену снова: открой главную с `?replayLoader` (например для проверки после деплоя). */
function wantsReplayLoader(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).has("replayLoader");
  } catch {
    return false;
  }
}

function getSkipSession(): boolean {
  if (typeof window === "undefined") return false;
  if (wantsReplayLoader()) return false;
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
 * Безликий белый боксёр (только силуэт + перчатки), удар по груше, взлёт $ и слов.
 * Portal в `document.body`, `html.site-preloader-active` скрывает #site-root.
 */
export function SitePreloader() {
  const [active, setActive] = useState(true);
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const boxerRef = useRef<HTMLDivElement>(null);
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
      const boxer = boxerRef.current;
      const fist = fistRef.current;
      const bag = bagRef.current;
      const fx = fxRef.current;
      if (!root || !box || !boxer || !fist || !bag || !fx) {
        endAndHide();
        return;
      }

      const vfxEls = fx.querySelectorAll<HTMLElement>(".pre-fx");
      if (vfxEls.length === 0) {
        endAndHide();
        return;
      }

      const vfxArr = Array.from(vfxEls);
      gsapTargetsRef.current = [root, box, boxer, fist, bag, ...vfxArr];

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
        const angle = (i / Math.max(vfxArr.length, 1)) * Math.PI * 2 + Math.random() * 0.5;
        const r = (isNarrow ? 0.5 : 1) * (140 + Math.random() * 240);
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r - 28, rot: 120 + Math.random() * 240 };
      };

      const fistBackX = isNarrow ? -56 : -88;
      const fistContactX = isNarrow ? 26 : 36;

      gsap.set(vfxArr, { x: 0, y: 0, scale: 0.75, opacity: 1, rotation: 0, transformOrigin: "50% 50%" });
      gsap.set(fist, {
        x: fistBackX,
        y: 6,
        scale: 1,
        rotation: -4,
        transformOrigin: "10% 90%",
      });
      gsap.set(boxer, { transformOrigin: "42% 92%", rotation: 0, x: 0, y: 0 });
      gsap.set(bag, { transformOrigin: "50% 2px", rotation: 0, x: 0, y: 0, scale: 1 });
      gsap.set([box], { transformOrigin: "50% 50%" });
      gsap.set(root, { autoAlpha: 1 });

      const tl = gsap.timeline();
      tl.fromTo(
        box,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }
      )
        /* груша до удара: раскачивание, не статика */
        .to(
          bag,
          { rotation: 5, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" },
          0.06
        )
        .addLabel("windup", ">-0.02")
        .to(
          boxer,
          { rotation: isNarrow ? -6 : -8, x: isNarrow ? -4 : -8, duration: 0.22, ease: "power2.in" },
          "windup"
        )
        .to(
          fist,
          { x: fistBackX - (isNarrow ? 4 : 10), y: 10, rotation: 2, duration: 0.2, ease: "sine.inOut" },
          "windup"
        )
        .addLabel("punch", ">0.02")
        .to(
          fist,
          {
            x: fistContactX,
            y: -2,
            rotation: isNarrow ? -10 : -12,
            scale: 1.12,
            duration: 0.1,
            ease: "power4.in",
          },
          "punch"
        )
        .to(
          boxer,
          { rotation: isNarrow ? 5 : 7, x: isNarrow ? 8 : 14, duration: 0.1, ease: "power2.in" },
          "punch+=0.02"
        )
        .addLabel("hit", "punch+=0.09")
        .to(
          bag,
          {
            rotation: isNarrow ? 18 : 22,
            x: isNarrow ? 8 : 12,
            y: 4,
            scaleX: 0.96,
            scaleY: 1.04,
            duration: 0.06,
            ease: "power1.in",
          },
          "hit"
        )
        .to(
          bag,
          { scaleX: 1, scaleY: 1, duration: 0.12, ease: "sine.out" },
          "hit+=0.06"
        )
        .to(
          bag,
          { rotation: -11, x: 4, duration: 0.14, ease: "sine.inOut" },
          "hit+=0.1"
        )
        .to(
          bag,
          { rotation: 6, x: 2, duration: 0.16, ease: "sine.inOut" },
          "hit+=0.2"
        )
        .to(
          bag,
          { rotation: -2.5, x: 0, y: 0, duration: 0.2, ease: "sine.inOut" },
          "hit+=0.3"
        )
        .to(
          bag,
          { rotation: 0, duration: 0.35, ease: "sine.out" },
          "hit+=0.45"
        )
        .to(
          fist,
          {
            x: isNarrow ? -18 : -28,
            y: 4,
            rotation: 0,
            scale: 1,
            duration: 0.28,
            ease: "power2.out",
          },
          "hit+=0.12"
        )
        .to(
          boxer,
          { rotation: 0, x: 0, y: 0, duration: 0.4, ease: "sine.inOut" },
          "hit+=0.1"
        );

      vfxArr.forEach((el, i) => {
        const b = burst(i);
        tl.to(
          el,
          {
            x: b.x,
            y: b.y,
            rotation: b.rot * (i % 2 ? 1 : -1),
            scale: 0.2 + Math.random() * 0.45,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          "hit"
        );
      });

      tl.to({}, { duration: 0.72 }).to(root, {
        autoAlpha: 0,
        duration: 0.52,
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
        <div className="flex items-end justify-center gap-1 sm:gap-2">
          {/* Силуэт: белый, безликий; акцент — только боксёрские перчатки */}
          <div ref={boxerRef} className="relative z-10 w-[5.4rem] shrink-0 sm:w-[6.5rem]">
            <div className="relative flex flex-col items-center">
              <div
                className="relative z-10 h-[2rem] w-[1.85rem] rounded-full bg-zinc-50 shadow-[0_0_0_1px_rgba(255,255,255,0.4),inset_0_-4px_10px_rgba(0,0,0,0.07)] sm:h-[2.35rem] sm:w-[2.05rem]"
                aria-hidden
              />
              <div className="h-1 w-px bg-zinc-200/80" aria-hidden />
              {/* Туловище: один цельный силуэт, без одежды/деталей */}
              <div
                className="-mt-px h-[3.1rem] w-[2.5rem] rounded-[1.15rem] bg-zinc-50 shadow-[0_0_0_1px_rgba(255,255,255,0.3),inset_0_-10px_14px_rgba(0,0,0,0.05)] sm:h-[3.5rem] sm:w-[2.7rem]"
                aria-hidden
              />
              {/* Пассивная рука — лишь силуэт, без отдельной «перчатки» в фокусе */}
              <div
                className="pointer-events-none absolute bottom-[0.4rem] left-0.5 h-9 w-2.5 -rotate-[20deg] rounded-full bg-zinc-100/85 sm:bottom-[0.45rem] sm:left-0 sm:h-10"
                aria-hidden
              />
            </div>
            <div
              ref={fistRef}
              className="absolute bottom-[0.45rem] left-[0.9rem] z-20 flex items-end will-change-transform sm:bottom-2.5 sm:left-5"
              aria-hidden
            >
              <div className="mb-0.5 h-2 w-8 origin-bottom-right -rotate-6 rounded-sm bg-zinc-50/95 sm:h-2.5 sm:w-9" />
              <div className="relative -ml-0.5 h-[1.7rem] w-[1.55rem] rounded-b-[1.1rem] rounded-t-md bg-zinc-50 shadow-[0_0_0_1px_rgba(0,0,0,0.14),inset_0_-4px_8px_rgba(0,0,0,0.12)] sm:h-[1.85rem] sm:w-[1.65rem]">
                <div className="absolute left-0.5 right-0.5 top-1.5 h-1.5 rounded-sm bg-gradient-to-b from-red-500 to-red-700" />
                <div className="absolute bottom-0.5 left-1 right-1 h-0.5 rounded-full bg-zinc-300/90" />
              </div>
            </div>
            <div
              className="pointer-events-none absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-1.5"
              aria-hidden
            >
              <div className="h-2.5 w-1.5 rounded-b-sm bg-zinc-100/70" />
              <div className="h-2.5 w-1.5 rounded-b-sm bg-zinc-100/70" />
            </div>
          </div>

          <div className="relative -ml-1 flex flex-col items-center sm:ml-0">
            <div ref={bagRef} className="will-change-transform">
              <div className="mx-auto mb-0.5 flex w-4 flex-col items-center sm:w-5" aria-hidden>
                <div className="h-0.5 w-4 rounded-sm bg-zinc-500 sm:w-5" />
                <div className="h-1 w-px bg-zinc-500" />
                <div className="h-0.5 w-2.5 rounded-sm bg-zinc-600" />
              </div>
              <div className="relative w-[3.6rem] overflow-hidden rounded-2xl border-2 border-emerald-500/45 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black shadow-[0_0_0_1px_rgb(16_185_129/0.2),0_0_28px_-6px_rgb(16_185_129/0.4),inset_0_-18px_22px_rgba(0,0,0,0.55)] sm:w-[4.2rem] sm:rounded-3xl">
                <div
                  className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.12)_2px,rgba(0,0,0,0.12)_3px)] opacity-50"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute left-0 right-0 top-0 h-1/3 bg-gradient-to-b from-white/6 to-transparent"
                  aria-hidden
                />
                <div
                  ref={fxRef}
                  className="absolute left-1/2 top-[40%] h-[60%] w-[92%] -translate-x-1/2 -translate-y-1/2"
                >
                  {FX_WORDS.map((word, i) => (
                    <span
                      key={word}
                      className="pre-fx font-display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] font-extrabold uppercase leading-none tracking-[0.16em] text-emerald-300/95 [text-shadow:0_0_12px_rgb(16_185_129/0.55)] sm:text-[8px] md:text-[9px]"
                      style={{ marginLeft: `${(i % 3) * 12 - 12}px`, marginTop: `${Math.floor(i / 3) * 9 - 6}px` }}
                    >
                      {word}
                    </span>
                  ))}
                  {Array.from({ length: DOLLAR_MARKS }, (_, i) => (
                    <span
                      key={i}
                      className="pre-fx font-mono font-black absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.7rem] leading-none text-amber-200/95 [text-shadow:0_0_8px_rgba(250,204,21,0.45)] sm:text-[0.85rem]"
                      style={{
                        marginLeft: `${(i - DOLLAR_MARKS / 2) * 4 + (i % 2) * 2}px`,
                        marginTop: `${(i % 4) * 2 - 3}px`,
                      }}
                      aria-hidden
                    >
                      $
                    </span>
                  ))}
                </div>
                <div className="relative aspect-[1/1.4] w-full" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, mountTarget);
}
