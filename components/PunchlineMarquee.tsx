"use client";

import { EmojiTone } from "@/components/EmojiTone";

type Props = {
  /** Полный панчлайн; режется на две «ноты» по первой точке */
  text: string;
  className?: string;
};

function splitPunchline(text: string): readonly [string, string] {
  const trimmed = text.trim();
  const dot = trimmed.indexOf(".");
  if (dot === -1 || dot >= trimmed.length - 2) {
    return [trimmed, trimmed] as const;
  }
  const a = trimmed.slice(0, dot + 1).trim();
  const b = trimmed.slice(dot + 1).trim();
  return b ? ([a, b] as const) : ([trimmed, trimmed] as const);
}

/**
 * Бесконечная бегущая лента с панчлайном — в духе «лендингов с лентой», без лишнего шума.
 */
export function PunchlineMarquee({ text, className = "" }: Props) {
  const [first, second] = splitPunchline(text);

  const segments = [
    { key: "a", node: first },
    { key: "b", node: second },
  ] as const;

  const looped = [...segments, ...segments, ...segments, ...segments];
  const doubled = [...looped, ...looped];

  return (
    <div
      className={`border-y border-accent/25 bg-gradient-to-r from-band/90 via-[#efe4cf] to-band/90 backdrop-blur-md dark:border-accent/35 dark:from-black/45 dark:via-[#1a201b] dark:to-black/45 ${className}`}
    >
      <p className="sr-only">{text}</p>

      <div className="motion-reduce:flex hidden flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-4 text-center">
        <span className="font-display text-sm font-bold uppercase leading-snug tracking-wide text-zinc-800 dark:text-zinc-200">
          <EmojiTone className="mr-2 align-[-0.12em] text-lg">💡</EmojiTone>
          {first} {second}
        </span>
      </div>

      <div className="motion-reduce:hidden relative overflow-hidden py-4 sm:py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-band to-transparent dark:from-page sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-band to-transparent dark:from-page sm:w-24" />

        <div className="flex w-max animate-marquee-slow motion-reduce:animate-none">
          {doubled.map((seg, i) => (
            <span
              key={`${seg.key}-${i}`}
              className="mx-4 inline-flex shrink-0 items-center gap-3 sm:mx-8"
            >
              <EmojiTone className="shrink-0 text-lg sm:text-xl" aria-hidden>
                💡
              </EmojiTone>
              <span className="font-display text-[11px] font-bold uppercase leading-tight tracking-[0.2em] text-zinc-800 sm:text-xs md:text-[13px] dark:text-zinc-200">
                {seg.node}
              </span>
              <span className="font-display text-accent/50 sm:text-sm" aria-hidden>
                —
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
