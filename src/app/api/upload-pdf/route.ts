import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import os from "os";
import { getAuth } from "@clerk/nextjs/server";
import { callOpenRouterForProfile } from "@/lib/openrouter";
import { db } from "@/drizzle/db/drizzle";
import {
  profiles,
  skills,
  experiences,
  projects,
  socials,
  education,
} from "@/drizzle/db/schema";

function shortId(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const uploadedFile = formData.get("FILE");
    let fileName = "";
    let parsedText = "";
    console.log(uploadedFile);

    if (uploadedFile && uploadedFile instanceof File) {
      fileName = uuidv4();
      const tempDir = os.tmpdir();
      const tempFilePath = `${tempDir}/${fileName}.pdf`;
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
      await fs.writeFile(tempFilePath, fileBuffer);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParser = new (PDFParser as any)(null, 1);

      await new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfParser.on("pdfParser_dataError", (errData: any) =>
          reject(errData.parserError)
        );
        pdfParser.on("pdfParser_dataReady", () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parsedText = (pdfParser as any).getRawTextContent();
          resolve(null);
        });
        pdfParser.loadPDF(tempFilePath);
      });
      await fs.unlink(tempFilePath);
    } else {
      return NextResponse.json(
        { error: "Uploaded file is not in the expected format." },
        { status: 400 }
      );
    }

    // 2. Call OpenRouter to generate profile
    const profile = await callOpenRouterForProfile(parsedText);

    // 2.5. Insert profile into database (without skills, experiences, socials, projects)
    const profileId = uuidv4();
    const slug = profile.slug + "-" + shortId();
    const now = new Date();
    const [insertedProfile] = await db
      .insert(profiles)
      .values({
        userId: userId,
        slug: slug,
        id: profileId,
        bio: profile.bio ?? "",
        name: profile.name ?? "",
        location: profile.location ?? "",
        about: profile.about ?? "",
        createdAt: now,
        updatedAt: now,
        isPublished: false,
      })
      .returning();

    // 2.6. Insert related data into their own tables
    if (Array.isArray(profile.skills) && profile.skills.length > 0) {
      await db.insert(skills).values(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile.skills.map((skill: any) => ({
          name: skill.name,
          profileId,
        }))
      );
    }
    if (Array.isArray(profile.experiences) && profile.experiences.length > 0) {
      await db.insert(experiences).values(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile.experiences.map((exp: any) => ({
          role: exp.role,
          company: exp.company,
          description: exp.description,
          from: exp.from,
          to: exp.to,
          location: exp.location,
          isCurrent: exp.isCurrent ?? false,
          profileId,
        }))
      );
    }
    if (Array.isArray(profile.projects) && profile.projects.length > 0) {
      await db.insert(projects).values(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile.projects.map((proj: any) => ({
          name: proj.name,
          url: proj.url,
          description: proj.description,
          profileId,
        }))
      );
    }
    if (Array.isArray(profile.socials) && profile.socials.length > 0) {
      await db.insert(socials).values(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile.socials.map((soc: any) => ({
          url: soc.url,
          icon: soc.icon,
          profileId,
        }))
      );
    }
    if (Array.isArray(profile.education) && profile.education.length > 0) {
      await db.insert(education).values(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile.education.map((edu: any) => ({
          degree: edu.degree,
          institution: edu.institution,
          from: edu.from,
          to: edu.to,
          location: edu.location,
          description: edu.description,
          profileId,
        }))
      );
    }
    // 3. Return the generated profile and DB result
    return NextResponse.json({ profile, fileName, insertedProfile });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to extract text from PDF" },
      { status: 500 }
    );
  }
}
