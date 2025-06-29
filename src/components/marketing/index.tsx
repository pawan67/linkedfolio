"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import Image from "next/image";

export default function Home({ profileCount }: { profileCount: number }) {
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
    <div className="max-w-5xl min-h-[70vh] mx-auto">
      <div className="my-10 grid grid-cols-1 md:grid-cols-2 items-center  gap-10">
        <div className=" text-center md:text-left">
          <Badge variant="outline" className="text-xs   mt-2">
            100% free and open source.
          </Badge>

          <h1 className="text-4xl mt-4 font-sans font-extrabold tracking-tight">
            Turn Your Resume <br />
            to Website
          </h1>
          <p className=" text-muted-foreground mt-4">
            Turn your resume or LinkedIn PDF into a live, shareable portfolio —
            in one click.
          </p>

          <Button
            onClick={handleUploadClick}
            className="h-12 w-44 mt-4 gap-2"
            variant="default"
            disabled={isLoadingState}
          >
            <Icon
              icon={
                isLoadingState
                  ? "line-md:loading-loop"
                  : "hugeicons:ai-beautify"
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
          <p className="text-sm text-muted-foreground mt-4">
            {profileCount} portfolios have been created so far.
          </p>
        </div>

        <div>
          <Image
            className=" rounded-lg hidden dark:block"
            src={"/images/image-dark.png"}
            alt="portfolio"
            width={500}
            height={500}
          />
          <Image
            className=" rounded-lg dark:hidden block"
            src={"/images/image-light.png"}
            alt="portfolio"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
