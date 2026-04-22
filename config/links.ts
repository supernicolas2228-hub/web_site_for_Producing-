/**
 * Внешние ссылки. Задайте в .env / Vercel переменные NEXT_PUBLIC_* — тогда подставятся реальные URL.
 * Иначе строки с REPLACE_ME превращаются в "#" (клик не уводит на битый адрес).
 */
const PLACEHOLDER = "REPLACE_ME";

function scrub(url: string): string {
  return url.includes(PLACEHOLDER) ? "#" : url;
}

function pick(envKey: string, fallback: string): string {
  const v = process.env[envKey]?.trim();
  return v && v.length > 0 ? v : fallback;
}

const raw = {
  productYoutubeShort: pick("NEXT_PUBLIC_PRODUCT_YOUTUBE_URL", `https://www.youtube.com/watch?v=${PLACEHOLDER}`),
  joinSellIsLife: pick("NEXT_PUBLIC_PAY_OR_JOIN_URL", `https://pay.${PLACEHOLDER}`),
  telegramReviews: pick("NEXT_PUBLIC_TELEGRAM_REVIEWS_URL", `https://t.me/${PLACEHOLDER}`),
  telegram: pick("NEXT_PUBLIC_TELEGRAM_URL", `https://t.me/${PLACEHOLDER}`),
  youtube: pick("NEXT_PUBLIC_YOUTUBE_URL", `https://youtube.com/@${PLACEHOLDER}`),
  instagram: pick("NEXT_PUBLIC_INSTAGRAM_URL", `https://instagram.com/${PLACEHOLDER}`),
  vk: pick("NEXT_PUBLIC_VK_URL", `https://vk.com/${PLACEHOLDER}`),
} as const;

export const links = {
  productYoutubeShort: scrub(raw.productYoutubeShort),
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
