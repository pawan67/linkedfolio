import {
  text,
  boolean,
  pgTable,
  varchar,
  timestamp,
  date,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  userId: varchar("user_id", { length: 64 }).notNull(),
  slug: varchar("slug", { length: 64 }),
  name: varchar("name", { length: 100 }),
  location: varchar("location", { length: 100 }),
  bio: text("bio"),
  about: text("about"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isPublished: boolean("is_published").default(false),
});

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  profileId: varchar("profile_id", { length: 64 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  profileId: varchar("profile_id", { length: 64 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  company: varchar("company", { length: 100 }),
  description: text("description"),
  from: date("from").notNull(),
  to: date("to"),
  location: varchar("location", { length: 100 }),
  isCurrent: boolean("is_current").default(false),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  profileId: varchar("profile_id", { length: 64 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  url: varchar("url", { length: 255 }),
  description: text("description"),
});

export const socials = pgTable("socials", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 64 }).notNull(),
});

export const education = pgTable("education", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  profileId: varchar("profile_id", { length: 64 }).notNull(),
  degree: varchar("degree", { length: 100 }).notNull(),
  institution: varchar("institution", { length: 100 }).notNull(),
  from: date("from").notNull(),
  to: date("to"),
  location: varchar("location", { length: 100 }),
  description: text("description"),
});

export type Social = typeof socials.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Education = typeof education.$inferSelect;
export type ProfileDB = typeof profiles.$inferSelect;

export type Profile = Omit<
  ProfileDB,
  "socials" | "experiences" | "skills" | "projects"
> & {
  socials: Social[];
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
  education: Education[];
};

export const profileSelectSchema = createSelectSchema(profiles);
