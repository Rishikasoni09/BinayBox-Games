import React from "react";

interface AdPlacementProps {
  slotId?: string;
  format?: "banner" | "rectangle" | "sidebar";
  className?: string;
}

/**
 * Dedicated AdPlacement placeholder component.
 * Prepared for future GameMonetize publisher banner/display ads.
 * Does not show fake deceptive ads or artificial buttons.
 */
export function AdPlacement({
  slotId = "default-ad-slot",
  format = "banner",
  className = "",
}: AdPlacementProps) {
  // If ads are disabled in development or no publisher ad code is inserted yet, show a clean, non-intrusive container or hide gracefully.
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

  if (!isEnabled) {
    return null;
  }

  const height = format === "banner" ? "90px" : format === "rectangle" ? "250px" : "600px";

  return (
    <div
      id={`ad-${slotId}`}
      className={`ad-container ${className}`}
      style={{
        width: "100%",
        maxWidth: format === "banner" ? "728px" : "300px",
        minHeight: height,
        margin: "20px auto",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px dashed var(--border-color)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: "12px",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      }}
    >
      <span>Advertisement</span>
    </div>
  );
}
