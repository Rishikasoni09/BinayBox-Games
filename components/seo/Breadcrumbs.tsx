import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumbs"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: "var(--text-muted)",
        margin: "16px 0",
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "var(--text-secondary)",
        }}
      >
        <Home size={14} />
        <span>FLGames</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.url}>
            <ChevronRight size={13} style={{ opacity: 0.5 }} />
            {isLast ? (
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {item.name}
              </span>
            ) : (
              <Link href={item.url} style={{ color: "var(--text-secondary)" }}>
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
