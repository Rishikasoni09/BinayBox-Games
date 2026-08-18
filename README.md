# FLGames - Production-Ready Browser Gaming Platform

A modern, fast, responsive HTML5 browser gaming website built with **Next.js (App Router)**, **React**, **TypeScript**, and **Vanilla CSS / CSS Modules**.

Designed for seamless deployment on **Render** under the custom domain `https://onlinegames.shivanshji.in`.

---

## Key Features

- **Decoupled Game Provider Architecture (`IGameProvider`)**:
  - `MockGameProvider`: Built-in dataset with 25+ rich mock games and 5 interactive HTML5 Canvas demo minigames (Neon Snake, Space Blaster, Cyber Runner, Cyber 2048, Retro Speed Racer).
  - `GameMonetizeProvider`: Production-ready adapter for the official GameMonetize publisher RSS/JSON feed with automatic category mapping, slug normalization, response caching, and timeout handling.
  - Switch providers with a single environment variable (`GAME_PROVIDER=gamemonetize` vs `GAME_PROVIDER=mock`) without rebuilding or modifying the UI.
- **Secure Game Player (`GamePlayer`)**:
  - Centralized domain allowlist security check (`isAllowedGameEmbedUrl`).
  - Strict sandboxing: `sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"`.
  - Referrer-Policy: `strict-origin-when-cross-origin`.
  - Theater mode, cross-browser Fullscreen API support, loading skeletons, and graceful error fallback states.
- **Comprehensive SEO & Web Vitals**:
  - Dynamic OpenGraph and Twitter cards (`app/opengraph-image.tsx`).
  - JSON-LD Structured Data for `VideoGame`, `BreadcrumbList`, and `Organization`.
  - Dynamic `sitemap.xml` (`app/sitemap.ts`) and `robots.txt` (`app/robots.ts`).
  - Responsive image optimization with explicit dimensions to prevent Cumulative Layout Shift (CLS).
- **Search & Filtering**:
  - Debounced instant search bar with live dropdown suggestions and keyboard navigation.
  - Category and tag filters with sort controls (Popular, Newest, Rating, Alphabetical).
  - Server-side pagination with clean URLs.
- **Dark-First Gaming Aesthetics**:
  - Custom design tokens, glassmorphism headers, responsive drawer navigation, and card hover micro-animations.
  - Strictly built with pure CSS / CSS Modules (No Tailwind CSS).
- **Production Hardened**:
  - In-memory rate limiting for public API route handlers (`/api/games`, `/api/search`).
  - Strict Content Security Policy (CSP), X-Frame-Options, and security headers.
  - Ready for 1-click deployment on Render via `render.yaml`.

---

## Directory Structure

```
├── app/
│   ├── layout.tsx                    # Root layout with Header, Footer, Analytics
│   ├── page.tsx                      # Homepage with Hero, Trending, New, Category Grids
│   ├── opengraph-image.tsx           # Dynamic OpenGraph social card generator
│   ├── icon.tsx                      # Dynamic favicon generator
│   ├── sitemap.ts                    # Dynamic sitemap (Homepage, Categories, Games, Static)
│   ├── robots.ts                     # Search engine directives
│   ├── not-found.tsx                 # Custom 404 page
│   ├── error.tsx                     # Error boundary page
│   ├── games/
│   │   ├── page.tsx                  # Games directory with filters and pagination
│   │   └── [slug]/
│   │       └── page.tsx              # Game detail page (GamePlayer, Controls, Related)
│   ├── categories/
│   │   ├── page.tsx                  # Category directory index
│   │   └── [slug]/
│   │       └── page.tsx              # Specific category game listing
│   ├── search/
│   │   └── page.tsx                  # Dedicated search page
│   ├── about/page.tsx                # About FLGames & publisher details
│   ├── contact/page.tsx              # Contact form & developer submissions
│   ├── privacy-policy/page.tsx       # Privacy policy
│   ├── terms/page.tsx                # Terms of service
│   └── api/
│       ├── games/route.ts            # Public games API with rate limiting
│       └── search/route.ts           # Debounced search API with rate limiting
├── components/
│   ├── games/                        # GameCard, GameGrid, GamePlayer, GameControls, GameFilters
│   ├── layout/                       # Header, Footer, MobileNav, AdPlacement
│   ├── search/                       # SearchBar (debounced with live results)
│   ├── seo/                          # Breadcrumbs, StructuredData
│   └── ui/                           # Button, Badge, Skeleton
├── lib/
│   ├── games/                        # Provider interface, Mock provider, GameMonetize adapter
│   ├── security/                     # Domain allowlist, Rate limiter, Sanitizers
│   ├── seo/                          # SEO config, JSON-LD schema generators
│   └── analytics/                    # Google Analytics integration & event tracker
├── public/
│   └── embeds/                       # Built-in playable HTML5 canvas games
├── styles/                           # Design tokens & CSS modules
├── render.yaml                       # Render deployment configuration
└── next.config.ts                    # Security headers, CSP & image allowlists
```

---

## Quick Start (Local Development)

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment configuration:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform.

---

## Switching to Live GameMonetize Feed

To connect your official GameMonetize publisher account:

1. Log into your [GameMonetize Publisher Dashboard](https://gamemonetize.com/).
2. Generate your publisher feed URL via their RSS/JSON builder.
3. Update your `.env.local` (or Render environment variables):
   ```env
   GAME_PROVIDER=gamemonetize
   GAMEMONETIZE_API_URL=https://api.gamemonetize.com/rss.php
   GAMEMONETIZE_SITE_ID=your_site_id_here
   GAMEMONETIZE_FEED_AMOUNT=100
   ```
4. Restart your server. The frontend will automatically load and normalize live games without changing any code!

---

## Deployment on Render

This repository includes a `render.yaml` blueprint:

1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), select **New +** > **Blueprint**.
3. Connect your GitHub repository. Render will automatically configure the build command (`npm install && npm run build`) and start command (`npm run start`).
4. Under **Custom Domains**, add `onlinegames.shivanshji.in` and configure DNS CNAME/A records as guided by Render.

---

## Security & Compliance

- No private API secrets are exposed to client-side bundles.
- External iframe origins are verified against an allowlist before embedding.
- Public API endpoints are protected with sliding-window rate limiters.
- All games run in restricted sandboxed iframes.
- No user PII is collected or stored.
