/** @type {import("next").NextConfig} */
const isBegetStatic = process.env.BEGET_STATIC === "1";

function canonicalHostFromEnv() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sanchaevkirill.ru";
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return u.hostname;
  } catch {
    return "sanchaevkirill.ru";
  }
}

function wwwRedirectScheme(host) {
  return host.endsWith(".beget.tech") ? "http" : "https";
}

const nextConfig = isBegetStatic
  ? {
      output: "export",
      images: { unoptimized: true },
      webpack: (config) => {
        config.cache = false;
        return config;
      },
    }
  : {
      output: "standalone",
      async redirects() {
        const host = canonicalHostFromEnv();
        const scheme = wwwRedirectScheme(host);
        return [
          {
            source: "/:path*",
            has: [{ type: "host", value: `www.${host}` }],
            destination: `${scheme}://${host}/:path*`,
            permanent: true,
          },
        ];
      },
      async headers() {
        return [
          {
            source:
              "/((?!_next/static|_next/image|_next/data|images/|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
            headers: [
              { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
              { key: "Content-Language", value: "ru-RU" },
            ],
          },
        ];
      },
    };

export default nextConfig;
