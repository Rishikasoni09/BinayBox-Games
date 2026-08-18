import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameProvider } from "@/lib/games";
import { GamePlayer } from "@/components/games/GamePlayer";
import { GameControls } from "@/components/games/GameControls";
import { GameGrid } from "@/components/games/GameGrid";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdPlacement } from "@/components/layout/AdPlacement";
import { generateGameJsonLd, generateBreadcrumbsJsonLd } from "@/lib/seo/schema";
import { Star, Users, Flame, Tag, Info } from "lucide-react";
import styles from "@/styles/Pages.module.css";

interface GameDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: GameDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getGameProvider();
  const game = await provider.getGameBySlug(slug);

  if (!game) {
    return {
      title: "Game Not Found | BinaryBox Games",
    };
  }

  const title = `Play ${game.title} Online Free`;
  const description = game.description;

  return {
    title,
    description,
    keywords: [...game.tags, game.category, "free online game", "BinaryBox Games"],
    alternates: {
      canonical: `/games/${game.slug}`,
    },
    openGraph: {
      title: `${game.title} - Free Online Browser Game`,
      description,
      type: "video.other",
      url: `/games/${game.slug}`,
      images: [
        {
          url: game.thumbnail,
          width: 800,
          height: 500,
          alt: `${game.title} Preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} - Play Free Online`,
      description,
      images: [game.thumbnail],
    },
  };
}

export default async function GameDetailPage({ params }: GameDetailProps) {
  const { slug } = await params;
  const provider = getGameProvider();
  const game = await provider.getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const relatedGames = await provider.getRelatedGames(game, 6);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: game.category, url: "/#trending-games" },
    { name: game.title, url: `/games/${game.slug}` },
  ];

  const gameJsonLd = generateGameJsonLd(game);
  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd(breadcrumbs);

  return (
    <>
      <StructuredData data={gameJsonLd} />
      <StructuredData data={breadcrumbsJsonLd} />

      <div className="container" style={{ paddingBottom: "60px" }}>
        <Breadcrumbs items={breadcrumbs} />

        {/* Game Title & Header Row */}
        <div style={{ margin: "16px 0 20px" }}>
          <div className={styles.gameTitleRow}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <h1 className={styles.gameDetailTitle}>{game.title}</h1>
              <span className="badge badge-category">
                {game.category}
              </span>
              {game.trending && <span className="badge badge-trending"><Flame size={12} /> Trending</span>}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", color: "var(--text-muted)" }}>
              {game.rating && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--accent-amber)", fontWeight: 700 }}>
                  <Star size={16} fill="currentColor" />
                  <span>{game.rating.toFixed(1)} / 5.0</span>
                </div>
              )}
              {game.playCount && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Users size={15} />
                  <span>{game.playCount.toLocaleString()} plays</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Game Player */}
        <GamePlayer
          embedUrl={game.embedUrl}
          gameTitle={game.title}
          gameSlug={game.slug}
          category={game.category}
        />

        <AdPlacement slotId="game-player-bottom" format="banner" />

        {/* Game Info, Instructions, Controls & Sidebar */}
        <div className={styles.gameDetailLayout}>
          {/* Main Info Column */}
          <div className={styles.gameMainCol}>
            {/* About the game */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>
                <Info size={20} color="var(--primary)" />
                <span>About {game.title}</span>
              </div>
              <p className={styles.infoCardText}>{game.description}</p>
            </div>

            {/* Controls & Instructions */}
            <GameControls
              controls={game.controls}
              instructions={game.instructions}
            />

            {/* Tags Cloud */}
            {game.tags && game.tags.length > 0 && (
              <div className={styles.infoCard}>
                <div className={styles.infoCardTitle}>
                  <Tag size={18} color="var(--accent-cyan)" />
                  <span>Tags & Topics</span>
                </div>
                <div className={styles.tagsWrap}>
                  {game.tags.map((t) => (
                    <span key={t} className={styles.tagPill}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className={styles.gameSideCol}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>
                <span>Game Details</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>Category</span>
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                    {game.category}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>Platform</span>
                  <span style={{ color: "var(--text-primary)" }}>HTML5 Browser</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>Price</span>
                  <span style={{ color: "var(--accent-emerald)", fontWeight: 700 }}>100% Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>Rating</span>
                  <span style={{ color: "var(--accent-amber)", fontWeight: 700 }}>★ {game.rating || "4.8"}</span>
                </div>
              </div>
            </div>

            <AdPlacement slotId="game-sidebar" format="rectangle" />
          </div>
        </div>

        {/* Related Games Section */}
        {relatedGames.length > 0 && (
          <section style={{ marginTop: "60px" }}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleArea}>
                <h2 className={styles.sectionTitle}>More {game.category} Games</h2>
              </div>
            </div>
            <GameGrid games={relatedGames} />
          </section>
        )}
      </div>
    </>
  );
}
