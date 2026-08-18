import React from "react";
import { Game } from "@/lib/games/types";
import { GameCard } from "./GameCard";
import { GameCardSkeleton } from "@/components/ui/Skeleton";
import { Gamepad2 } from "lucide-react";
import styles from "@/styles/GameGrid.module.css";

interface GameGridProps {
  games?: Game[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyTitle?: string;
  emptyDesc?: string;
}

export function GameGrid({
  games = [],
  isLoading = false,
  skeletonCount = 8,
  emptyTitle = "No games found",
  emptyDesc = "Try searching for a different keyword or selecting another category.",
}: GameGridProps) {
  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Gamepad2 className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>{emptyTitle}</h3>
        <p className={styles.emptyDesc}>{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {games.map((game, idx) => (
        <GameCard key={game.id} game={game} priority={idx < 4} />
      ))}
    </div>
  );
}
