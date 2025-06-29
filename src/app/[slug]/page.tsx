import ProfileViewer from "@/components/preview/profile-viewer";
import { Profile } from "@/drizzle/db/schema";
import { getProfileBySlug } from "@/server-actions/profile";
import { clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

const ProfilePage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const profile = await getProfileBySlug(slug);

  const user = await (await clerkClient()).users.getUser(profile.userId);

  if (!profile) {
    return notFound();
  }

  return (
    <ProfileViewer profileData={profile as Profile} image={user.imageUrl} />
  );
};

export default ProfilePage;
