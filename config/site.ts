/**
 * Канонический прод-URL (зона .ru на Beget).
 * Временно только техдомен: в .env NEXT_PUBLIC_SITE_URL=http://supernh5.beget.tech
 */
export const PRODUCTION_CANONICAL_ORIGIN = "https://sanchaevkirill.ru" as const;

/** Базовый URL для metadataBase, canonical, Open Graph, sitemap, JSON-LD. */
export function getMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isBegetStatic = process.env.BEGET_STATIC === "1";
  const vercel = process.env.VERCEL_URL?.trim();
  const raw =
    explicit ||
    (isBegetStatic ? PRODUCTION_CANONICAL_ORIGIN : "") ||
    (vercel ? `https://${vercel.replace(/^https?:\/\//, "")}` : "") ||
    "http://127.0.0.1:3030";
  const base = raw.replace(/\/$/, "");
  return new URL(`${base}/`);
}
