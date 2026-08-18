import React from "react";
import { Box, ShieldCheck } from "lucide-react";
import styles from "@/styles/Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`} style={{ gridTemplateColumns: "1fr", gap: "20px" }}>
        {/* Brand column */}
        <div className={styles.brandCol} style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center", alignItems: "center" }}>
          <div className={styles.brandLogo}>
            <div className={styles.brandLogoIcon}>
              <Box size={20} />
            </div>
            <span>BINARY<span className={styles.brandLogoAccent}>BOX</span></span>
          </div>
          <p className={styles.brandDesc}>
            Discover fast, fun, and free games you can play directly in your
            browser without downloads or installation.
          </p>
          <div className={styles.publisherNote}>
            <div className={styles.publisherNoteHead} style={{ justifyContent: "center" }}>
              <ShieldCheck size={13} /> Safe &amp; Authorized Gaming
            </div>
            Games on BinaryBox Games are delivered via authorized developer embeds and
            official third-party distribution partners.
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`container ${styles.bottomBar}`} style={{ justifyContent: "center", textAlign: "center" }}>
        <span>
          © {year} BinaryBox Games. All rights reserved. &nbsp;·&nbsp;{" "}
          <a
            href="https://binaryboxgames.shivanshji.in"
            className={styles.domainLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            binaryboxgames.shivanshji.in
          </a>
        </span>
      </div>
    </footer>
  );
}
