"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="select-theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "dark" && <Sun />}
      {theme === "light" && <Moon />}
    </Button>
  );
}
