"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Experience {
  role: string;
  company: string;
  location: string;
  from: string;
  to: string;
  description: string;
}

export default function AEdit() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (idx: number) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        role: "",
        company: "",
        location: "",
        from: "",
        to: "",
        description: "",
      },
    ]);
  };

  const updateExperience = (
    idx: number,
    field: keyof Experience,
    value: string
  ) => {
    setExperiences(
      experiences.map((exp, i) =>
        i === idx ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (idx: number) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
  };

  return (
    <Card className=" max-w-3xl mx-auto">
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, idx) => (
                <Badge key={idx} className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    className="ml-1 text-xs"
                    onClick={() => removeSkill(idx)}
                  >
                    &times;
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <Button type="button" onClick={addSkill}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Work Experience</CardTitle>
            <CardAction>
              <Button type="button" variant="default" onClick={addExperience}>
                + Add Work Experience
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {experiences.map((exp, idx) => (
              <Card key={idx} className="relative">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Job Title</CardTitle>
                  <CardAction>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => removeExperience(idx)}
                    >
                      &times;
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className=" w-full">
                    <Label>Job Title</Label>
                    <Input
                      value={exp.role}
                      onChange={(e) =>
                        updateExperience(idx, "role", e.target.value)
                      }
                      placeholder="Job Title"
                    />
                  </div>
                  <div className=" w-full">
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(idx, "company", e.target.value)
                      }
                      placeholder="Company"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(idx, "location", e.target.value)
                      }
                      placeholder="Location"
                    />
                  </div>
                  <div className=" grid grid-cols-2 gap-4">
                    <div className="flex-1">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.from}
                        onChange={(e) =>
                          updateExperience(idx, "from", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.to}
                        onChange={(e) =>
                          updateExperience(idx, "to", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Input
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(idx, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
