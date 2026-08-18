"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CategoryInfo } from "@/lib/games/types";
import styles from "@/styles/Pages.module.css";

interface GameFiltersProps {
  categories: CategoryInfo[];
  selectedCategory?: string;
  selectedSort?: string;
}

export function GameFilters({
  categories,
  selectedCategory = "all",
  selectedSort = "popular",
}: GameFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat.toLowerCase());
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <button
          onClick={() => handleCategoryChange("all")}
          className={`${styles.catPill} ${selectedCategory === "all" ? styles.catPillActive : ""}`}
        >
          All Games
        </button>
        {categories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
          return (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`${styles.catPill} ${isActive ? styles.catPillActive : ""}`}
            >
              {cat.name} ({cat.count})
            </button>
          );
        })}
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="sort-select" style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>
          Sort by:
        </label>
        <select
          id="sort-select"
          value={selectedSort}
          onChange={handleSortChange}
          className={styles.selectInput}
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest Releases</option>
          <option value="rating">Highest Rated</option>
          <option value="title-asc">Title (A - Z)</option>
          <option value="title-desc">Title (Z - A)</option>
        </select>
      </div>
    </div>
  );
}
