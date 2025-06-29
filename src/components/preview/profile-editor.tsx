"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type {
  Social,
  Skill,
  Experience,
  Project,
  Profile,
} from "@/drizzle/db/schema";
import { Icon } from "@iconify/react";
import { saveFullProfile } from "@/server-actions/profile";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfileEditor({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(profile.name || "");
  const [location, setLocation] = useState(profile.location || "");
  const [about, setAbout] = useState(profile.about || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [socials, setSocials] = useState(profile.socials || []);
  const [skills, setSkills] = useState(profile.skills || []);
  const [experiences, setExperiences] = useState(profile.experiences || []);
  const [projects, setProjects] = useState(profile.projects || []);
  const [newSkill, setNewSkill] = useState("");

  // Social Links Management
  const addSocial = () => {
    const newSocial: Social = {
      id: crypto.randomUUID(),
      url: "",
      icon: "mdi:link", // Default icon
      profileId: profile.id as string,
    };
    setSocials([...socials, newSocial]);
  };

  const updateSocial = (id: string, field: keyof Social, value: string) => {
    setSocials(
      socials.map((social) =>
        social.id === id ? { ...social, [field]: value } : social
      )
    );
  };

  const removeSocial = (id: string) => {
    setSocials(socials.filter((social) => social.id !== id));
  };

  // Skills Management
  const addSkill = () => {
    if (newSkill.trim()) {
      const skill: Skill = {
        id: crypto.randomUUID(),
        name: newSkill.trim(),
        profileId: profile.id as string,
      };
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  // Experience Management
  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      role: "",
      company: "",
      description: "",
      from: "",
      to: "",
      location: "",
      isCurrent: false,
      profileId: profile.id as string,
    };
    setExperiences([...experiences, newExperience]);
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  // Project Management
  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: "",
      url: "",
      description: "",
      profileId: profile.id as string,
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  // Save Profile
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await saveFullProfile(profile.id, {
        name,
        location,
        bio,
        about,
        skills,
        experiences: experiences.map((exp) => ({
          id: exp.id,
          role: exp.role,
          company: exp.company || undefined,
          description: exp.description || undefined,
          from: exp.from,
          to: exp.to || undefined,
          location: exp.location || undefined,
          isCurrent: exp.isCurrent || false,
        })),
        projects: projects.map((project) => ({
          id: project.id,
          name: project.name,
          url: project.url || undefined,
          description: project.description || undefined,
        })),
        socials,
      });

      toast.success("Profile saved successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const DatePicker = ({
    date,
    onDateChange,
    placeholder = "Pick a date",
  }: {
    date?: Date;
    onDateChange: (date: Date | undefined) => void;
    placeholder?: string;
  }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start mt-2 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MMM yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Header</CardTitle>
        </CardHeader>
        <CardContent>
          <div className=" grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                className="mt-2"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                className="mt-2"
                id="location"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              className="mt-2"
              id="bio"
              placeholder="About"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Social Links
            <Button onClick={addSocial} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Social Link
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {socials.map((social, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Icon
                    icon={social.icon || "mdi:link"}
                    className="h-5 w-5 text-muted-foreground"
                  />
                  <span className="text-sm font-medium">Social Link</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocial(social.id)}
                  className="h-8 w-8 p-0 text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`social-icon-${social.id}`}>
                    Icon Name
                    <span className="text-xs text-muted-foreground ml-1">
                      (from{" "}
                      <a
                        href="https://iconify.design"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline"
                      >
                        Iconify
                      </a>
                      )
                    </span>
                  </Label>
                  <Input
                    id={`social-icon-${social.id}`}
                    placeholder="mdi:github, simple-icons:linkedin, etc."
                    value={social.icon}
                    className=" mt-2"
                    onChange={(e) =>
                      updateSocial(social.id, "icon", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`social-url-${social.id}`}>URL</Label>
                  <Input
                    id={`social-url-${social.id}`}
                    placeholder="https://github.com/username"
                    value={social.url}
                    className=" mt-2"
                    onChange={(e) =>
                      updateSocial(social.id, "url", e.target.value)
                    }
                    type="url"
                  />
                </div>
              </div>
            </div>
          ))}

          {socials.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon
                icon="mdi:link-variant"
                className="h-12 w-12 mx-auto mb-2 opacity-50"
              />
              <p>No social links added yet</p>
              <p className="text-sm">
                Click &quot;Add Social Link&quot; to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Tell us about yourself, your experience, and what you're passionate about..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="min-h-[120px] mt-2"
          />
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Work Experience
            <Button onClick={addExperience} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {experiences.map((experience, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between gap-3 items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div>
                    <Label htmlFor={`role-${experience.id}`}>Job Title</Label>
                    <Input
                      className=" mt-2"
                      id={`role-${experience.id}`}
                      placeholder="Associate Software Engineer"
                      value={experience.role}
                      onChange={(e) =>
                        updateExperience(experience.id, "role", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`company-${experience.id}`}>Company</Label>
                    <Input
                      className=" mt-2"
                      id={`company-${experience.id}`}
                      placeholder="Lucien Solutions"
                      value={experience.company || ""}
                      onChange={(e) =>
                        updateExperience(
                          experience.id,
                          "company",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(experience.id)}
                  className="text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label htmlFor={`location-${experience.id}`}>Location</Label>
                <Input
                  id={`location-${experience.id}`}
                  placeholder="Mumbai, India"
                  value={experience.location || ""}
                  onChange={(e) =>
                    updateExperience(experience.id, "location", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <DatePicker
                    date={
                      experience.from ? new Date(experience.from) : undefined
                    }
                    onDateChange={(date) =>
                      updateExperience(
                        experience.id,
                        "from",
                        date?.toISOString().split("T")[0] || ""
                      )
                    }
                    placeholder="Start date"
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <DatePicker
                    date={experience.to ? new Date(experience.to) : undefined}
                    onDateChange={(date) =>
                      updateExperience(
                        experience.id,
                        "to",
                        date?.toISOString().split("T")[0] || ""
                      )
                    }
                    placeholder="End date"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${experience.id}`}
                  checked={experience.isCurrent || false}
                  onCheckedChange={(checked) =>
                    updateExperience(
                      experience.id,
                      "isCurrent",
                      checked ? true : false
                    )
                  }
                />
                <Label htmlFor={`current-${experience.id}`}>
                  I currently work here
                </Label>
              </div>

              <div>
                <Label htmlFor={`description-${experience.id}`}>
                  Description
                </Label>
                <Textarea
                  id={`description-${experience.id}`}
                  placeholder="Describe your role and responsibilities..."
                  value={experience.description || ""}
                  onChange={(e) =>
                    updateExperience(
                      experience.id,
                      "description",
                      e.target.value
                    )
                  }
                  className="min-h-[100px] mt-2"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Projects
            <Button onClick={addProject} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between gap-3 items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div>
                    <Label htmlFor={`project-name-${project.id}`}>
                      Project Name
                    </Label>
                    <Input
                      className=" mt-2"
                      id={`project-name-${project.id}`}
                      placeholder="My Awesome Project"
                      value={project.name}
                      onChange={(e) =>
                        updateProject(project.id, "name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`project-url-${project.id}`}>URL</Label>
                    <Input
                      className=" mt-2"
                      id={`project-url-${project.id}`}
                      placeholder="https://github.com/username/project"
                      value={project.url || ""}
                      onChange={(e) =>
                        updateProject(project.id, "url", e.target.value)
                      }
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label htmlFor={`project-description-${project.id}`}>
                  Description
                </Label>
                <Textarea
                  id={`project-description-${project.id}`}
                  placeholder="Describe your project..."
                  value={project.description || ""}
                  onChange={(e) =>
                    updateProject(project.id, "description", e.target.value)
                  }
                  className="min-h-[80px] mt-2"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              className="flex-1"
            />
            <Button onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {skill.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(skill.id)}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className="px-8"
          onClick={handleSaveProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
