import type { MetadataRoute } from "next";
import { getMetadataBase } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = getMetadataBase();
  const sitemap = new URL("sitemap.xml", base);
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: sitemap.toString(),
  };
}
