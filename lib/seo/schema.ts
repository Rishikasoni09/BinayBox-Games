import { Game } from "@/lib/games/types";
import { getCanonicalUrl, SITE_CONFIG } from "./config";

export function generateGameJsonLd(game: Game) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    image: game.thumbnail,
    url: getCanonicalUrl(`/games/${game.slug}`),
    genre: game.category,
    keywords: game.tags.join(", "),
    gamePlatform: ["Web Browser", "HTML5"],
    applicationCategory: "Game",
    operatingSystem: "Any",
    playMode: "SinglePlayer",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: game.rating || "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: Math.floor((game.playCount || 1000) / 10),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.siteUrl,
    },
  };
}

export function generateBreadcrumbsJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.url),
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.siteUrl,
    logo: getCanonicalUrl("/icons/logo.png"),
    sameAs: [],
  };
}
