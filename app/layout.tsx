import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/config/content";
import { getMetadataBase } from "@/config/site";
import { themeInitInlineScript } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: site.metaTitle,
  description: site.metaDescription,
  /** Явный основной язык документа — меньше шансов, что переводчик решит «это английский». */
  alternates: {
    canonical: "/",
    languages: {
      "ru-RU": "/",
    },
  },
  openGraph: {
    title: site.metaTitle,
    description: site.metaDescription,
    locale: "ru_RU",
    type: "website",
  },
  /**
   * Просьба к Chrome / Google не предлагать автоперевод (ломает кириллицу и даёт «арабские» подмены).
   * Плюс class="notranslate" и translate="no" на html/body/#site-root.
   */
  other: {
    google: "notranslate",
    googlebot: "notranslate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /** Во встроенных браузерах (Telegram и др.) вьюпорт корректнее подстраивается под клавиатуру. */
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "rgb(245 250 246)" },
    { media: "(prefers-color-scheme: dark)", color: "rgb(6 10 8)" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const base = getMetadataBase();
  const publicUrl = base.href.replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.metaTitle,
    description: site.metaDescription,
    inLanguage: "ru-RU",
    url: publicUrl,
  };

  return (
    <html lang="ru" translate="no" dir="ltr" className="notranslate" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/images/boxer-photo.jpg" />
        <link rel="preload" as="image" href="/images/hero-backdrop-castle.png" />
      </head>
      <body
        translate="no"
        className="notranslate min-h-screen min-h-dvh font-body text-[15px] leading-[1.68] tracking-[-0.01em] antialiased [font-feature-settings:'kern'_1,'liga'_1] md:text-[16px] md:leading-[1.72]"
      >
        <div
          id="site-root"
          className="site-root notranslate min-h-screen min-h-dvh"
          translate="no"
          lang="ru"
          dir="ltr"
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <SmoothScroll />
          <Script
            id="theme-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: themeInitInlineScript() }}
          />
          <Script
            id="lock-locale"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var d=document.documentElement;d.setAttribute('lang','ru');d.setAttribute('translate','no');d.setAttribute('dir','ltr');d.classList.add('notranslate');}catch(e){}})();`,
            }}
          />
          {children}
        </div>
      </body>
    </html>
  );
}
