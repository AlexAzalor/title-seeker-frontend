"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="select-theme"
      onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
    >
      {currentTheme === "dark" && <Sun />}
      {currentTheme === "light" && <Moon />}
    </Button>
  );
}
