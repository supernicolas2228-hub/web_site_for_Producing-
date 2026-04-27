/**
 * Внешние ссылки: 1) .env NEXT_PUBLIC_*  2) config/public-urls.ts  3) заглушка → "#".
 */
import { publishedUrls } from "@/config/public-urls";

const PLACEHOLDER = "REPLACE_ME";

function scrub(url: string): string {
  return url.includes(PLACEHOLDER) ? "#" : url;
}

function pick(envKey: string, fromFile: string, fallback: string): string {
  const v = process.env[envKey]?.trim();
  if (v) return v;
  const f = fromFile?.trim();
  if (f) return f;
  return fallback;
}

/** Ссылка на отдельный продукт (лендинг, курс, другой сайт): env важнее файла */
function pickProductUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_PRODUCT_URL?.trim() || process.env.NEXT_PUBLIC_PRODUCT_YOUTUBE_URL?.trim();
  if (fromEnv) return fromEnv;
  const fromFile = publishedUrls.productYoutube?.trim();
  if (fromFile) return fromFile;
  return `https://www.youtube.com/watch?v=${PLACEHOLDER}`;
}

const raw = {
  product: pickProductUrl(),
  joinSellIsLife: pick("NEXT_PUBLIC_PAY_OR_JOIN_URL", publishedUrls.payOrJoin, `https://pay.${PLACEHOLDER}`),
  telegramReviews: pick(
    "NEXT_PUBLIC_TELEGRAM_REVIEWS_URL",
    publishedUrls.telegramReviews,
    `https://t.me/${PLACEHOLDER}`,
  ),
  telegram: pick("NEXT_PUBLIC_TELEGRAM_URL", publishedUrls.telegram, `https://t.me/${PLACEHOLDER}`),
  youtube: pick("NEXT_PUBLIC_YOUTUBE_URL", publishedUrls.youtube, `https://youtube.com/@${PLACEHOLDER}`),
  instagram: pick("NEXT_PUBLIC_INSTAGRAM_URL", publishedUrls.instagram, `https://instagram.com/${PLACEHOLDER}`),
  vk: pick("NEXT_PUBLIC_VK_URL", publishedUrls.vk, `https://vk.com/${PLACEHOLDER}`),
} as const;

export const links = {
  /** Внешний проект / продукт */
  product: scrub(raw.product),
  /** @deprecated то же, что `product` */
  productYoutubeShort: scrub(raw.product),
  joinSellIsLife: scrub(raw.joinSellIsLife),
  telegramReviews: scrub(raw.telegramReviews),
  telegram: scrub(raw.telegram),
  youtube: scrub(raw.youtube),
  instagram: scrub(raw.instagram),
  vk: scrub(raw.vk),
} as const;

export function isPlaceholderLink(href: string): boolean {
  return !href || href === "#";
}
