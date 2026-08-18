import React from "react";
import { Gamepad2, Info, Compass } from "lucide-react";
import styles from "@/styles/Pages.module.css";

interface GameControlsProps {
  controls?: string;
  instructions?: string;
}

export function GameControls({ controls, instructions }: GameControlsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {controls && (
        <div className={styles.infoCard}>
          <div className={styles.infoCardTitle}>
            <Gamepad2 size={20} color="var(--primary-light)" />
            <span>Game Controls</span>
          </div>
          <p className={styles.infoCardText}>{controls}</p>
        </div>
      )}

      {instructions && (
        <div className={styles.infoCard}>
          <div className={styles.infoCardTitle}>
            <Compass size={20} color="var(--accent-emerald)" />
            <span>How to Play & Objectives</span>
          </div>
          <p className={styles.infoCardText}>{instructions}</p>
        </div>
      )}
    </div>
  );
}
