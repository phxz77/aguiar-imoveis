import { MetadataRoute } from "next";
import { MOCK_PROPERTIES } from "@/lib/data";
import { SITE_CONFIG } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = MOCK_PROPERTIES.filter(
    (p) => p.isAvailable
  ).map((property) => ({
    url: `${baseUrl}/imoveis/${property.slug}`,
    lastModified: new Date(property.updatedAt),
    changeFrequency: "weekly" as const,
    priority: property.isFeatured ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
