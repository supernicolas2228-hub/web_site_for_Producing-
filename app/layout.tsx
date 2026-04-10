import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/config/content";
import { themeInitInlineScript } from "@/lib/theme";

/** Заголовки: выразительная антиква, «дорогой» редакционный тон, кириллица */
const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

/** Основной текст: современный гротеск, хорошо читается на телефоне */
const body = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${site.name} — система первых денег без хаоса`,
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-body text-[15px] leading-[1.68] tracking-[-0.01em] antialiased [font-feature-settings:'kern'_1,'liga'_1] md:text-[16px] md:leading-[1.72]">
        <SmoothScroll />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitInlineScript() }}
        />
        {children}
      </body>
    </html>
  );
}
