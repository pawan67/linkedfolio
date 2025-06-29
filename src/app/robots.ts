import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/upload", "/preview", "/api/"],
    },
    sitemap: "https://linkedfolio.vercel.app/sitemap.xml",
  };
}
