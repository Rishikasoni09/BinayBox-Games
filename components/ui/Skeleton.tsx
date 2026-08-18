import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  width = "100%",
  height = "20px",
  borderRadius = "var(--radius-md)",
  className = "",
  style,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function GameCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-color)",
      }}
    >
      <Skeleton height="150px" borderRadius="0" />
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <Skeleton height="18px" width="80%" />
        <Skeleton height="14px" width="40%" />
      </div>
    </div>
  );
}
