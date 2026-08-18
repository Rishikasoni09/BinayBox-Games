import { MetadataRoute } from "next";
import { getGameProvider } from "@/lib/games";
import { SITE_CONFIG } from "@/lib/seo/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.siteUrl.replace(/\/+$/, "");
  const provider = getGameProvider();

  // Fetch all active games
  const gamesRes = await provider.getGames({ limit: 100 });

  const gameUrls: MetadataRoute.Sitemap = gamesRes.data.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(game.updatedAt || game.publishedAt),
    changeFrequency: "weekly",
    priority: game.featured || game.trending ? 0.9 : 0.8,
  }));

  const homeUrl: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  return [...homeUrl, ...gameUrls];
}
