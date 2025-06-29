"use client";
import { Button, buttonVariants } from "../ui/button";
import { Card } from "../ui/card";
import ProfileEditor from "./profile-editor";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Profile } from "@/drizzle/db/schema";
import { useMutation } from "@tanstack/react-query";
import {
  checkIfSlugExists,
  deleteProfile,
  togglePublishProfile,
  updateSlug,
} from "@/server-actions/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProfileViewer from "./profile-viewer";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@mantine/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
const Preview = ({ profile }: { profile: Profile }) => {
  const [view, setView] = useState("preview");
  const router = useRouter();
  const [slug, setSlug] = useState(profile.slug as string);
  const [debouncedSlug] = useDebouncedValue(slug, 200);
  const [isSlugAvailable, setIsSlugAvailable] = useState(true);

  const { mutate: checkSlugMutation, isPending: isCheckingSlug } = useMutation({
    mutationFn: () => checkIfSlugExists(debouncedSlug),
    onSuccess: () => {
      setIsSlugAvailable(true);
    },
    onError: () => {
      setIsSlugAvailable(false);
    },
  });

  const { mutate: updateSlugMutation, isPending: isUpdatingSlug } = useMutation(
    {
      mutationFn: () => updateSlug(debouncedSlug, profile.id),
      onSuccess: () => {
        toast.success("Slug updated successfully");
      },
    }
  );

  const handleUpdateSlug = () => {
    updateSlugMutation();
  };

  useEffect(() => {
    if (debouncedSlug === "") {
      toast.error("Slug cannot be empty");
      setIsSlugAvailable(false);
      return;
    }
    if (debouncedSlug) {
      checkSlugMutation();
    }
  }, [debouncedSlug, checkSlugMutation]);

  const { mutate: deleteProfileMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteProfile(profile.id),
    onSuccess: () => {
      toast.success("Profile deleted successfully");
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to delete profile");
    },
  });

  const { mutate: togglePublishProfileMutation, isPending: isPublishing } =
    useMutation({
      mutationFn: () => togglePublishProfile(profile.id),
      onSuccess: () => {
        toast.success(
          profile.isPublished
            ? "Profile unpublished successfully"
            : "Profile published successfully"
        );
      },
    });

  const { user } = useUser();

  const handleDelete = () => {
    deleteProfileMutation();
  };

  console.log(profile);
  return (
    <main className="max-w-3xl mx-auto">
      <Card className="  p-4">
        <div className=" flex  gap-5 items-center flex-col md:flex-row  lg:justify-between w-full">
          <div className=" flex items-center gap-2 ">
            <div className=" flex items-center gap-2">
              <Icon icon="ic:baseline-link" width="24" height="24" />
              <span className=" text-sm">linkedfolio.vercel.app/</span>
            </div>

            <div className=" flex items-center gap-2 border rounded-lg  ">
              <div className=" px-3 w-40 text-sm">{profile.slug}</div>
              <div className=" border-l">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className=" size-11" size="icon">
                      <Icon icon="mdi:pencil" width="24" height="24" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Slug</DialogTitle>
                      <DialogDescription>
                        Edit the slug for your profile.
                      </DialogDescription>
                    </DialogHeader>
                    <div className=" flex items-center gap-2">
                      <div className=" flex flex-col gap-2 w-full">
                        <Input
                          className={` ${
                            isSlugAvailable
                              ? "border-green-500"
                              : "border-red-500"
                          }`}
                          type="text"
                          value={slug}
                          onChange={(e) => {
                            setSlug(e.target.value);
                          }}
                          placeholder="Enter new slug"
                        />
                        <p className=" text-sm text-muted-foreground">
                          {isCheckingSlug
                            ? "Checking..."
                            : isSlugAvailable
                            ? "Slug is available"
                            : "Slug is not available"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleUpdateSlug}
                      disabled={isUpdatingSlug}
                    >
                      {isUpdatingSlug ? "Updating..." : "Save"}
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className=" flex items-center gap-2">
            <div className=" text-sm flex items-center gap-1  ">
              <div
                className={` ${
                  profile.isPublished ? "bg-green-500" : "bg-orange-500"
                } dark:bg-orange-300 size-2 rounded-full`}
              ></div>
              {profile.isPublished ? "LIVE" : "DRAFT"}
            </div>
            <Button
              variant="outline"
              onClick={() => togglePublishProfileMutation()}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <Icon
                  icon="mdi:loading"
                  width="24"
                  height="24"
                  className="animate-spin"
                />
              ) : profile.isPublished ? (
                "Unpublish"
              ) : (
                "Publish"
              )}
            </Button>
            {profile.isPublished && (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={`/${profile.slug}`}
                className={cn(buttonVariants())}
              >
                <Icon icon="mdi:eye" width="24" height="24" />
                <span>Preview</span>
              </Link>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon">
                  <Icon icon="mdi:delete" width="24" height="24" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
      <div className=" flex items-center justify-between w-full">
        <div className=" my-5 flex items-center gap-2">
          <Button
            variant={view === "preview" ? "outline" : "ghost"}
            onClick={() => setView("preview")}
          >
            <Icon icon="mdi:eye" width="24" height="24" />
            <span>Preview</span>
          </Button>
          <Button
            variant={view === "edit" ? "outline" : "ghost"}
            onClick={() => setView("edit")}
          >
            <Icon icon="mdi:pencil" width="24" height="24" />
            <span>Edit</span>
          </Button>
        </div>
      </div>
      <div className="  ">
        {view === "preview" ? (
          <ProfileViewer image={user?.imageUrl} profileData={profile} />
        ) : (
          <ProfileEditor profile={profile} />
        )}
      </div>
    </main>
  );
};

export default Preview;
