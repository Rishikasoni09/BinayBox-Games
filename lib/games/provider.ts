import { IGameProvider } from "./types";
import { MockGameProvider } from "./mock-provider";
import { GameMonetizeProvider } from "./gamemonetize";

let cachedProvider: IGameProvider | null = null;

/**
 * Returns the configured game provider instance based on environment configuration.
 * - 'gamemonetize': Connects to GameMonetize publisher feed
 * - 'mock' (default): Uses built-in high fidelity mock provider
 */
export function getGameProvider(): IGameProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const providerType = (process.env.GAME_PROVIDER || "mock").toLowerCase().trim();

  if (providerType === "gamemonetize") {
    cachedProvider = new GameMonetizeProvider();
  } else {
    cachedProvider = new MockGameProvider();
  }

  return cachedProvider;
}

export * from "./types";
export * from "./mock-data";
