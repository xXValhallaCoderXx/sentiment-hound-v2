"use client";

import { useState, useEffect } from "react";
import { MantineColorScheme } from "@mantine/core";

type ThemePreference = MantineColorScheme | "auto";

export function useThemePreference() {
  const [colorScheme, setColorScheme] = useState<ThemePreference>("auto");

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme-preference");
    if (stored && (stored === "light" || stored === "dark" || stored === "auto")) {
      setColorScheme(stored as ThemePreference);
    }
  }, []);

  // Save theme preference to localStorage when it changes
  const setThemePreference = (theme: ThemePreference) => {
    setColorScheme(theme);
    localStorage.setItem("theme-preference", theme);
  };

  const toggleTheme = () => {
    const nextTheme = colorScheme === "light" ? "dark" : colorScheme === "dark" ? "light" : "light";
    setThemePreference(nextTheme);
  };

  return {
    colorScheme,
    setThemePreference,
    toggleTheme,
  };
}