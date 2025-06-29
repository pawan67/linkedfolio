import { FileUpload } from "@/components/upload";
import { checkIfProfileExists } from "@/server-actions/profile";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const user = await currentUser();

  const profileExists = await checkIfProfileExists(user?.id || "");

  if (profileExists) {
    redirect("/preview");
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <FileUpload maxSize={8 * 1024 * 1024} />
    </div>
  );
}
