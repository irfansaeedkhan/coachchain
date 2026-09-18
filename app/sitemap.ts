import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: "https://coachchain.io", lastModified, changeFrequency: "monthly", priority: 1 },
    { url: "https://coachchain.io/privacy", lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: "https://coachchain.io/terms", lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: "https://coachchain.io/cookies", lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
