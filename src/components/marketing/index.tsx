"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import {
  Zap,
  Puzzle,
  FileText,
  Globe,
  Github,
  Upload,
  ScanText,
  Eye,
  Sliders,
  Share2,
} from "lucide-react";
import { WarpBackground } from "../magicui/warp-background";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Prefetch upload page when user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.prefetch("/upload");
    }
  }, [status, router]);

  const handleUploadClick = async () => {
    setIsLoading(true);

    try {
      if (status === "authenticated") {
        // User is logged in, redirect to upload
        router.push("/upload");
      } else {
        // User is not logged in, trigger Google sign-in
        await signIn("google");
      }
    } catch (error) {
      console.error("Error during upload flow:", error);
    } finally {
      // Don't reset loading state immediately to avoid flicker
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const isLoadingState = status === "loading" || isLoading;

  return (
    <motion.div
      className="max-w-5xl   mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <div className=" my-10 md:my-32 grid grid-cols-1 md:grid-cols-2 items-center  gap-10">
        <motion.div
          className=" order-2 md:order-1  text-center md:text-left"
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
          >
            <Badge variant="outline" className="text-xs   mt-2">
              100% free and open source.
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl mt-4 font-sans font-extrabold tracking-tight"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
          >
            Turn Your Resume <br />
            to Website
          </motion.h1>
          <motion.p
            className=" text-muted-foreground mt-4"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
          >
            Turn your resume or LinkedIn PDF into a live, shareable portfolio —
            in one click.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
          >
            <Button
              onClick={handleUploadClick}
              className="h-12 w-44 mt-4 gap-2"
              variant="default"
              disabled={isLoadingState}
            >
              <Icon
                icon={
                  isLoadingState
                    ? "line-md:loading-loop"
                    : "hugeicons:ai-beautify"
                }
                width="20"
                height="20"
                className={isLoadingState ? "animate-spin" : ""}
              />
              {isLoadingState
                ? "Loading..."
                : status === "authenticated"
                ? "Upload Resume"
                : "Get Started"}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className=" order-1 md:order-2"
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <div className="relative  w-full  mx-auto">
            <img
              className="rounded-lg    "
              src={"/images/landing-page.png"}
              alt="portfolio"
            />
          </div>
        </motion.div>
      </div>

      <WarpBackground className=" my-16 bg-background  justify-center items-center flex ">
        <Card className="max-w-sm w-full  ">
          <CardContent className="flex flex-col gap-4  items-center">
            <CardTitle className="text-center text-2xl font-bold">
              See It In Action
            </CardTitle>
            <CardDescription className="text-center">
              Explore a real portfolio website built with LinkedFolio.
              Experience the design, and features for yourself!
            </CardDescription>
            <Button
              asChild
              size="lg"
              className="px-8 text-base font-semibold mt-2"
            >
              <a
                href="https://linkedfolio.vercel.app/pawan67"
                target="_blank"
                rel="noopener noreferrer"
              >
                🚀 See Live Demo
              </a>
            </Button>
          </CardContent>
        </Card>
      </WarpBackground>
      <section className=" ">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-10"
        >
          {/* Features Section */}
          <div>
            <div className="flex text-3xl font-bold font-sans items-center gap-2 mb-4">
              <Zap className="text-primary" size={28} />
              Features
            </div>
            <div className="grid mt-5 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <Zap className="text-yellow-500" size={28} />
                  <div className="font-medium text-lg">Super Fast</div>
                  <div className="text-muted-foreground text-sm">
                    Your site is live in seconds.
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <Puzzle className="text-blue-500" size={28} />
                  <div className="font-medium text-lg">Customizable</div>
                  <div className="text-muted-foreground text-sm">
                    Edit your content, sections as you grow.
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <FileText className="text-green-600" size={28} />
                  <div className="font-medium text-lg">PDF to Web</div>
                  <div className="text-muted-foreground text-sm">
                    Works seamlessly with LinkedIn resumes or any standard CV.
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <Globe className="text-cyan-600" size={28} />
                  <div className="font-medium text-lg">Shareable</div>
                  <div className="text-muted-foreground text-sm">
                    Get a public URL to share with recruiters or on social
                    media.
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <Github
                    className="text-neutral-700 dark:text-neutral-200"
                    size={28}
                  />
                  <div className="font-medium text-lg">Open Source</div>
                  <div className="text-muted-foreground text-sm">
                    Fork it, contribute, or self-host it. Built for the
                    community.
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
          {/* How It Works Section */}
          <div>
            <div className="flex text-3xl font-bold font-sans items-center gap-2 mb-4 mt-20">
              <Share2 className="text-yellow-500" size={28} />
              How It Works
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <Upload className="text-primary" size={26} />
                  <div className="font-medium text-lg">Upload your Resume</div>
                  <div className="text-muted-foreground text-sm">
                    PDF from LinkedIn or your own format.
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <ScanText className="text-blue-500" size={26} />
                  <div className="font-medium text-lg">We Extract the Data</div>
                  <div className="text-muted-foreground text-sm">
                    We automatically parse your resume content with the help of
                    AI.
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <Eye className="text-green-600" size={26} />
                  <div className="font-medium text-lg">Live Preview</div>
                  <div className="text-muted-foreground text-sm">
                    Instantly see your personal website.
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <Sliders className="text-cyan-600" size={26} />
                  <div className="font-medium text-lg">Customize</div>
                  <div className="text-muted-foreground text-sm">
                    Change content add work, skills, projects, and more.
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Card className="p-5 h-full flex flex-col items-start gap-2">
                  <Share2 className="text-yellow-500" size={26} />
                  <div className="font-medium text-lg">Publish & Share</div>
                  <div className="text-muted-foreground text-sm">
                    Get a clean, modern portfolio URL.
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
