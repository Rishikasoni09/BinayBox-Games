"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Game } from "@/lib/games/types";
import styles from "@/styles/Search.module.css";
import { trackSearch } from "@/lib/analytics/google";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  initialQuery = "",
  placeholder = "Search games, categories, tags...",
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Game[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.data || []);
          setIsOpen(true);
          trackSearch(trimmed, data.total || 0);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={styles.searchInput}
          autoFocus={autoFocus}
          maxLength={80}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearBtn}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className={styles.dropdownResults}>
          {results.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className={styles.dropdownItem}
              onClick={() => setIsOpen(false)}
            >
              <Image
                src={game.thumbnail}
                alt={game.title}
                width={48}
                height={36}
                className={styles.dropdownThumb}
                unoptimized
              />
              <div className={styles.dropdownInfo}>
                <span className={styles.dropdownTitle}>{game.title}</span>
                <span className={styles.dropdownCategory}>{game.category}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
