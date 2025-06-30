"use client";
import Link from "next/link";
import { Profile } from "@/drizzle/db/schema";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./theme-toggle";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

type Section = {
  name: string;
  url: string;
};

function HighlightFirstWord({ text }: { text: string }) {
  const words = text.trim().split(" ");

  if (words.length === 0) return null;

  const [first, ...rest] = words;

  return (
    <span className=" font-semibold  tracking-tight text-lg">
      <span className="text-primary font-semibold">{first}</span>{" "}
      {rest.join(" ")}
    </span>
  );
}

function generateHeaderLinks(profile: Profile): Section[] {
  const sections: Section[] = [];

  if (profile.experiences && profile.experiences.length > 0) {
    sections.push({ name: "Work", url: "#experiences" });
  }

  if (profile.projects && profile.projects.length > 0) {
    sections.push({ name: "Projects", url: "#projects" });
  }

  if (profile.skills && profile.skills.length > 0) {
    sections.push({ name: "Skills", url: "#skills" });
  }

  if (profile.education && profile.education.length > 0) {
    sections.push({ name: "Education", url: "#education" });
  }

  return sections;
}

const sectionIds = ["about", "experiences", "projects", "skills", "education"];

const SlugHeader = ({
  image,
  profileData,
}: {
  image: string | null;
  profileData: Profile;
}) => {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const [activeSection, setActiveSection] = useState<string>("about");

  useEffect(() => {
    if (pathname === "/") {
      setShow(true);
      return;
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 32) {
        setShow(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShow(false); // scrolling down
      } else {
        setShow(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Intersection Observer for section highlighting
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new window.IntersectionObserver(handleIntersect, {
      rootMargin: "-40% 0px -50% 0px",
      threshold: 0.1,
    });
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  if (!profileData.name) {
    return null;
  }

  console.log(image);

  const navLinks = generateHeaderLinks(profileData);

  return (
    <motion.header
      className="rounded-xl border px-3 mt-4 md:-mx-5 flex items-center gap-2  justify-between bg-background  dark:bg-secondary  py-3 sticky top-4 z-30"
      initial={{ y: 0, opacity: 1 }}
      animate={show ? { y: 0, opacity: 1 } : { y: -64, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <Link className=" mx-3 cursor-pointer" href="#">
        <HighlightFirstWord text={profileData.name} />
      </Link>
      <div className=" flex items-center gap-3">
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3 relative">
          {navLinks.map((section) => {
            const isActive = activeSection === section.url.replace("#", "");
            return (
              <Link
                key={section.name}
                href={section.url}
                className={
                  "relative hidden md:block px-2 py-1 rounded-md font-medium transition-colors duration-200 " +
                  (isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary/80")
                }
                style={{ zIndex: 1 }}
              >
                <span className="relative z-10">{section.name}</span>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-underline"
                      className="absolute left-0 right-0 -bottom-1 h-1 rounded bg-primary/20"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
        <ThemeToggle className=" rounded-lg" />

        {/* Mobile nav with Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="md:hidden  "
              aria-label="Open navigation menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col gap-4 pt-8 px-6 w-[85vw] max-w-xs"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-2 mt-4">
              {navLinks.map((section) => {
                const isActive = activeSection === section.url.replace("#", "");
                return (
                  <Link
                    key={section.name}
                    href={section.url}
                    className={
                      "relative text-lg px-4 py-2 rounded-md font-semibold transition-colors duration-200 w-full text-left " +
                      (isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary/80 hover:bg-primary/5")
                    }
                    style={{ zIndex: 1 }}
                  >
                    <span className="relative z-10">{section.name}</span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          layoutId="active-mobile-nav-underline"
                          className="absolute left-1/2 -translate-x-1/2 bottom-1 h-1 w-2/3 rounded bg-primary/20"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.25 }}
                        />
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4">
              <ThemeToggle className="rounded-lg" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Always show ThemeToggle at end of header */}
    </motion.header>
  );
};

export default SlugHeader;
