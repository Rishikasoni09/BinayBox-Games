import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "var(--radius-full)",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: size === "sm" ? "13px" : size === "lg" ? "16px" : "14px",
    padding:
      size === "sm"
        ? "6px 14px"
        : size === "lg"
        ? "14px 30px"
        : "10px 20px",
  };

  let variantStyles: React.CSSProperties = {};

  if (variant === "primary") {
    variantStyles = {
      background: "var(--grad-primary)",
      color: "#ffffff",
      border: "none",
      boxShadow: "0 0 16px var(--primary-glow)",
    };
  } else if (variant === "secondary") {
    variantStyles = {
      background: "var(--bg-card)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-color)",
    };
  } else if (variant === "outline") {
    variantStyles = {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--primary-light)",
    };
  } else if (variant === "ghost") {
    variantStyles = {
      background: "transparent",
      color: "var(--text-secondary)",
      border: "none",
    };
  }

  return (
    <button
      style={{ ...baseStyles, ...variantStyles, ...style }}
      className={`btn ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
