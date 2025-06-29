import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" mt-10    mb-5    ">
      <div className="  mx-auto py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Created by{" "}
                <Link
                  href="https://pawan67.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  Pawan Tamada
                </Link>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <div className="flex items-center gap-2">
              <Link
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Icon icon="simple-icons:openrouter" className="h-4 w-4" />
                OpenRouter
              </Link>
              <span>&</span>
              <Link
                href="https://mistral.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Icon icon="simple-icons:mistralai" className="h-4 w-4" />
                Mistral
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 text-xs text-muted-foreground md:flex-row md:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/pawan67/linkedfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Icon icon="mdi:github" className="h-3 w-3" />
              Source Code
            </Link>
            <Link
              href="https://linkedin.com/in/pawan67"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Icon icon="mdi:linkedin" className="h-3 w-3" />
              LinkedIn
            </Link>
          </div>

          <div className="text-center md:text-right">
            © {new Date().getFullYear()} LinkedFolio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
