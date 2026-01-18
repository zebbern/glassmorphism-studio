"use client";

import { useState, useEffect, useCallback } from "react";
import { ThemeMode, ThemeSettings } from "@/types/glassmorphic";

const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  mode: "dark",
  darkBackground: "#1a1a2e",
  lightBackground: "#f5f5f7",
  accentColor: "#6366f1",
};

const THEME_STORAGE_KEY = "glassmorphic-theme";

export function useTheme() {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(
    DEFAULT_THEME_SETTINGS,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ThemeSettings;
        setThemeSettings(parsed);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        setThemeSettings((prev) => ({
          ...prev,
          mode: prefersDark ? "dark" : "light",
        }));
      }
    } catch (error) {
      console.error("Failed to load theme settings:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeSettings));
      } catch (error) {
        console.error("Failed to save theme settings:", error);
      }
    }
  }, [themeSettings, isLoaded]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeSettings.mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      // Force re-render when system theme changes
      setThemeSettings((prev) => ({ ...prev }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeSettings.mode]);

  // Get the effective theme (resolves "system" to actual value)
  const effectiveTheme = useCallback((): "light" | "dark" => {
    if (themeSettings.mode === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "dark"; // Default for SSR
    }
    return themeSettings.mode;
  }, [themeSettings.mode]);

  // Get the current background color based on theme
  const getBackgroundColor = useCallback((): string => {
    return effectiveTheme() === "dark"
      ? themeSettings.darkBackground
      : themeSettings.lightBackground;
  }, [
    effectiveTheme,
    themeSettings.darkBackground,
    themeSettings.lightBackground,
  ]);

  // Toggle between light and dark (skips system)
  const toggleTheme = useCallback(() => {
    setThemeSettings((prev) => ({
      ...prev,
      mode:
        prev.mode === "dark" ||
        (prev.mode === "system" && effectiveTheme() === "dark")
          ? "light"
          : "dark",
    }));
  }, [effectiveTheme]);

  // Set specific theme mode
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeSettings((prev) => ({ ...prev, mode }));
  }, []);

  // Update custom backgrounds
  const setDarkBackground = useCallback((color: string) => {
    setThemeSettings((prev) => ({ ...prev, darkBackground: color }));
  }, []);

  const setLightBackground = useCallback((color: string) => {
    setThemeSettings((prev) => ({ ...prev, lightBackground: color }));
  }, []);

  const setAccentColor = useCallback((color: string) => {
    setThemeSettings((prev) => ({ ...prev, accentColor: color }));
  }, []);

  // Reset to defaults
  const resetTheme = useCallback(() => {
    setThemeSettings(DEFAULT_THEME_SETTINGS);
  }, []);

  return {
    themeSettings,
    effectiveTheme: effectiveTheme(),
    isDark: effectiveTheme() === "dark",
    isLight: effectiveTheme() === "light",
    backgroundColor: getBackgroundColor(),
    isLoaded,
    toggleTheme,
    setThemeMode,
    setDarkBackground,
    setLightBackground,
    setAccentColor,
    resetTheme,
  };
}

// Theme background presets
export const themeBackgroundPresets = {
  dark: [
    { name: "Deep Space", color: "#0d0d1a" },
    { name: "Midnight Blue", color: "#1a1a2e" },
    { name: "Charcoal", color: "#2d2d2d" },
    { name: "Navy", color: "#0a192f" },
    { name: "Dark Purple", color: "#1e1e3f" },
    { name: "Forest Night", color: "#1a2f1a" },
  ],
  light: [
    { name: "Pure White", color: "#ffffff" },
    { name: "Soft Gray", color: "#f5f5f7" },
    { name: "Warm White", color: "#faf8f5" },
    { name: "Cool White", color: "#f0f4f8" },
    { name: "Cream", color: "#fffef5" },
    { name: "Lavender Mist", color: "#f5f3ff" },
  ],
};
