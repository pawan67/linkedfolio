import { FileUpload } from "@/components/upload";
import { checkIfProfileExists } from "@/server-actions/profile";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { ProfileExistsRedirect } from "@/components/profile-exists-redirect";
import { UploadError } from "@/components/upload-error";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Resume - Create Your Portfolio",
  description:
    "Upload your LinkedIn profile or resume PDF to create a beautiful professional portfolio. AI-powered profile generation with stunning templates.",
  robots: {
    index: false,
    follow: false,
  },
};

// Loading component for better UX
function UploadPageLoading() {
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <Card className="p-5 relative">
        <div className="text-center">
          <Icon
            icon="line-md:loading-loop"
            className="h-8 w-8 mx-auto mb-4 animate-spin text-primary"
          />
          <p className="text-muted-foreground font-medium">
            Loading upload page...
          </p>
        </div>
      </Card>
    </div>
  );
}

export default async function UploadPage() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      redirect("/");
    }

    // Check if profile exists
    const profileExists = await checkIfProfileExists(session.user.id);

    if (profileExists) {
      // Show message and redirect using client component
      return <ProfileExistsRedirect />;
    }

    return (
      <Suspense fallback={<UploadPageLoading />}>
        <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
          <FileUpload maxSize={8 * 1024 * 1024} />
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error("Error in upload page:", error);

    // Use the error component
    return <UploadError />;
  }
}
