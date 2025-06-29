import Preview from "@/components/preview";
import { Profile } from "@/drizzle/db/schema";
import { getProfile } from "@/server-actions/profile";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const PreviewPage = async () => {
  const user = await currentUser();
  const profile = await getProfile(user?.id as string);
  if (!user || !profile) {
    redirect("/");
  }
  return <Preview profile={profile as Profile} />;
};

export default PreviewPage;
