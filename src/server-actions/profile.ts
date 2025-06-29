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
import { auth } from "@/lib/auth";

export const getProfile = async (userId: string) => {
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId));

  // If no profile found, return null
  if (profile.length === 0) {
    return null;
  }

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

  // If no profile found, return null
  if (profile.length === 0) {
    return null;
  }

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

export const updateProfile = async (
  profileId: string,
  data: {
    name?: string;
    location?: string;
    bio?: string;
    about?: string;
  }
) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  await db
    .update(profiles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profileId));

  revalidatePath("/preview");
  revalidatePath(`/${profiles.slug}`);
};

export const updateProfileSkills = async (
  profileId: string,
  skillsData: Array<{
    id: string;
    name: string;
  }>
) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Delete existing skills
  await db.delete(skills).where(eq(skills.profileId, profileId as string));

  // Insert new skills
  if (skillsData.length > 0) {
    await db.insert(skills).values(
      skillsData.map((skill) => ({
        id: skill.id,
        name: skill.name,
        profileId: profileId as string,
      }))
    );
  }

  revalidatePath("/preview");
};

export const updateProfileExperiences = async (
  profileId: string,
  experiencesData: Array<{
    id: string;
    role: string;
    company?: string;
    description?: string;
    from: string;
    to?: string;
    location?: string;
    isCurrent?: boolean;
  }>
) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Delete existing experiences
  await db
    .delete(experiences)
    .where(eq(experiences.profileId, profileId as string));

  // Insert new experiences
  if (experiencesData.length > 0) {
    await db.insert(experiences).values(
      experiencesData.map((exp) => ({
        id: exp.id,
        role: exp.role,
        company: exp.company || null,
        description: exp.description || null,
        from: exp.from,
        to: exp.to || null,
        location: exp.location || null,
        isCurrent: exp.isCurrent || false,
        profileId: profileId as string,
      }))
    );
  }

  revalidatePath("/preview");
};

export const updateProfileProjects = async (
  profileId: string,
  projectsData: Array<{
    id: string;
    name: string;
    url?: string;
    description?: string;
  }>
) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Delete existing projects
  await db.delete(projects).where(eq(projects.profileId, profileId as string));

  // Insert new projects
  if (projectsData.length > 0) {
    await db.insert(projects).values(
      projectsData.map((project) => ({
        id: project.id,
        name: project.name,
        url: project.url || null,
        description: project.description || null,
        profileId: profileId as string,
      }))
    );
  }

  revalidatePath("/preview");
};

export const updateProfileSocials = async (
  profileId: string,
  socialsData: Array<{
    id: string;
    url: string;
    icon: string;
  }>
) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Delete existing socials
  await db.delete(socials).where(eq(socials.profileId, profileId as string));

  // Insert new socials
  if (socialsData.length > 0) {
    await db.insert(socials).values(
      socialsData.map((social) => ({
        id: social.id,
        url: social.url,
        icon: social.icon,
        profileId: profileId as string,
      }))
    );
  }

  revalidatePath("/preview");
};

export const saveFullProfile = async (
  profileId: string,
  data: {
    name?: string;
    location?: string;
    bio?: string;
    about?: string;
    skills: Array<{ id: string; name: string }>;
    experiences: Array<{
      id: string;
      role: string;
      company?: string;
      description?: string;
      from: string;
      to?: string;
      location?: string;
      isCurrent?: boolean;
    }>;
    projects: Array<{
      id: string;
      name: string;
      url?: string;
      description?: string;
    }>;
    socials: Array<{
      id: string;
      url: string;
      icon: string;
    }>;
  }
) => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Update main profile
  await updateProfile(profileId, {
    name: data.name,
    location: data.location,
    bio: data.bio,
    about: data.about,
  });

  // Update related data
  await updateProfileSkills(profileId, data.skills);
  await updateProfileExperiences(profileId, data.experiences);
  await updateProfileProjects(profileId, data.projects);
  await updateProfileSocials(profileId, data.socials);

  return { success: true };
};
