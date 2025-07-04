import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/account",
        "/owner",
        "/account/admin/",
        "/api",
        "/tvseries",
        "/anime",
        "/games",
      ],
    },
    // sitemap: [],
  };
}
