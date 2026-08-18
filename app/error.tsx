"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error boundary captured error:", error);
  }, [error]);

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "65vh",
        textAlign: "center",
        gap: "24px",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(236, 72, 153, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-pink)",
        }}
      >
        <AlertTriangle size={36} />
      </div>

      <div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
          Something went wrong
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "440px", margin: "0 auto", lineHeight: "1.6" }}>
          An unexpected error occurred while loading this view. Please try refreshing or return to the homepage.
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Button onClick={() => reset()} variant="primary" icon={<RefreshCw size={16} />}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="secondary" icon={<Home size={16} />}>
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
