/**
 * Centralized Game Embed Security & Domain Allowlist
 * Only game URLs from explicitly approved domains or local relative embed paths will be rendered in the GamePlayer.
 */

export const ALLOWED_EMBED_DOMAINS = [
  "html5.gamemonetize.com",
  "api.gamemonetize.com",
  "gamemonetize.com",
  "gamemonetize.co",
  "gamedistribution.com",
  "html5.gamedistribution.com",
  "onlinegames.shivanshji.in",
  "localhost",
];

/**
 * Validates if an embed URL is allowed to be rendered in the iframe player.
 */
export function isAllowedGameEmbedUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string") {
    return false;
  }

  // Allow local relative paths starting with /embeds/ or /embed/
  if (rawUrl.startsWith("/embeds/") || rawUrl.startsWith("/embed/")) {
    return true;
  }

  try {
    const parsed = new URL(rawUrl);

    // Only allow HTTP/HTTPS protocols
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }

    // In production, enforce HTTPS
    if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
      // Allow localhost for dev testing
      if (parsed.hostname !== "localhost") {
        return false;
      }
    }

    const hostname = parsed.hostname.toLowerCase();

    return ALLOWED_EMBED_DOMAINS.some((allowed) => {
      if (allowed.startsWith("*.")) {
        const rootDomain = allowed.slice(2);
        return hostname === rootDomain || hostname.endsWith(`.${rootDomain}`);
      }
      return hostname === allowed || hostname.endsWith(`.${allowed}`);
    });
  } catch {
    return false;
  }
}
