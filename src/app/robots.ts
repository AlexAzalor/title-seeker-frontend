import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
// Removed SEO indexing directives because AhrefsBot was repeatedly crawling random movie pages approximately every 20 minutes, triggering unnecessary server-side requests to the backend. Since SEO and search engine indexing are not needed for this personal project, these directives have been disabled to reduce unwanted crawler activity.
// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: {
//       userAgent: "*",
//       allow: ["/"],
//       disallow: [
//         // by ending the path with a slash blocks /path and everything below it
//         "/account/",
//         "/owner/",
//         "/account/admin/",
//         "/api/",
//         "/tvseries",
//         "/anime",
//         "/games",
//         "/portfolio/",
//         "/knowledge-base/",
//       ],
//     },
//     // sitemap: [],
//   };
// }
