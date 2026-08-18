import {
  Game,
  GameCategory,
  GameFilterOptions,
  IGameProvider,
  PaginatedResponse,
  CategoryInfo,
} from "./types";
import { MOCK_GAMES, CATEGORIES_DATA } from "./mock-data";

export class MockGameProvider implements IGameProvider {
  private games: Game[] = [...MOCK_GAMES];

  public async getGames(
    options: GameFilterOptions = {}
  ): Promise<PaginatedResponse<Game>> {
    let filtered = [...this.games].filter((g) => g.status === "active");

    // Category filter
    if (options.category && options.category !== "all") {
      const targetCat = options.category.toLowerCase();
      filtered = filtered.filter(
        (g) => g.category.toLowerCase() === targetCat
      );
    }

    // Tag filter
    if (options.tag) {
      const targetTag = options.tag.toLowerCase();
      filtered = filtered.filter((g) =>
        g.tags.some((t) => t.toLowerCase() === targetTag)
      );
    }

    // Search query filter
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

    // Featured filter
    if (options.featured !== undefined) {
      filtered = filtered.filter((g) => g.featured === options.featured);
    }

    // Trending filter
    if (options.trending !== undefined) {
      filtered = filtered.filter((g) => g.trending === options.trending);
    }

    // Sorting
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

    // Pagination
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
    const cleanSlug = slug.toLowerCase().trim();
    const game = this.games.find(
      (g) => g.slug.toLowerCase() === cleanSlug && g.status === "active"
    );
    return game || null;
  }

  public async getGameById(id: string): Promise<Game | null> {
    const game = this.games.find(
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
    return CATEGORIES_DATA.map((cat) => {
      const count = this.games.filter(
        (g) =>
          g.category.toLowerCase() === cat.name.toLowerCase() &&
          g.status === "active"
      ).length;
      return {
        ...cat,
        count,
      };
    }).filter((cat) => cat.count > 0); // Only return categories with games
  }

  public async getRelatedGames(game: Game, limit: number = 6): Promise<Game[]> {
    const related = this.games
      .filter(
        (g) =>
          g.id !== game.id &&
          g.status === "active" &&
          (g.category === game.category ||
            g.tags.some((t) => game.tags.includes(t)))
      )
      .sort((a, b) => {
        const aCatMatch = a.category === game.category ? 2 : 0;
        const bCatMatch = b.category === game.category ? 2 : 0;
        const aTagMatches = a.tags.filter((t) => game.tags.includes(t)).length;
        const bTagMatches = b.tags.filter((t) => game.tags.includes(t)).length;
        return bCatMatch + bTagMatches - (aCatMatch + aTagMatches);
      })
      .slice(0, limit);

    return related;
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
