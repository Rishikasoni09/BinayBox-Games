"use client";

import Script from "next/script";

export function GoogleAnalytics({ gaId }: { gaId?: string }) {
  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Track custom gaming events
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

export function trackGameOpen(gameSlug: string, gameTitle: string, category: string) {
  trackEvent("game_open", {
    game_slug: gameSlug,
    game_title: gameTitle,
    category: category,
  });
}

export function trackGameStart(gameSlug: string) {
  trackEvent("game_start", {
    game_slug: gameSlug,
  });
}

export function trackSearch(query: string, resultsCount: number) {
  trackEvent("search", {
    search_term: query,
    results_count: resultsCount,
  });
}
