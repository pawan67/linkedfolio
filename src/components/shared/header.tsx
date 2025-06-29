"use client";
import Logo from "./logo";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import ThemeToggle from "./theme-toggle";

const Header = () => {
  return (
    <header className="flex py-4 items-center justify-between max-w-4xl mx-auto px-4">
      <Logo />

      <div className="flex items-center gap-2">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>
              Get Started
              <Icon icon="stash:signin-duotone" width="20" height="20" />
            </Button>
          </SignInButton>
        </SignedOut>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
