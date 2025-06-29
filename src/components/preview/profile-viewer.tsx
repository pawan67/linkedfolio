"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Building, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/drizzle/db/schema";
import { Icon } from "@iconify/react";
import Link from "next/link";
import ThemeToggle from "../shared/theme-toggle";
import Image from "next/image";
import Script from "next/script";

interface ProfileViewerProps {
  profileData: Profile;
  image?: string | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const calculateDuration = (from: string, to: string | null) => {
  const fromDate = new Date(from);
  const toDate = to ? new Date(to) : new Date();

  const months =
    (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (toDate.getMonth() - fromDate.getMonth());

  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`;
    }
    return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${
      remainingMonths !== 1 ? "s" : ""
    }`;
  }
};

// Generate structured data for SEO
const generateStructuredData = (
  profileData: Profile,
  image?: string | null
) => {
  const {
    name,
    location,
    bio,
    about,
    skills,
    experiences,
    socials,
    education = [],
  } = profileData;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    description: bio || about,
    image: image || "/images/logo.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
    },
    knowsAbout: skills?.map((skill) => skill.name) || [],
    alumniOf:
      education?.map((edu) => ({
        "@type": "EducationalOrganization",
        name: edu.institution,
      })) || [],
    worksFor:
      experiences?.map((exp) => ({
        "@type": "Organization",
        name: exp.company,
        jobTitle: exp.role,
      })) || [],
    sameAs: socials?.map((social) => social.url) || [],
  };

  return JSON.stringify(structuredData);
};

export default function ProfileViewer({
  profileData,
  image,
}: ProfileViewerProps) {
  const {
    name,
    location,
    bio,
    about,
    skills,
    experiences,
    projects,
    socials,
    education = [],
  } = profileData;

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(profileData, image),
        }}
      />

      <div className="  space-y-5">
        {/* Header Section */}
        <Card className="overflow-hidden relative">
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>
          <CardContent className="   ">
            <div className="flex flex-col-reverse text-center md:text-left items-center  md:flex-row gap-4 md:gap-8   ">
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {name}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-3">{bio}</p>
                  <div className="flex justify-center md:justify-start items-center text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2  ">
                  {socials.map((social, index) => {
                    return (
                      <Link
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-muted p-2 rounded-full hover:bg-muted-foreground/10 transition-all duration-300"
                      >
                        <Icon icon={social.icon} width={24} height={24} />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg">
                  <Image
                    width={128}
                    height={128}
                    src={image || "/placeholder.svg?height=192&width=192"}
                    alt={`${name}'s profile photo`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{about}</p>
          </CardContent>
        </Card>

        {/* Work Experience Section */}
        {experiences.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {exp.role}
                      </h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    <div className="flex flex-col sm:items-end text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        <span>
                          {formatDate(exp.from)} -{" "}
                          {exp.to ? formatDate(exp.to) : "Present"}
                        </span>
                      </div>
                      <span className="text-xs">
                        {calculateDuration(exp.from, exp.to)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                    {exp.isCurrent && (
                      <Badge variant="secondary" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </div>

                  <p className="text-foreground">{exp.description}</p>

                  {index < experiences.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project, index) => (
                <div key={project.id}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {project.name}
                    </h3>
                    <div className="flex gap-2">
                      {project.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Project
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-foreground">{project.description}</p>
                  {index < projects.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div key={edu.id}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {edu.degree}
                      </h3>
                      <p className="text-primary font-medium">
                        {edu.institution}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        <span>
                          {formatDate(edu.from)} -{" "}
                          {edu.to ? formatDate(edu.to) : "Present"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{edu.location}</span>
                  </div>

                  {edu.description && (
                    <p className="text-foreground">{edu.description}</p>
                  )}

                  {index < education.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
