"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { hero } from "@/config/content";

/** Смена суффикса — снова показать заставку всем (после деплоя со старым sessionStorage). */
const STORAGE_KEY = "ks_preloader_v3";
const MAX_MS = 3000;
const PUNCH_WORDS = ["УСПЕХ", "ДЕНЬГИ", "ПОБЕДА", "РЕЗУЛЬТАТ"] as const;
const COINS = ["💰", "💰", "💰", "💰", "💰", "💰"] as const;

export function SitePreloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduced = useRef(false);
  const done = useRef(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("intro") === "1") {
      sessionStorage.removeItem(STORAGE_KEY);
      try {
        const u = new URL(window.location.href);
        u.searchParams.delete("intro");
        window.history.replaceState({}, "", u.pathname + u.search + u.hash);
      } catch {
        /* ignore */
      }
    }
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setVisible(false);
      setActive(false);
      return;
    }
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active || !rootRef.current || done.current) return;

    const root = rootRef.current;
    const box = boxRef.current;
    const burst = burstRef.current;
    if (!box || !burst) return;

    let tl: gsap.core.Timeline | null = null;
    let hardStop = 0;

    const finish = () => {
      if (done.current) return;
      done.current = true;
      window.clearTimeout(hardStop);
      gsap.to(root, {
        opacity: 0,
        duration: reduced.current ? 0.2 : 0.55,
        ease: "power2.inOut",
        onComplete: () => {
          setVisible(false);
          setActive(false);
          sessionStorage.setItem(STORAGE_KEY, "1");
          document.body.style.removeProperty("overflow");
        },
      });
    };

    hardStop = window.setTimeout(() => {
      if (done.current) return;
      finish();
    }, MAX_MS);

    document.body.style.overflow = "hidden";

    if (reduced.current) {
      const soft = window.setTimeout(finish, 400);
      return () => {
        window.clearTimeout(soft);
        window.clearTimeout(hardStop);
        document.body.style.removeProperty("overflow");
      };
    }

    const particles = burst.querySelectorAll<HTMLElement>(".preloader-burst-item");

    tl = gsap.timeline({
      onComplete: () => {
        window.setTimeout(finish, 200);
      },
    });
    gsap.set(box, { transformOrigin: "50% 60%", scale: 0.88, y: 18 });
    gsap.set(particles, { x: 0, y: 0, scale: 0.2, opacity: 0, rotation: 0 });

    tl.to(box, { scale: 1.1, y: 0, duration: 0.18, ease: "power2.out" }, 0);
    tl.to(
      box,
      {
        x: 8,
        rotation: 2,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      },
      0.12
    );
    tl.to(box, { scale: 1, x: 0, rotation: 0, duration: 0.2, ease: "power2.out" }, 0.32);
    tl.to(
      particles,
      {
        opacity: 1,
        scale: 1,
        duration: 0.05,
        stagger: 0.02,
        ease: "none",
      },
      0.4
    );
    tl.to(
      particles,
      {
        x: (i) => (i % 2 === 0 ? 1 : -1) * (80 + (i * 37) % 120),
        y: (i) => -40 - (i * 23) % 100,
        rotation: (i) => (i - 2.5) * 25,
        opacity: 0,
        scale: 1.4,
        duration: 0.75,
        ease: "power3.out",
        stagger: { each: 0.03, from: "center" },
      },
      0.42
    );
    tl.to(
      box,
      {
        scale: 0.95,
        opacity: 0.5,
        duration: 0.25,
        ease: "power2.in",
      },
      0.9
    );

    return () => {
      window.clearTimeout(hardStop);
      tl?.kill();
      document.body.style.removeProperty("overflow");
    };
  }, [active]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="site-preloader fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-zinc-950"
      data-preloader
      role="status"
      aria-live="polite"
      aria-label="Загрузка"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgb(4_120_72/0.25),transparent_70%)]" />
      <div
        ref={burstRef}
        className="relative flex min-h-[min(52vh,420px)] w-full max-w-lg flex-col items-center justify-center px-6"
      >
        {PUNCH_WORDS.map((w) => (
          <span
            key={w}
            className="preloader-burst-item pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400 [text-shadow:0_0_24px_rgb(52_211_153/0.5)] sm:text-sm"
          >
            {w}
          </span>
        ))}
        {COINS.map((c, i) => (
          <span
            key={i}
            className="preloader-burst-item pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl"
            aria-hidden
          >
            {c}
          </span>
        ))}
        <div ref={boxRef} className="relative z-10 w-[min(78vw,280px)] sm:w-[min(70vw,320px)]">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-emerald-500/60 bg-black shadow-[0_0_48px_-8px_rgb(52_211_153/0.5),inset_0_0_0_1px_rgb(255_255_255/0.08)]">
            <Image
              src={hero.portraitSrc}
              alt=""
              fill
              className="object-cover object-[center_22%]"
              sizes="320px"
              priority
            />
          </div>
        </div>
        <p className="mt-6 font-display text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500">
          Система и доход
        </p>
      </div>
    </div>
  );
}
