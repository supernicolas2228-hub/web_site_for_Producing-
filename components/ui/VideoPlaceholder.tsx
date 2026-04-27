"use client";

export type VideoPlaceholderProps = {
  /** Краткое имя блока для screen reader */
  title?: string;
  overline?: string;
  headline?: string;
  description?: string;
  className?: string;
};

/** Кнопка в стиле YouTube — подсветка только при наведении на саму «кнопку» (группа group/btn) */
function FakeYoutubePlay() {
  return (
    <div className="relative" aria-hidden>
      <div
        className="absolute inset-[-18%] rounded-full bg-accent/40 opacity-0 blur-2xl transition-opacity duration-500 group-hover/btn:opacity-100 group-active/btn:opacity-100 [@media(hover:none)]:group-active/btn:opacity-100"
        aria-hidden
      />
      <div
        className="relative flex h-[4.35rem] w-[4.35rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f0d7ac] via-accent to-[#7e5932] shadow-[0_10px_40px_rgb(var(--accent-rgb)/0.42),inset_0_1px_0_rgba(255,255,255,0.35)] ring-2 ring-white/20 transition-transform duration-300 ease-out group-hover/btn:scale-105 group-active/btn:scale-95 sm:h-[4.85rem] sm:w-[4.85rem]"
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          className="ml-1 text-white drop-shadow-md"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Статичный блок 16:9: премиум-постер, градиенты, типографика — без iframe.
 */
export function VideoPlaceholder({
  title = "Видео",
  overline = "Видео",
  headline = "Видео",
  description = "Здесь позже появится запись. Актуальное — в соцсетях, ссылки внизу страницы.",
  className = "",
}: VideoPlaceholderProps) {
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-stroke/22 bg-gradient-to-br from-slate-100 via-slate-200/90 to-slate-300/80 shadow-plate ring-1 ring-accent/12 dark:border-white/10 dark:from-[#0c1016] dark:via-[#111820] dark:to-[#151e2a] dark:ring-accent/10 ${className}`}
      role="figure"
      aria-label={`${title}. Видео, воспроизведение отключено.`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_42%,#f1f5f9_100%)] opacity-95 dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_78%_55%_at_76%_14%,rgb(var(--accent-rgb)/0.24),transparent_55%)] dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_72%_60%_at_14%_88%,rgba(45,78,61,0.14),transparent_52%)] dark:hidden"
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/video-unavailable.svg"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover opacity-95 dark:block"
        decoding="async"
      />

      <div
        className="pointer-events-none absolute -right-[20%] -top-[30%] h-[85%] w-[85%] rounded-full bg-accent/24 blur-[100px] animate-placeholder-glow dark:bg-accent/22"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-[35%] -left-[25%] h-[70%] w-[70%] rounded-[50%] bg-[#355746]/16 blur-[90px] dark:bg-[#173026]/45"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-zinc-900/[0.07] dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-br from-accent/16 via-transparent to-black/50 dark:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_-5%,rgb(var(--accent-rgb)/0.18),transparent_52%)] dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_90%_65%_at_50%_-5%,rgb(var(--accent-rgb)/0.12),transparent_52%)] dark:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f7efe0] via-[#fbf8f1]/78 to-transparent dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-[#060b0a] via-[#0a120f]/88 to-transparent dark:block"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent opacity-90 dark:via-white/20"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] flex flex-col items-center px-6 pb-9 pt-24 text-center sm:px-10 sm:pb-10">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.32em] text-accent sm:text-[11px] [text-shadow:0_0_18px_rgb(var(--accent-rgb)/0.25)] dark:[text-shadow:0_0_28px_rgb(var(--accent-rgb)/0.38)]">
          {overline}
        </p>
        <div className="mx-auto mt-3 h-px w-16 max-w-[40%] bg-gradient-to-r from-transparent via-accent/90 to-transparent" aria-hidden />
        <h3 className="font-display mt-5 max-w-xl text-[clamp(1rem,2.8vw,1.5rem)] uppercase leading-[1.08] tracking-[0.06em] text-balance">
          <span className="text-zinc-900 dark:text-zinc-100 dark:[text-shadow:0_2px_20px_rgb(0_0_0/0.45)]">
            {headline}
          </span>
        </h3>
        <p className="font-body mt-4 max-w-md text-[13px] font-medium leading-[1.7] tracking-[-0.015em] text-zinc-900 antialiased sm:text-[15px] dark:text-zinc-100">
          {description}
        </p>
      </div>

      <div className="absolute inset-0 z-[2]">
        <div
          className="peer/btn group/btn pointer-events-auto absolute left-1/2 top-1/2 z-[3] flex h-[7rem] w-[7rem] -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center rounded-full sm:h-[8.5rem] sm:w-[8.5rem]"
          aria-hidden
        >
          <div
            className="opacity-0 transition-opacity duration-200 ease-out group-hover/btn:opacity-100 group-active/btn:opacity-100 [@media(hover:none)]:opacity-0 [@media(hover:none)]:group-active/btn:opacity-100"
            aria-hidden
          >
            <FakeYoutubePlay />
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[2] -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-[#f5e1bc]/55 to-transparent opacity-0 transition-opacity duration-500 animate-none peer-hover/btn:opacity-100 peer-hover/btn:animate-placeholder-shine dark:via-white/[0.05]"
          aria-hidden
        />
      </div>
    </div>
  );
}
