"use client";

import React, { useState } from "react";
import { Sparkles, Grid3x3 } from "lucide-react";

interface CategoryBarProps {
  categories: Array<{
    name: string;
    slug: string;
    count?: number;
  }>;
  onSelectCategory?: (category: string | null) => void;
}

const EMOJI: Record<string, string> = {
  Action: "⚔️",
  Racing: "🏎️",
  Puzzle: "🧩",
  Arcade: "🕹️",
  Shooting: "🎯",
  Adventure: "🗺️",
  Sports: "🏆",
  Strategy: "🛡️",
  Casual: "🎲",
  Skill: "⚡",
  Multiplayer: "👥",
  Girls: "💎",
};

export function CategoryBar({ categories, onSelectCategory }: CategoryBarProps) {
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const handleSelect = (catName: string | null) => {
    setActiveCat(catName);
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
  };

  return (
    <div className="cat-bar-wrapper">
      <div className="container cat-bar-container">
        <div className="cat-scroll-track">
          {/* All Games Pill */}
          <button
            onClick={() => handleSelect(null)}
            className={`cat-pill ${activeCat === null ? "cat-pill-active" : ""}`}
            type="button"
          >
            <span className="cat-pill-icon">🎮</span>
            <span className="cat-pill-label">All Games</span>
          </button>

          {/* Category Pills */}
          {categories.map((cat) => {
            const isSelected = activeCat === cat.name;
            return (
              <button
                key={cat.slug}
                onClick={() => handleSelect(cat.name)}
                className={`cat-pill ${isSelected ? "cat-pill-active" : ""}`}
                type="button"
              >
                <span className="cat-pill-icon">{EMOJI[cat.name] ?? "🎮"}</span>
                <span className="cat-pill-label">{cat.name}</span>
                {cat.count !== undefined && (
                  <span className="cat-pill-badge">{cat.count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
