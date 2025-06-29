import ProfileViewer from "@/components/preview/profile-viewer";
import { Profile } from "@/drizzle/db/schema";
import { getProfileBySlug } from "@/server-actions/profile";
import { notFound } from "next/navigation";
import { db } from "@/drizzle/db/drizzle";
import { users } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";

type Params = Promise<{ slug: string }>;

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

  return <ProfileViewer profileData={profile as Profile} image={userImage} />;
};

export default ProfilePage;
