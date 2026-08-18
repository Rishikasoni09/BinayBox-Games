"use client";

import React from "react";
import Link from "next/link";
import { Box } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import styles from "@/styles/Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logo} aria-label="BinaryBox Games Home">
          <div className={styles.logoIcon}>
            <Box size={20} />
          </div>
          <span className={styles.logoText}>
            BINARYBOX <span className={styles.logoAccent}>GAMES</span>
          </span>
        </Link>

        {/* Embedded Search Bar in Navbar */}
        <div className={styles.searchWrap}>
          <SearchBar placeholder="Search games, tags, genres..." />
        </div>
      </div>
    </header>
  );
}
