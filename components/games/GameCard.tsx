import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Star } from "lucide-react";
import { Game } from "@/lib/games/types";

interface GameCardProps {
  game: Game;
  priority?: boolean;
  featured?: boolean;
}

const CAT_EMOJI: Record<string, string> = {
  Action:      "⚔️",
  Racing:      "🏎️",
  Puzzle:      "🧩",
  Arcade:      "🕹️",
  Shooting:    "🎯",
  Adventure:   "🗺️",
  Sports:      "🏆",
  Strategy:    "🛡️",
  Casual:      "🎲",
  Skill:       "⚡",
  Multiplayer: "👥",
  Girls:       "💎",
};

export function GameCard({ game, priority = false, featured = false }: GameCardProps) {
  const badge = game.trending ? "HOT" : game.featured ? "NEW" : null;
  const badgeCls = game.trending ? "badge badge-hot" : "badge badge-new";

  return (
    <Link
      href={`/games/${game.slug}`}
      className="gc"
      title={`Play ${game.title} free`}
    >
      {/* Thumbnail */}
      <div className="gc__thumb">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 20vw"
          className="gc__img"
          priority={priority}
          unoptimized
        />

        {/* Hover play */}
        <div className="gc__overlay">
          <div className="gc__play">
            <Play size={18} fill="currentColor" style={{ marginLeft: "2px" }} />
          </div>
        </div>

        {/* Badge */}
        {badge && (
          <div className="gc__badge">
            <span className={badgeCls}>{badge}</span>
          </div>
        )}

        {/* Rating */}
        {game.rating && (
          <div className="gc__rating">
            <Star size={9} fill="currentColor" />
            {game.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Text below */}
      <div className="gc__body">
        <span className="gc__name">{game.title}</span>
        <div className="gc__meta">
          <span className="gc__cat">
            <span>{CAT_EMOJI[game.category] ?? "🎮"}</span>
            {game.category}
          </span>
          {game.rating && (
            <span className="gc__stars">
              <Star size={10} fill="currentColor" />
              {game.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
