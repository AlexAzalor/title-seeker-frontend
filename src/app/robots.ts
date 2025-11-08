import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        // by ending the path with a slash blocks /path and everything below it
        "/account/",
        "/owner/",
        "/account/admin/",
        "/api/",
        "/tvseries",
        "/anime",
        "/games",
        "/portfolio/",
        "/knowledge-base/",
      ],
    },
    // sitemap: [],
  };
}
