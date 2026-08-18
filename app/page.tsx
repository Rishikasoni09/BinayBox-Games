import Link from "next/link";
import Image from "next/image";
import { getGameProvider } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateOrganizationJsonLd } from "@/lib/seo/schema";
import { Gamepad2, Grid3x3, Flame, Zap } from "lucide-react";

export const revalidate = 1800;

export default async function HomePage() {
  const provider = getGameProvider();
  const [trendingGames, newGames] = await Promise.all([
    provider.getTrendingGames(10),
    provider.getNewGames(10),
  ]);

  return (
    <>
      <StructuredData data={generateOrganizationJsonLd()} />

      {/* ── Hero Banner ── */}
      <div className="container" style={{ paddingTop: "20px" }}>
        <div className="home-hero-card">
          {/* Text left side */}
          <div className="home-hero-left">
            <h1 className="home-hero-title">
              FUN GAMES.<br />
              REAL PLAYERS.<br />
              GREAT MOMENTS.
            </h1>
            <p className="home-hero-sub">
              Play free online games and enjoy every moment!
            </p>
            <div className="home-hero-ctas">
              <a href="#trending-games" className="home-btn-primary">
                <Gamepad2 size={15} /> Explore Games
              </a>
              <a href="#new-games" className="home-btn-secondary">
                <Grid3x3 size={15} /> New Releases
              </a>
            </div>
          </div>

          {/* Character image — right side */}
          <div className="home-hero-imgwrap">
            <Image
              src="/hero-banner.jpg"
              alt="BinaryBox Games — fun browser games"
              fill
              className="home-hero-img"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* ── Trending Games ── */}
      <section id="trending-games" className="container home-section">
        <div className="home-sec-header">
          <span className="home-sec-title">
            <Flame size={17} className="home-sec-icon" />
            Trending Games
          </span>
        </div>
        <div className="tile-grid">
          {trendingGames.map((game, i) => (
            <GameCard key={game.id} game={game} priority={i < 5} />
          ))}
        </div>
      </section>

      {/* ── New Games ── */}
      <section id="new-games" className="container home-section">
        <div className="home-sec-header">
          <span className="home-sec-title">
            <Zap size={17} className="home-sec-icon-new" />
            New Games
          </span>
        </div>
        <div className="tile-grid-even">
          {newGames.map((game, i) => (
            <GameCard key={game.id} game={game} priority={false} />
          ))}
        </div>
      </section>
    </>
  );
}
