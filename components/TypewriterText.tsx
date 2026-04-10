"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type TypoTag = "h1" | "h2" | "h3" | "p" | "span";

type Props = {
  as?: TypoTag;
  text: string;
  className?: string;
  /** Палочка набора: для градиентного текста задайте цвет явно (по умолчанию bg-current). */
  caretClassName?: string;
  /** Печать начинается только когда true (например hero после mount или секция в viewport) */
  start?: boolean;
  /** Средняя пауза между символами, мс (ниже — быстрее). Реальный вывод идёт через rAF, без дёрганья таймера. */
  speedMs?: number;
  showCursor?: boolean;
  onComplete?: () => void;
};

/**
 * Текст набирается по буквам; невидимый дубликат держит переносы и высоту блока.
 * requestAnimationFrame + накопление долей символа даёт более плавный поток, чем setInterval.
 */
export function TypewriterText({
  as: Tag = "span",
  text,
  className = "",
  caretClassName = "bg-current",
  start = false,
  speedMs = 11,
  showCursor = true,
  onComplete,
}: Props) {
  const [displayed, setDisplayed] = useState("");
  const reduceMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!start) {
      setDisplayed("");
      return;
    }
    if (!text) {
      setDisplayed("");
      queueMicrotask(() => onCompleteRef.current?.());
      return;
    }

    if (reduceMotion) {
      queueMicrotask(() => {
        setDisplayed(text);
        onCompleteRef.current?.();
      });
      return;
    }

    setDisplayed("");
    const perCharMs = Math.max(4, speedMs);
    let i = 0;
    let acc = 0;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt / perCharMs;
      const steps = Math.min(Math.floor(acc), text.length - i);
      acc -= steps;
      if (steps > 0) {
        i += steps;
        const next = text.slice(0, i);
        setDisplayed(next);
      }
      if (i < text.length) {
        raf = requestAnimationFrame(tick);
      } else {
        acc = 0;
        onCompleteRef.current?.();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, text, speedMs, reduceMotion]);

  const typing = displayed.length < text.length;
  const showCaret = showCursor && start && text.length > 0 && typing;

  return (
    <Tag className={`grid ${className}`.trim()} aria-live="polite">
      <span
        className="invisible col-start-1 row-start-1 select-none [word-break:break-word]"
        aria-hidden
      >
        {text}
      </span>
      <span className="col-start-1 row-start-1 [word-break:break-word] transition-[opacity] duration-150 ease-out">
        {displayed}
        {showCaret ? (
          <span
            className={`ml-0.5 inline-block min-h-[1em] w-[3px] translate-y-px rounded-[1px] align-baseline opacity-80 animate-typewriter-caret motion-reduce:animate-none motion-reduce:opacity-60 ${caretClassName}`}
            aria-hidden
          />
        ) : null}
      </span>
    </Tag>
  );
}
