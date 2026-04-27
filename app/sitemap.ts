import type { MetadataRoute } from "next";
import { getMetadataBase } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getMetadataBase();
  return [
    {
      url: new URL("", base).toString(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
