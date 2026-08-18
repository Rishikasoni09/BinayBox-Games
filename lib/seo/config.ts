/**
 * Centralized SEO & Domain Configuration
 */

export const SITE_CONFIG = {
  name: "BinaryBox Games",
  title: "BinaryBox Games - Free Browser Games & Online HTML5 Gaming",
  description:
    "Play thousands of free online browser games on BinaryBox Games. Instant play, no downloads required. Discover top Action, Racing, Puzzle, Arcade, and Sports games in high quality.",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://binaryboxgames.shivanshji.in",
  ogImage: "/images/og-image.png",
  twitterHandle: "@BinaryBoxGames",
  keywords: [
    "free online games",
    "browser games",
    "html5 games",
    "play free games",
    "arcade games",
    "action games",
    "racing games",
    "puzzle games",
    "no download games",
    "BinaryBox Games",
  ],
};

export function getCanonicalUrl(path: string = ""): string {
  const baseUrl = SITE_CONFIG.siteUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath === "/" ? "" : cleanPath}`;
}
