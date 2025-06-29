"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Prefetch upload page when user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.prefetch("/upload");
    }
  }, [status, router]);

  const handleUploadClick = async () => {
    setIsLoading(true);

    try {
      if (status === "authenticated") {
        // User is logged in, redirect to upload
        router.push("/upload");
      } else {
        // User is not logged in, trigger Google sign-in
        await signIn("google");
      }
    } catch (error) {
      console.error("Error during upload flow:", error);
    } finally {
      // Don't reset loading state immediately to avoid flicker
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const isLoadingState = status === "loading" || isLoading;

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
          disabled={isLoadingState}
        >
          <Icon
            icon={
              isLoadingState ? "line-md:loading-loop" : "hugeicons:ai-beautify"
            }
            width="20"
            height="20"
            className={isLoadingState ? "animate-spin" : ""}
          />
          {isLoadingState
            ? "Loading..."
            : status === "authenticated"
            ? "Upload Resume"
            : "Get Started"}
        </Button>
      </div>
    </div>
  );
}
