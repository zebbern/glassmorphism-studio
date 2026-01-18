"use client";

import React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { ThemeMode } from "@/types/glassmorphic";
import { useTheme, themeBackgroundPresets } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  showBackgroundPicker?: boolean;
  className?: string;
}

export function ThemeToggle({
  showBackgroundPicker = false,
  className,
}: ThemeToggleProps) {
  const {
    themeSettings,
    effectiveTheme,
    isDark,
    toggleTheme,
    setThemeMode,
    setDarkBackground,
    setLightBackground,
  } = useTheme();

  const modes: { value: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <Sun className="w-4 h-4" />, label: "Light" },
    { value: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark" },
    { value: "system", icon: <Monitor className="w-4 h-4" />, label: "System" },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Mode Toggle Buttons */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => setThemeMode(mode.value)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200",
              themeSettings.mode === mode.value
                ? "bg-white/20 text-white shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/10",
            )}
            title={mode.label}
          >
            {mode.icon}
            <span className="text-sm font-medium">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Toggle Button (alternative minimal version) */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-200 text-white"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        <span className="text-sm">Switch to {isDark ? "Light" : "Dark"}</span>
      </button>

      {/* Background Color Picker */}
      {showBackgroundPicker && (
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-white/80">
            {isDark ? "Dark" : "Light"} Background
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {themeBackgroundPresets[effectiveTheme].map((preset) => (
              <button
                key={preset.color}
                onClick={() =>
                  isDark
                    ? setDarkBackground(preset.color)
                    : setLightBackground(preset.color)
                }
                className={cn(
                  "w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110",
                  (isDark
                    ? themeSettings.darkBackground
                    : themeSettings.lightBackground) === preset.color
                    ? "border-white shadow-lg ring-2 ring-white/50"
                    : "border-white/20 hover:border-white/50",
                )}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/60">Custom:</label>
            <input
              type="color"
              value={
                isDark
                  ? themeSettings.darkBackground
                  : themeSettings.lightBackground
              }
              onChange={(e) =>
                isDark
                  ? setDarkBackground(e.target.value)
                  : setLightBackground(e.target.value)
              }
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={
                isDark
                  ? themeSettings.darkBackground
                  : themeSettings.lightBackground
              }
              onChange={(e) =>
                isDark
                  ? setDarkBackground(e.target.value)
                  : setLightBackground(e.target.value)
              }
              className="flex-1 px-2 py-1 text-xs rounded bg-white/10 border border-white/20 text-white placeholder-white/40"
              placeholder="#hex"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Compact toggle for navbar/header use
export function ThemeToggleCompact({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-200 text-white",
        className,
      )}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
