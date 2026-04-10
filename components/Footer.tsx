import { site } from "@/config/content";
import { links } from "@/config/links";
import { SafeOutboundLink } from "@/components/SafeOutboundLink";

export function Footer() {
  const year = new Date().getFullYear();
  const linkClass = "text-zinc-700 hover:text-accent dark:text-white";

  return (
    <footer className="border-t border-stroke/15 bg-surface-muted/60 py-12 backdrop-blur-xl dark:border-white/10 dark:bg-black/35">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div>
          <p className="font-display text-2xl uppercase tracking-wide text-zinc-900 dark:text-white">
            {site.name}
          </p>
          <p className="mt-3 max-w-md text-sm text-zinc-600 dark:text-white">
            © {year} {site.name}. Все права защищены.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-semibold uppercase tracking-wide text-zinc-500 dark:text-white">
            Соцсети
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
