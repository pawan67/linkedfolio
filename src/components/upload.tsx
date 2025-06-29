"use client";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "./magicui/rainbow-button";
import { Card } from "./ui/card";
import { ShineBorder } from "./magicui/shine-border";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
interface FileUploadProgress {
  progress: number;
  file: File;
}

export function FileUpload({ maxSize }: { maxSize: number }) {
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const router = useRouter();

  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.file !== file);
    });
  };

  const uploadFileToApi = async (file: File) => {
    const formData = new FormData();
    formData.append("FILE", file);
    try {
      setIsLoading(true);
      setGenerationTime(null);
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const result = await response.json();

      // Store generation time for display
      if (result.timing?.totalTime) {
        setGenerationTime(result.timing.totalTime);
      }

      // Small delay to show the timing before redirect
      setTimeout(() => {
        router.push("/preview");
      }, 1500);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError("");
    if (acceptedFiles.length > 1) {
      setError("Please upload only one PDF file.");
      return;
    }
    const file = acceptedFiles[0];
    setFilesToUpload([{ file, progress: 100 }]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxSize,
    multiple: false,
  });

  return (
    <Card className=" p-5 relative">
      {isLoading && (
        <ShineBorder
          shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          borderWidth={2}
        />
      )}

      <div className=" text-center">
        <p className=" text-muted-foreground  font-medium ">
          Upload your resume or Linkedin profile PDF to get started.
        </p>
      </div>
      <div
        {...getRootProps()}
        className=" border-2 border-dashed mt-5  rounded-lg p-5 min-h-64 flex justify-center items-center text-center cursor-pointer bg-secondary-background "
      >
        <input {...getInputProps()} />
        {filesToUpload.length > 0 ? (
          <div>
            {filesToUpload.map((fileUploadProgress) => (
              <div key={fileUploadProgress.file.lastModified}>
                <span className=" mr-2">📄</span>
                <span className=" flex-1">
                  {fileUploadProgress.file.name.slice(0, 25)}
                </span>
                <span className=" ml-2">{fileUploadProgress.progress}%</span>

                <Button
                  onClick={() => removeFile(fileUploadProgress.file)}
                  className=" ml-2"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p>
            <b>Upload PDF</b>
            <br />
            <span style={{ fontSize: 12, color: "#666" }}>
              Resume or Linkedin Profile PDF
            </span>
          </p>
        )}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className=" cursor-help" variant="outline" size="sm">
            <Icon icon="mdi:help-circle" className="h-4 w-4" />
            How to upload linkedin profile?
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" text-center text-lg font-medium  text-muted-foreground">
              Go to your profile → Click on “Resources” → Then “Save to PDF”
            </DialogTitle>
          </DialogHeader>
          <Image
            src="/images/linkedin-screenshot.png"
            alt="Linkedin profile"
            width={1000}
            height={1000}
            className="rounded-lg"
          />
        </DialogContent>
      </Dialog>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

      {/* Alert for generation time notice */}
      {filesToUpload.length > 0 && isLoading && (
        <Alert className="mt-4">
          <Icon icon="mdi:clock-outline" className="h-4 w-4" />
          <AlertDescription>
            Profile generation can take 15-20 seconds. Please wait patiently
            while we process your PDF.
          </AlertDescription>
        </Alert>
      )}

      {/* Success message with generation time */}
      {generationTime && !isLoading && (
        <Alert className="mt-4  ">
          <Icon icon="mdi:check-circle" className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            Profile generated successfully in{" "}
            {(generationTime / 1000).toFixed(1)} seconds! Redirecting to
            preview...
          </AlertDescription>
        </Alert>
      )}

      <div className=" mt-5 flex justify-center">
        <RainbowButton
          disabled={filesToUpload.length === 0 || isLoading}
          size="lg"
          onClick={() => uploadFileToApi(filesToUpload[0].file)}
          className=" text-md px-6 h-12 mt-4 w-full gap-2"
        >
          <Icon
            icon={isLoading ? "line-md:loading-loop" : "hugeicons:ai-beautify"}
            width="32"
            height="32"
          />
          {isLoading ? "Generating..." : "Generate"}
        </RainbowButton>
      </div>
    </Card>
  );
}
