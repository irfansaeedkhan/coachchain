import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: "https://coachchain.io", lastModified, changeFrequency: "monthly", priority: 1 },
  ];
}
