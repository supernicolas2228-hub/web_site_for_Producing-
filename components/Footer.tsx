import { site } from "@/config/content";
import { BrandMark } from "@/components/BrandMark";
import { links } from "@/config/links";
import { SafeOutboundLink } from "@/components/SafeOutboundLink";

export function Footer() {
  const year = new Date().getFullYear();
  const linkClass =
    "text-sm uppercase tracking-[0.16em] text-zinc-700 transition hover:text-accent dark:text-zinc-300 dark:hover:text-zinc-100";

  return (
    <footer className="border-t border-stroke/15 bg-surface-muted/35 py-12 backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark size="md" />
            <p className="font-display text-2xl uppercase tracking-[0.22em] text-zinc-900 dark:text-zinc-100">
              {site.name}
            </p>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {site.tagline}
          </p>
          {site.legalEntity?.trim() ? (
            <p className="mt-3 max-w-lg text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
              {site.legalEntity.trim()}
            </p>
          ) : null}
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
            © {year} {site.name}. Личный стиль работы.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-display text-sm uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-500">
            Контакты и площадки
          </span>
          <div className="flex flex-wrap gap-4">
            <SafeOutboundLink href={links.telegram} className={linkClass}>
              Telegram
            </SafeOutboundLink>
            <SafeOutboundLink href={links.youtube} className={linkClass}>
              YouTube
            </SafeOutboundLink>
            <SafeOutboundLink href={links.vk} className={linkClass}>
              VK
            </SafeOutboundLink>
            <SafeOutboundLink href={links.instagram} className={linkClass}>
              Instagram
            </SafeOutboundLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
