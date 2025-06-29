"use server";
import { db } from "@/drizzle/db/drizzle";
import {
  education,
  experiences,
  profiles,
  projects,
  skills,
  socials,
} from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getProfile = async (userId: string) => {
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId));

  const skillsData = await db
    .select()
    .from(skills)
    .where(eq(skills.profileId, profile[0].id));
  const experiencesData = await db
    .select()
    .from(experiences)
    .where(eq(experiences.profileId, profile[0].id));
  const projectsData = await db
    .select()
    .from(projects)
    .where(eq(projects.profileId, profile[0].id));
  const socialsData = await db
    .select()
    .from(socials)
    .where(eq(socials.profileId, profile[0].id));
  const educationData = await db
    .select()
    .from(education)
    .where(eq(education.profileId, profile[0].id));

  return {
    ...profile[0],
    skills: skillsData,
    experiences: experiencesData,
    projects: projectsData,
    socials: socialsData,
    education: educationData,
  };
};

export const checkIfProfileExists = async (userId: string) => {
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId));
  return profile.length > 0;
};

export const checkIfSlugExists = async (slug: string) => {
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.slug, slug));

  return profile.length > 0;
};

export const updateSlug = async (slug: string, profileId: string) => {
  await db.update(profiles).set({ slug }).where(eq(profiles.id, profileId));
  revalidatePath("/preview");
  revalidatePath(`/${slug}`);
};

export const deleteProfile = async (profileId: string) => {
  await db.delete(profiles).where(eq(profiles.id, profileId));
  await db.delete(skills).where(eq(skills.profileId, profileId));
  await db.delete(experiences).where(eq(experiences.profileId, profileId));
  await db.delete(projects).where(eq(projects.profileId, profileId));
  await db.delete(socials).where(eq(socials.profileId, profileId));
  await db.delete(education).where(eq(education.profileId, profileId));
  revalidatePath("/preview");
};

export const togglePublishProfile = async (profileId: string) => {
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, profileId));
  if (profile[0].isPublished) {
    await db
      .update(profiles)
      .set({ isPublished: false })
      .where(eq(profiles.id, profileId));
  } else {
    await db
      .update(profiles)
      .set({ isPublished: true })
      .where(eq(profiles.id, profileId));
  }
  revalidatePath("/preview");
};

export const getProfileBySlug = async (slug: string) => {
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.slug, slug));

  const skillsData = await db
    .select()
    .from(skills)
    .where(eq(skills.profileId, profile[0].id));
  const experiencesData = await db
    .select()
    .from(experiences)
    .where(eq(experiences.profileId, profile[0].id));
  const projectsData = await db
    .select()
    .from(projects)
    .where(eq(projects.profileId, profile[0].id));
  const socialsData = await db
    .select()
    .from(socials)
    .where(eq(socials.profileId, profile[0].id));
  const educationData = await db
    .select()
    .from(education)
    .where(eq(education.profileId, profile[0].id));

  return {
    ...profile[0],
    skills: skillsData,
    experiences: experiencesData,
    projects: projectsData,
    socials: socialsData,
    education: educationData,
  };
};
