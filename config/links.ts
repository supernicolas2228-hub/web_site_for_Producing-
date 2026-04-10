/**
 * Внешние ссылки. Пока в шаблоне есть REPLACE_ME, в интерфейсе подставляется "#"
 * — без переходов на несуществующие домены и битые short link (в т.ч. forms.gle).
 */
const PLACEHOLDER = "REPLACE_ME";

const raw = {
  productYoutubeShort: "https://www.youtube.com/watch?v=REPLACE_ME",
  joinSellIsLife: "https://pay.REPLACE_ME",
  telegramReviews: "https://t.me/REPLACE_ME",
  telegram: "https://t.me/REPLACE_ME",
  youtube: "https://youtube.com/@REPLACE_ME",
  instagram: "https://instagram.com/REPLACE_ME",
  vk: "https://vk.com/REPLACE_ME",
} as const;

function scrub(url: string): string {
  return url.includes(PLACEHOLDER) ? "#" : url;
}

export const links = {
  productYoutubeShort: scrub(raw.productYoutubeShort),
  joinSellIsLife: scrub(raw.joinSellIsLife),
  telegramReviews: scrub(raw.telegramReviews),
  telegram: scrub(raw.telegram),
  youtube: scrub(raw.youtube),
  instagram: scrub(raw.instagram),
  vk: scrub(raw.vk),
} as const;
