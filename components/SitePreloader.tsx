"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const SESSION_KEY = "ks_preloader_done_v4";
const FX_WORDS = ["УСПЕХ", "ДЕНЬГИ", "ПОБЕДА", "РЕЗУЛЬТАТ", "РОСТ", "СИЛА"] as const;
const MAX_MS = 3600;
const COINS = 8;

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
        const r = (isNarrow ? 0.45 : 1) * (160 + Math.random() * 220);
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r - 22, rot: 140 + Math.random() * 220 };
      };

      gsap.set(vfxArr, { x: 0, y: 0, scale: 0.85, opacity: 1, rotation: 0, transformOrigin: "50% 50%" });
      gsap.set(fist, { x: isNarrow ? -44 : -72, transformOrigin: "20% 80%" });
      gsap.set(bag, { transformOrigin: "50% 2px", rotation: 0, x: 0, y: 0, scale: 1 });
      gsap.set([box], { transformOrigin: "50% 50%" });
      gsap.set(root, { autoAlpha: 1 });

      const idleSwing = 2.2;
      const tl = gsap.timeline();
      tl.fromTo(
        box,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.38, ease: "power2.out" }
      )
        .to(
          bag,
          { rotation: idleSwing, duration: 0.4, yoyo: true, repeat: 1, ease: "sine.inOut" },
          0.05
        )
        .addLabel("punch", 0.85)
        .to(
          bag,
          { rotation: -idleSwing * 0.6, duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" },
          "punch"
        )
        .to(
          fist,
          { x: isNarrow ? 8 : 12, y: 2, scale: 1.04, duration: 0.11, ease: "power3.in" },
          "punch+=0.25"
        )
        .to(
          bag,
          { rotation: 7, x: 6, y: 1, scale: 1.02, duration: 0.07, ease: "power2.in" },
          "punch+=0.28"
        )
        .addLabel("hit", "punch+=0.34")
        .to(
          bag,
          { rotation: -4.5, x: 3, y: 0, duration: 0.12, ease: "sine.inOut" },
          "hit"
        )
        .to(
          bag,
          { rotation: 2.2, y: 0, x: 0, duration: 0.1, ease: "sine.inOut" },
          "hit+=0.1"
        )
        .to(
          bag,
          { rotation: -0.6, y: 0, duration: 0.2, ease: "sine.inOut" },
          "hit+=0.2"
        )
        .to(
          bag,
          { rotation: 0, y: 0, x: 0, scale: 1, duration: 0.22, ease: "sine.out" },
          "hit+=0.35"
        )
        .to(
          fist,
          { x: isNarrow ? -18 : -32, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
          "hit+=0.12"
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
        <div className="flex items-end justify-center gap-0 sm:gap-1">
          {/* Белый силуэт: безликий, в перчатках */}
          <div className="relative z-10 w-[5.2rem] shrink-0 sm:w-[6.2rem]">
            <div className="relative flex flex-col items-center">
              {/* Голова — пустой эллипс, без черт лица */}
              <div
                className="relative z-10 h-[2.1rem] w-[1.9rem] rounded-full bg-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.35),inset_0_-6px_12px_rgba(0,0,0,0.08)] sm:h-[2.4rem] sm:w-[2.1rem]"
                aria-hidden
              />
              {/* Туловище */}
              <div
                className="-mt-0.5 h-[3.2rem] w-[2.4rem] rounded-[1.1rem] bg-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.25),inset_0_-10px_16px_rgba(0,0,0,0.06)] sm:h-[3.6rem] sm:w-[2.6rem]"
                aria-hidden
              />
              {/* Задняя рука (силуэт) */}
              <div
                className="pointer-events-none absolute bottom-[0.35rem] left-0.5 h-9 w-2.5 -rotate-[18deg] rounded-full bg-zinc-200/80 sm:bottom-1 sm:left-0 sm:h-10"
                aria-hidden
              />
            </div>
            {/* Ударная рука + перчатка (движется) */}
            <div
              ref={fistRef}
              className="absolute bottom-[0.5rem] left-[1.1rem] z-20 flex items-end will-change-transform sm:bottom-2 sm:left-[1.35rem]"
              aria-hidden
            >
              <div className="mb-0.5 h-2 w-7 origin-right -rotate-6 rounded-sm bg-zinc-100/90 sm:h-2.5 sm:w-8" />
              <div className="relative -ml-0.5 h-[1.6rem] w-[1.45rem] rounded-b-xl rounded-t-md bg-zinc-50 shadow-[0_0_0_1px_rgba(0,0,0,0.12),inset_0_-4px_6px_rgba(0,0,0,0.15)] sm:h-[1.75rem] sm:w-[1.6rem]">
                <div className="absolute left-0.5 right-0.5 top-1.5 h-1.5 rounded-sm bg-gradient-to-b from-red-500 to-red-700 sm:top-1.5" />
                <div className="absolute bottom-0.5 left-1 right-1 h-0.5 rounded-full bg-zinc-300/80" />
              </div>
            </div>
            {/* Бёдра/стойка (лёгкий силуэт) */}
            <div
              className="pointer-events-none absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-1.5"
              aria-hidden
            >
              <div className="h-3 w-1.5 rounded-b-md bg-zinc-100/60 sm:h-3.5" />
              <div className="h-3 w-1.5 rounded-b-md bg-zinc-100/60 sm:h-3.5" />
            </div>
          </div>

          <div className="relative -ml-1.5 flex flex-col items-center sm:-ml-0">
            {/* Крепёж + груша: качается вокруг верхней точки */}
            <div ref={bagRef} className="will-change-transform">
              <div
                className="mx-auto mb-0.5 flex w-4 flex-col items-center sm:w-5"
                aria-hidden
              >
                <div className="h-0.5 w-4 rounded-sm bg-zinc-500 sm:w-5" />
                <div className="h-1 w-px bg-zinc-500" />
                <div className="h-0.5 w-2.5 rounded-sm bg-zinc-600" />
              </div>
              <div className="relative w-[3.5rem] overflow-hidden rounded-2xl border-2 border-emerald-500/45 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black shadow-[0_0_0_1px_rgb(16_185_129/0.2),0_0_28px_-6px_rgb(16_185_129/0.4),inset_0_-18px_22px_rgba(0,0,0,0.55)] sm:w-[4.1rem] sm:rounded-3xl">
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
                  {FX_WORDS.map((w, i) => (
                    <span
                      key={w}
                      className="pre-fx font-display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] font-extrabold uppercase leading-none tracking-[0.16em] text-emerald-300/95 [text-shadow:0_0_12px_rgb(16_185_129/0.55)] sm:text-[8px] md:text-[9px]"
                      style={{ marginLeft: `${(i % 3) * 14 - 14}px`, marginTop: `${Math.floor(i / 3) * 10 - 8}px` }}
                    >
                      {w}
                    </span>
                  ))}
                  {Array.from({ length: COINS }, (_, i) => (
                    <span
                      key={i}
                      className="pre-fx absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-base leading-none sm:text-lg"
                      style={{
                        marginLeft: `${(i - COINS / 2) * 5}px`,
                        marginTop: `${(i % 4) * 3 - 4}px`,
                      }}
                      aria-hidden
                    >
                      💵
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
