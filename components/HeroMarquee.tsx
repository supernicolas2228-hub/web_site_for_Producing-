"use client";

type Props = {
  phrases: readonly string[];
};

export function HeroMarquee({ phrases }: Props) {
  if (!phrases.length) return null;

  const looped = [...phrases, ...phrases];

  return (
    <div
      className="mt-10 border-y border-stroke/15 bg-band/28 backdrop-blur-sm dark:border-white/10 dark:bg-black/18 sm:mt-14"
      aria-hidden
    >
      {/* Статичная лента при prefers-reduced-motion */}
      <div className="motion-reduce:flex hidden flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3.5 text-center sm:gap-x-8">
        {phrases.map((p) => (
          <span
            key={p}
            className="whitespace-nowrap font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400 sm:text-xs"
          >
            {p}
          </span>
        ))}
      </div>

      <div className="motion-reduce:hidden relative overflow-hidden py-3.5">
        <div className="flex w-max animate-marquee-slow motion-reduce:animate-none">
          {looped.map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="mx-6 shrink-0 whitespace-nowrap font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400 sm:mx-10 sm:text-xs"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
