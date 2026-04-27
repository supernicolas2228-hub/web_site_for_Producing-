import { Manrope, Unbounded } from "next/font/google";

/**
 * Шрифты в бандле Next (self-host) — без fonts.bunny.net и внешних CDN.
 * Так страница читается и за VPN/прокси, и на LTE, и там, где сторонние домены режутся.
 */
export const fontManrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-manrope",
  adjustFontFallback: true,
});

export const fontUnbounded = Unbounded({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-unbounded",
  adjustFontFallback: true,
  weight: ["500", "600", "700", "800"],
});
