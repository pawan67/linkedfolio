import { MetadataRoute } from "next";
import { db } from "@/drizzle/db/drizzle";
import { profiles } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all published profiles
  const publishedProfiles = await db
    .select({ slug: profiles.slug })
    .from(profiles)
    .where(eq(profiles.isPublished, true));

  const profileUrls = publishedProfiles.map((profile) => ({
    url: `https://linkedfolio.vercel.app/${profile.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://linkedfolio.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...profileUrls,
  ];
}
