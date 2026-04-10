"use client";

import { EmojiTone } from "@/components/EmojiTone";

type Props = {
  phrases: readonly string[];
};

export function HeroMarquee({ phrases }: Props) {
  if (!phrases.length) return null;

  const looped = [...phrases, ...phrases];

  return (
    <div
      className="mt-10 border-y border-stroke/15 bg-band/40 backdrop-blur-sm dark:border-white/10 dark:bg-black/25 sm:mt-14"
      aria-hidden
    >
      {/* Статичная лента при prefers-reduced-motion */}
      <div className="motion-reduce:flex hidden flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3.5 text-center sm:gap-x-8">
        {phrases.map((p) => (
          <span
            key={p}
            className="whitespace-nowrap font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:text-white sm:text-xs"
          >
            <EmojiTone className="mr-1.5">⚡</EmojiTone>
            {p}
          </span>
        ))}
      </div>

      <div className="motion-reduce:hidden relative overflow-hidden py-3.5">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {looped.map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="mx-5 shrink-0 whitespace-nowrap font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:text-white sm:mx-8 sm:text-xs"
            >
              <EmojiTone className="mr-1.5">⚡</EmojiTone>
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
