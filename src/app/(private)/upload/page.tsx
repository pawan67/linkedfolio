import { FileUpload } from "@/components/upload";
import { checkIfProfileExists } from "@/server-actions/profile";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const profileExists = await checkIfProfileExists(session.user.id);

  if (profileExists) {
    redirect("/preview");
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <FileUpload maxSize={8 * 1024 * 1024} />
    </div>
  );
}
