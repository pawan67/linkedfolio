import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import os from "os";
import { auth } from "@/lib/auth";
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
  const startTime = Date.now();
  const session = await auth();
  if (!session?.user?.id) {
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
    const aiStartTime = Date.now();
    const profile = await callOpenRouterForProfile(parsedText);
    const aiEndTime = Date.now();
    const aiGenerationTime = aiEndTime - aiStartTime;

    // 2.5. Insert profile into database (without skills, experiences, socials, projects)
    const profileId = uuidv4();
    const slug = profile.slug + "-" + shortId();
    const now = new Date();

    await db.insert(profiles).values({
      id: profileId,
      userId: session.user.id,
      slug: slug,
      name: profile.name,
      location: profile.location,
      bio: profile.bio,
      about: profile.about,
      createdAt: now,
      updatedAt: now,
      isPublished: false,
    });

    // 3. Insert skills
    if (profile.skills && profile.skills.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const skillsData = profile.skills.map((skill: any) => ({
        id: uuidv4(),
        profileId: profileId,
        name: skill.name,
      }));
      await db.insert(skills).values(skillsData);
    }

    // 4. Insert experiences
    if (profile.experiences && profile.experiences.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const experiencesData = profile.experiences.map((exp: any) => ({
        id: uuidv4(),
        profileId: profileId,
        role: exp.role,
        company: exp.company,
        description: exp.description,
        from: new Date(exp.from),
        to: exp.to ? new Date(exp.to) : null,
        location: exp.location,
        isCurrent: exp.isCurrent || false,
      }));
      await db.insert(experiences).values(experiencesData);
    }

    // 5. Insert projects
    if (profile.projects && profile.projects.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const projectsData = profile.projects.map((project: any) => ({
        id: uuidv4(),
        profileId: profileId,
        name: project.name,
        url: project.url,
        description: project.description,
      }));
      await db.insert(projects).values(projectsData);
    }

    // 6. Insert socials
    if (profile.socials && profile.socials.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const socialsData = profile.socials.map((social: any) => ({
        id: uuidv4(),
        profileId: profileId,
        url: social.url,
        icon: social.icon,
      }));
      await db.insert(socials).values(socialsData);
    }

    // 7. Insert education
    if (profile.education && profile.education.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const educationData = profile.education.map((edu: any) => ({
        id: uuidv4(),
        profileId: profileId,
        degree: edu.degree,
        institution: edu.institution,
        from: new Date(edu.from),
        to: edu.to ? new Date(edu.to) : null,
        location: edu.location,
        description: edu.description,
      }));
      await db.insert(education).values(educationData);
    }

    const totalTime = Date.now() - startTime;

    console.log(
      `Profile generation completed in ${totalTime}ms (AI: ${aiGenerationTime}ms)`
    );

    return NextResponse.json({
      success: true,
      slug: slug,
      generated: profile,
      timing: {
        totalTime: totalTime,
        aiGenerationTime: aiGenerationTime,
        databaseTime: totalTime - aiGenerationTime,
      },
    });
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`Error processing PDF after ${totalTime}ms:`, error);
    return NextResponse.json(
      {
        error: "Failed to process PDF",
        timing: {
          totalTime: totalTime,
        },
      },
      { status: 500 }
    );
  }
}
