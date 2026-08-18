import Link from "next/link";
import { Gamepad2, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
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
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary-light)",
        }}
      >
        <Gamepad2 size={40} />
      </div>

      <div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "#fff", marginBottom: "10px" }}>
          404
        </h1>
        <h2 style={{ fontSize: "22px", color: "var(--text-secondary)", marginBottom: "12px" }}>
          Level Not Found / Page Missing
        </h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "460px", margin: "0 auto", lineHeight: "1.6" }}>
          The game or page you are looking for might have been moved, renamed, or is temporarily unavailable in the arcade.
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/">
          <Button variant="primary" icon={<Home size={16} />}>
            Back to Home
          </Button>
        </Link>
        <Link href="/games">
          <Button variant="secondary" icon={<Search size={16} />}>
            Browse All Games
          </Button>
        </Link>
      </div>
    </div>
  );
}
