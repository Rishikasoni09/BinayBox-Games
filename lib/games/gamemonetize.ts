import {
  Game,
  GameCategory,
  GameFilterOptions,
  IGameProvider,
  PaginatedResponse,
  CategoryInfo,
} from "./types";
import { CATEGORIES_DATA, MOCK_GAMES } from "./mock-data";
import { sanitizeSlug } from "@/lib/security/sanitize";

interface GameMonetizeRawGame {
  id?: string | number;
  title?: string;
  description?: string;
  instructions?: string;
  thumb?: string;
  url?: string;
  category?: string;
  tags?: string;
  width?: string | number;
  height?: string | number;
  publisher?: string;
  date?: string;
}

export class GameMonetizeProvider implements IGameProvider {
  private apiUrl: string;
  private feedAmount: number;
  private cachedGames: Game[] = [];
  private lastFetchTime: number = 0;
  private cacheTtlMs: number = 1000 * 60 * 30; // 30 minutes cache

  constructor() {
    this.apiUrl =
      process.env.GAMEMONETIZE_API_URL || "https://gamemonetize.com/rss.php";
    this.feedAmount = parseInt(process.env.GAMEMONETIZE_FEED_AMOUNT || "100", 10);
  }

  private async fetchFeed(): Promise<Game[]> {
    const now = Date.now();
    if (this.cachedGames.length > 0 && now - this.lastFetchTime < this.cacheTtlMs) {
      return this.cachedGames;
    }

    try {
      const url = new URL(this.apiUrl);
      url.searchParams.set("format", "json");
      url.searchParams.set("amount", this.feedAmount.toString());

      if (process.env.GAMEMONETIZE_SITE_ID) {
        url.searchParams.set("site_id", process.env.GAMEMONETIZE_SITE_ID);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        next: { revalidate: 1800 },
        headers: {
          Accept: "application/json",
          "User-Agent": "BinaryBox-PublisherBot/1.0",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GameMonetize feed returned status ${response.status}`);
      }

      const rawData = await response.json();
      if (!Array.isArray(rawData)) {
        throw new Error("GameMonetize feed response is not an array");
      }

      this.cachedGames = this.normalizeFeed(rawData);
      this.lastFetchTime = now;
      return this.cachedGames;
    } catch (error) {
      console.error("[GameMonetizeProvider] Failed to fetch feed, falling back to local games:", error);
      if (this.cachedGames.length === 0) {
        this.cachedGames = MOCK_GAMES;
      }
      return this.cachedGames;
    }
  }

  private normalizeFeed(rawData: GameMonetizeRawGame[]): Game[] {
    const games: Game[] = [];
    const usedSlugs = new Set<string>();

    for (const raw of rawData) {
      if (!raw.id || !raw.title || !raw.url) continue;

      let baseSlug = sanitizeSlug(raw.title) || `game-${raw.id}`;
      let finalSlug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      usedSlugs.add(finalSlug);

      const category = this.normalizeCategory(raw.category);
      const tags = (raw.tags || "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      games.push({
        id: `gm-${raw.id}`,
        slug: finalSlug,
        title: raw.title.trim(),
        description:
          raw.description?.trim() ||
          `Play ${raw.title} online for free in high definition on BinaryBox Games. Enjoy fast-paced gameplay and instant browser access.`,
        thumbnail:
          raw.thumb ||
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
        embedUrl: raw.url,
        category,
        tags: tags.length > 0 ? tags : [category.toLowerCase(), "free game", "html5"],
        width: typeof raw.width === "string" ? parseInt(raw.width, 10) : raw.width,
        height:
          typeof raw.height === "string" ? parseInt(raw.height, 10) : raw.height,
        controls:
          raw.instructions?.trim() ||
          "Use Keyboard (Arrow keys/WASD) or Mouse/Touch screen controls to play.",
        instructions:
          raw.instructions?.trim() ||
          "Follow on-screen visual prompts and reach the highest score possible.",
        source: "gamemonetize",
        publishedAt: raw.date || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        featured: games.length < 6, // mark initial batch as featured
        trending: games.length % 3 === 0,
        rating: +(4.2 + (games.length % 8) * 0.1).toFixed(1),
        playCount: 1000 + (games.length * 420) % 50000,
        status: "active",
      });
    }

    return games;
  }

  private normalizeCategory(catRaw?: string): GameCategory {
    if (!catRaw) return "Casual";
    const c = catRaw.trim().toLowerCase();
    if (c.includes("action") || c.includes("fight")) return "Action";
    if (c.includes("race") || c.includes("car") || c.includes("driving"))
      return "Racing";
    if (c.includes("puzzle") || c.includes("match") || c.includes("brain"))
      return "Puzzle";
    if (c.includes("arcade") || c.includes("retro") || c.includes("classic"))
      return "Arcade";
    if (c.includes("shoot") || c.includes("gun") || c.includes("fps"))
      return "Shooting";
    if (c.includes("advent") || c.includes("rpg") || c.includes("quest"))
      return "Adventure";
    if (c.includes("sport") || c.includes("soccer") || c.includes("ball"))
      return "Sports";
    if (c.includes("strat") || c.includes("defense") || c.includes("war"))
      return "Strategy";
    if (c.includes("skill") || c.includes("jump") || c.includes("reflex"))
      return "Skill";
    if (c.includes("multi") || c.includes("2 player") || c.includes("io"))
      return "Multiplayer";
    if (c.includes("girl") || c.includes("dress") || c.includes("makeup"))
      return "Girls";
    return "Casual";
  }

  public async getGames(
    options: GameFilterOptions = {}
  ): Promise<PaginatedResponse<Game>> {
    const allGames = await this.fetchFeed();
    let filtered = [...allGames].filter((g) => g.status === "active");

    if (options.category && options.category !== "all") {
      const targetCat = options.category.toLowerCase();
      filtered = filtered.filter(
        (g) => g.category.toLowerCase() === targetCat
      );
    }

    if (options.tag) {
      const targetTag = options.tag.toLowerCase();
      filtered = filtered.filter((g) =>
        g.tags.some((t) => t.toLowerCase() === targetTag)
      );
    }

    if (options.query) {
      const q = options.query.toLowerCase().trim();
      filtered = filtered.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (options.featured !== undefined) {
      filtered = filtered.filter((g) => g.featured === options.featured);
    }

    if (options.trending !== undefined) {
      filtered = filtered.filter((g) => g.trending === options.trending);
    }

    const sort = options.sort || "popular";
    switch (sort) {
      case "popular":
        filtered.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(50, options.limit || 12));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const data = filtered.slice(offset, offset + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  public async getGameBySlug(slug: string): Promise<Game | null> {
    const allGames = await this.fetchFeed();
    const cleanSlug = slug.toLowerCase().trim();
    const game = allGames.find(
      (g) => g.slug.toLowerCase() === cleanSlug && g.status === "active"
    );
    return game || null;
  }

  public async getGameById(id: string): Promise<Game | null> {
    const allGames = await this.fetchFeed();
    const game = allGames.find(
      (g) => g.id === id && g.status === "active"
    );
    return game || null;
  }

  public async getGamesByCategory(
    category: string,
    options: Omit<GameFilterOptions, "category"> = {}
  ): Promise<PaginatedResponse<Game>> {
    return this.getGames({
      ...options,
      category,
    });
  }

  public async searchGames(
    query: string,
    options: Omit<GameFilterOptions, "query"> = {}
  ): Promise<PaginatedResponse<Game>> {
    return this.getGames({
      ...options,
      query,
    });
  }

  public async getCategories(): Promise<CategoryInfo[]> {
    const allGames = await this.fetchFeed();
    return CATEGORIES_DATA.map((cat) => {
      const count = allGames.filter(
        (g) =>
          g.category.toLowerCase() === cat.name.toLowerCase() &&
          g.status === "active"
      ).length;
      return {
        ...cat,
        count,
      };
    }).filter((cat) => cat.count > 0);
  }

  public async getRelatedGames(game: Game, limit: number = 6): Promise<Game[]> {
    const allGames = await this.fetchFeed();
    return allGames
      .filter(
        (g) =>
          g.id !== game.id &&
          g.status === "active" &&
          (g.category === game.category ||
            g.tags.some((t) => game.tags.includes(t)))
      )
      .slice(0, limit);
  }

  public async getFeaturedGames(limit: number = 6): Promise<Game[]> {
    const res = await this.getGames({ featured: true, limit });
    return res.data;
  }

  public async getTrendingGames(limit: number = 6): Promise<Game[]> {
    const res = await this.getGames({ trending: true, limit });
    return res.data;
  }

  public async getNewGames(limit: number = 6): Promise<Game[]> {
    const res = await this.getGames({ sort: "newest", limit });
    return res.data;
  }
}
