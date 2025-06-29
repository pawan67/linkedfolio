"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  const handleUploadClick = () => {
    if (status === "authenticated") {
      // User is logged in, redirect to upload
      router.push("/upload");
    } else {
      // User is not logged in, trigger Google sign-in
      signIn("google");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="my-20">
        <h1 className="text-5xl font-sans font-extrabold tracking-tight">
          Linkedin to Website
          <br /> in 1 click
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          Create a website from your Linkedin profile in 1 click.
        </p>

        <Button
          onClick={handleUploadClick}
          className="h-12 w-44 mt-4 gap-2"
          variant="default"
          disabled={status === "loading"}
        >
          <Icon icon="hugeicons:ai-beautify" width="20" height="20" />
          {status === "loading"
            ? "Loading..."
            : status === "authenticated"
            ? "Upload Resume"
            : "Get Started"}
        </Button>
      </div>
    </div>
  );
}
