import Preview from "@/components/preview";
import { Profile } from "@/drizzle/db/schema";
import { getProfile } from "@/server-actions/profile";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Portfolio",
  description:
    "Preview and edit your professional portfolio before publishing. Customize your profile with our intuitive editor.",
  robots: {
    index: false,
    follow: false,
  },
};

const PreviewPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    redirect("/upload");
  }

  return <Preview profile={profile as Profile} />;
};

export default PreviewPage;
