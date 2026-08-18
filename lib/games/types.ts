/**
 * Core normalized game data model for BinaryBox Games
 */

export type GameCategory =
  | "Action"
  | "Adventure"
  | "Arcade"
  | "Puzzle"
  | "Racing"
  | "Sports"
  | "Strategy"
  | "Casual"
  | "Multiplayer"
  | "Girls"
  | "Shooting"
  | "Skill";

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  category: GameCategory;
  tags: string[];
  width?: number;
  height?: number;
  controls?: string;
  instructions?: string;
  source: "mock" | "gamemonetize" | "custom";
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  trending: boolean;
  rating?: number;
  playCount?: number;
  status: "active" | "maintenance" | "disabled";
}

export interface GameFilterOptions {
  category?: string;
  tag?: string;
  query?: string;
  featured?: boolean;
  trending?: boolean;
  sort?: "popular" | "newest" | "title-asc" | "title-desc" | "rating";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CategoryInfo {
  name: GameCategory;
  slug: string;
  description: string;
  iconName: string;
  count: number;
}

export interface IGameProvider {
  getGames(options?: GameFilterOptions): Promise<PaginatedResponse<Game>>;
  getGameBySlug(slug: string): Promise<Game | null>;
  getGameById(id: string): Promise<Game | null>;
  getGamesByCategory(
    category: string,
    options?: Omit<GameFilterOptions, "category">
  ): Promise<PaginatedResponse<Game>>;
  searchGames(
    query: string,
    options?: Omit<GameFilterOptions, "query">
  ): Promise<PaginatedResponse<Game>>;
  getCategories(): Promise<CategoryInfo[]>;
  getRelatedGames(game: Game, limit?: number): Promise<Game[]>;
  getFeaturedGames(limit?: number): Promise<Game[]>;
  getTrendingGames(limit?: number): Promise<Game[]>;
  getNewGames(limit?: number): Promise<Game[]>;
}
