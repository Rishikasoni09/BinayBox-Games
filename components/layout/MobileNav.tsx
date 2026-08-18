"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Gamepad2, Sparkles, Grid, Search, Info, Mail, Shield, FileText, Box } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent background scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "relative",
          width: "82%",
          maxWidth: "320px",
          height: "100%",
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 20px",
          gap: "24px",
          overflowY: "auto",
          zIndex: 2,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px", fontWeight: 900 }}>
            <Box size={20} color="var(--primary)" />
            <span style={{ color: "var(--text-primary)" }}>BINARY</span>
            <span style={{ color: "var(--primary)" }}>BOX</span>
          </div>
          <button
            onClick={onClose}
            style={{ color: "var(--text-muted)", padding: "4px" }}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              color: pathname === "/" ? "var(--primary)" : "var(--text-secondary)",
              background: pathname === "/" ? "rgba(108,92,231,0.08)" : "transparent",
              fontWeight: 600,
            }}
          >
            <Gamepad2 size={18} color="var(--primary)" />
            <span>Home</span>
          </Link>

          <Link
            href="/games"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              color: pathname.startsWith("/games") ? "var(--primary)" : "var(--text-secondary)",
              background: pathname.startsWith("/games") ? "rgba(108,92,231,0.08)" : "transparent",
              fontWeight: 600,
            }}
          >
            <Grid size={18} color="var(--accent-cyan)" />
            <span>All Games</span>
          </Link>

          <Link
            href="/categories"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              color: pathname.startsWith("/categories") ? "var(--primary)" : "var(--text-secondary)",
              background: pathname.startsWith("/categories") ? "rgba(108,92,231,0.08)" : "transparent",
              fontWeight: 600,
            }}
          >
            <Sparkles size={18} color="var(--accent-amber)" />
            <span>Categories</span>
          </Link>

          <Link
            href="/search"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              color: pathname === "/search" ? "var(--primary)" : "var(--text-secondary)",
              background: pathname === "/search" ? "rgba(108,92,231,0.08)" : "transparent",
              fontWeight: 600,
            }}
          >
            <Search size={18} color="var(--accent-pink)" />
            <span>Search</span>
          </Link>
        </nav>

        <div style={{ height: "1px", background: "var(--border-color)", margin: "8px 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: "4px" }}>
            Information & Legal
          </span>
          <Link href="/about" style={{ padding: "8px 10px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Info size={14} /> About BinaryBox Games
          </Link>
          <Link href="/contact" style={{ padding: "8px 10px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Mail size={14} /> Contact Us
          </Link>
          <Link href="/privacy-policy" style={{ padding: "8px 10px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield size={14} /> Privacy Policy
          </Link>
          <Link href="/terms" style={{ padding: "8px 10px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={14} /> Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
