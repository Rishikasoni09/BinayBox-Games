import React from "react";
import { Sparkles, Flame, Zap } from "lucide-react";

interface BadgeProps {
  type: "trending" | "new" | "featured" | "category";
  label?: string;
  className?: string;
}

export function Badge({ type, label, className = "" }: BadgeProps) {
  switch (type) {
    case "trending":
      return (
        <span className={`badge badge-trending ${className}`}>
          <Flame size={12} />
          {label || "Trending"}
        </span>
      );
    case "new":
      return (
        <span className={`badge badge-new ${className}`}>
          <Zap size={12} />
          {label || "New"}
        </span>
      );
    case "featured":
      return (
        <span className={`badge badge-featured ${className}`}>
          <Sparkles size={12} />
          {label || "Featured"}
        </span>
      );
    case "category":
    default:
      return (
        <span className={`badge badge-category ${className}`}>
          {label || "Game"}
        </span>
      );
  }
}
