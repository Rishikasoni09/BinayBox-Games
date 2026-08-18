import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { CategoryStrip } from "@/components/layout/CategoryStrip";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/lib/analytics/google";
import { SITE_CONFIG } from "@/lib/seo/config";
import "@/styles/globals.css";

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Free Browser Games`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitterHandle,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  alternates: {
    canonical: SITE_CONFIG.siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GSC_VERIFICATION}
          />
        )}
      </head>
      <body>
        <Header />
        <CategoryStrip />
        <main>{children}</main>
        <Footer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
