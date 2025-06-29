import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const isDarkMode = theme === "dark";
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevents hydration mismatch by ensuring the component is mounted before rendering
  if (!mounted) {
    return null;
  }

  return (
    <div>
      <Button
        onClick={toggleTheme}
        className=" rounded-full   text-primary "
        variant="outline"
        size="icon"
      >
        {isDarkMode ? (
          <Icon icon="line-md:sun-rising-loop" width="28" height="28" />
        ) : (
          <Icon icon="iconoir:moon-sat" width="28" height="28" />
        )}
      </Button>
    </div>
  );
};

export default ThemeToggle;
