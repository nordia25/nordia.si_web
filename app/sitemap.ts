import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nordia.si";
  const lastModified = new Date("2026-03-27");

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/zasebnost`,
      lastModified: new Date("2025-12-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
