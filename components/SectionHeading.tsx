"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Props = {
  inView: boolean;
  className?: string;
  children: ReactNode;
  /** Вызывается один раз, когда секция попала в зону просмотра — для каскада анимаций ниже. */
  onAnimationComplete?: () => void;
};

/**
 * Заголовок сразу целиком в DOM (без fade-in), чтобы при копировании текста и автопереводе
 * не появлялись обрывки вроде «Кт», «Т» и пустых строк.
 */
export function SectionHeading({ inView, className = "", children, onAnimationComplete }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (!inView || fired.current) return;
    fired.current = true;
    queueMicrotask(() => onAnimationComplete?.());
  }, [inView, onAnimationComplete]);

  return (
    <h2 className={className} translate="no">
      {children}
    </h2>
  );
}
