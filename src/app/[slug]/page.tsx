import ProfileViewer from "@/components/preview/profile-viewer";
import { Profile } from "@/drizzle/db/schema";
import { getProfileBySlug } from "@/server-actions/profile";
import { notFound } from "next/navigation";
import { db } from "@/drizzle/db/drizzle";
import { users } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import SlugHeader from "@/components/shared/slug-header";

type Params = Promise<{ slug: string }>;

// Generate metadata for the profile page
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile || !profile.isPublished) {
    return {
      title: "Profile Not Found",
      description: "The requested profile could not be found.",
    };
  }

  const profileName = profile.name || "Professional";
  const title = `${profileName} - Professional Portfolio | LinkedFolio`;
  const description =
    profile.bio ||
    `${profileName}'s professional portfolio showcasing skills, experience, and achievements.`;

  // Extract skill names from the skills array
  const skillNames = profile.skills?.map((skill) => skill.name) || [];

  return {
    title,
    description,
    keywords: [
      profileName,
      "professional portfolio",
      "resume",
      "linkedin",
      "career",
      "skills",
      "experience",
      ...skillNames,
    ],
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://linkedfolio.vercel.app/${slug}`,
      images: ["/images/logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/logo.png"],
    },
    alternates: {
      canonical: `https://linkedfolio.vercel.app/${slug}`,
    },
  };
}

const ProfilePage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const profile = await getProfileBySlug(slug);

  if (!profile) {
    return notFound();
  }

  // Get user image from NextAuth users table
  const userData = await db
    .select({ image: users.image })
    .from(users)
    .where(eq(users.id, profile.userId));

  const userImage = userData[0]?.image || null;

  if (!profile.isPublished) {
    return notFound();
  }

  return (
    <>
      <SlugHeader image={userImage} profileData={profile as Profile} />

      <main className="  ">
        <ProfileViewer profileData={profile as Profile} image={userImage} />
      </main>
    </>
  );
};

export default ProfilePage;
