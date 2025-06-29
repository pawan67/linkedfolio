"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className=" max-w-5xl mx-auto">
      <div className=" my-20">
        <h1 className=" text-5xl  font-sans font-extrabold tracking-tight">
          Linkedin to Website
          <br /> in 1 click
        </h1>
        <p className="  tex-">
          Create a website from your Linkedin profile in 1 click.
        </p>

        <Button
          onClick={() => router.push("/upload")}
          className="  h-12 w-44   mt-4 gap-2  "
          variant="default"
        >
          <Icon icon="hugeicons:ai-beautify" width="20" height="20" />
          Upload Resume
        </Button>
      </div>
    </div>
  );
}
