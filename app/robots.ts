import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.siteUrl.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
