"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Maximize, Minimize, RefreshCw, AlertTriangle,
  Share2, Check, Smartphone, Monitor,
} from "lucide-react";
import { isAllowedGameEmbedUrl } from "@/lib/security/domains";
import { trackGameStart } from "@/lib/analytics/google";
import styles from "@/styles/GamePlayer.module.css";

interface GamePlayerProps {
  embedUrl: string;
  gameTitle: string;
  gameSlug: string;
  category: string;
}

export function GamePlayer({ embedUrl, gameTitle, gameSlug, category }: GamePlayerProps) {
  const [isLoading, setIsLoading]     = useState(true);
  const [hasError, setHasError]       = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied]           = useState(false);
  const [iframeKey, setIframeKey]     = useState(0);
  const [isMobile, setIsMobile]       = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef    = useRef<HTMLIFrameElement>(null);

  const isUrlAllowed = isAllowedGameEmbedUrl(embedUrl);

  /* ── Detect mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Track game start ── */
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    trackGameStart(gameSlug);
  }, [embedUrl, gameSlug]);

  /* ── Sync fullscreen state ── */
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange",       onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange",       onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  /* ── Lock landscape on mobile fullscreen ── */
  useEffect(() => {
    if (!isMobile) return;
    if (isFullscreen) {
      try {
        (screen.orientation as any)?.lock?.("landscape").catch(() => {});
      } catch {}
    } else {
      try { (screen.orientation as any)?.unlock?.(); } catch {}
    }
  }, [isFullscreen, isMobile]);

  /* ── Toggle fullscreen ── */
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        const el = containerRef.current as any;
        if (el.requestFullscreen)            await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen)    await el.mozRequestFullScreen();
        else if (el.msRequestFullscreen)     await el.msRequestFullscreen();
      } else {
        const doc = document as any;
        if (doc.exitFullscreen)             await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen)  await doc.webkitExitFullscreen();
        else if (doc.mozCancelFullScreen)   await doc.mozCancelFullScreen();
        else if (doc.msExitFullscreen)      await doc.msExitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed:", err);
    }
  }, []);

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    setIframeKey((k) => k + 1);
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Security block ── */
  if (!isUrlAllowed) {
    return (
      <div className={styles.playerWrapper}>
        <div className={styles.aspectRatioBox}>
          <div className={styles.overlayState}>
            <AlertTriangle size={48} color="#f43f5e" />
            <h3 className={styles.errorTitle}>Unauthorized Game Source</h3>
            <p className={styles.errorDesc}>
              This game URL is not on our authorized allowlist and cannot be loaded for security reasons.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.playerWrapper} ${isFullscreen ? styles.fullscreenActive : ""}`}
      id="game-player-container"
    >
      {/* ── Iframe area ── */}
      <div className={styles.aspectRatioBox}>

        {/* Loading */}
        {isLoading && !hasError && (
          <div className={styles.overlayState}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Loading {gameTitle}…</p>
          </div>
        )}

        {/* Error */}
        {hasError && (
          <div className={styles.overlayState}>
            <AlertTriangle size={44} color="#f43f5e" />
            <h3 className={styles.errorTitle}>Game Unavailable</h3>
            <p className={styles.errorDesc}>
              This game is temporarily unavailable. Try refreshing or explore other games.
            </p>
            <button onClick={handleReload} className={`${styles.controlBtn} ${styles.primaryControlBtn}`}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Game iframe */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={embedUrl}
          title={`Play ${gameTitle} online free`}
          className={styles.iframe}
          allow="autoplay; fullscreen; gamepad; screen-wake-lock; focus-without-user-activation"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="eager"
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setHasError(true); }}
        />
      </div>

      {/* ── Control bar ── */}
      <div className={styles.controlBar}>
        {/* Left */}
        <div className={styles.controlLeft}>
          <button onClick={handleReload} className={styles.controlBtn} title="Reload game">
            <RefreshCw size={14} />
            <span className={styles.btnLabel}>Reload</span>
          </button>

          <button onClick={handleShare} className={styles.controlBtn} title="Copy link">
            {copied
              ? <Check size={14} color="var(--accent-emerald)" />
              : <Share2 size={14} />}
            <span className={styles.btnLabel}>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {/* Center — game title */}
        <span className={styles.playerTitle}>
          {isMobile ? <Smartphone size={13} /> : <Monitor size={13} />}
          {gameTitle}
        </span>

        {/* Right — fullscreen */}
        <div className={styles.controlRight}>
          <button
            onClick={toggleFullscreen}
            className={`${styles.controlBtn} ${styles.primaryControlBtn}`}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            <span className={styles.btnLabel}>
              {isFullscreen ? "Exit" : "Fullscreen"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
