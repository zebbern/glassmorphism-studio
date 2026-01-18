"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Play, Pause, RotateCcw, Zap } from "lucide-react";
import {
  AnimationSettings,
  AnimationType,
  EasingType,
} from "@/types/glassmorphic";
import { defaultAnimationSettings, animationPresets } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface AnimationControlsProps {
  settings: AnimationSettings;
  onChange: (settings: AnimationSettings) => void;
  className?: string;
}

const animationTypes: {
  value: AnimationType;
  label: string;
  description: string;
}[] = [
  { value: "none", label: "None", description: "No animation" },
  { value: "hover-glow", label: "Glow", description: "Pulsing glow effect" },
  { value: "pulse", label: "Pulse", description: "Scale up and down" },
  { value: "shimmer", label: "Shimmer", description: "Shiny sweep effect" },
  { value: "float", label: "Float", description: "Gentle vertical movement" },
  { value: "breathe", label: "Breathe", description: "Soft scale & opacity" },
  {
    value: "rotate-border",
    label: "Rotate Border",
    description: "Spinning gradient border",
  },
];

const easingTypes: { value: EasingType; label: string }[] = [
  { value: "ease", label: "Ease" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in-out", label: "Ease In-Out" },
  { value: "linear", label: "Linear" },
  { value: "spring", label: "Spring" },
];

const presetList = Object.entries(animationPresets).map(([key, value]) => ({
  id: key,
  name: key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  settings: value,
}));

export function AnimationControls({
  settings,
  onChange,
  className,
}: AnimationControlsProps) {
  const [isPlaying, setIsPlaying] = useState(settings.enabled);

  useEffect(() => {
    setIsPlaying(settings.enabled);
  }, [settings.enabled]);

  const updateSetting = <K extends keyof AnimationSettings>(
    key: K,
    value: AnimationSettings[K],
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const toggleEnabled = () => {
    const newEnabled = !settings.enabled;
    setIsPlaying(newEnabled);
    updateSetting("enabled", newEnabled);
  };

  const applyPreset = (presetId: string) => {
    const preset = animationPresets[presetId];
    if (preset) {
      onChange({ ...defaultAnimationSettings, ...preset });
    }
  };

  const resetToDefault = () => {
    onChange(defaultAnimationSettings);
    setIsPlaying(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with Play/Pause */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Animations</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEnabled}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              isPlaying
                ? "bg-purple-500/30 text-purple-400 border border-purple-500/50"
                : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/20",
            )}
            title={isPlaying ? "Pause animation" : "Play animation"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={resetToDefault}
            className="p-2 rounded-lg bg-white/10 text-white/60 border border-white/20 hover:bg-white/20 transition-all duration-200"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-sm text-white/70 flex items-center gap-1">
          <Zap className="w-3 h-3" /> Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {presetList.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className="px-3 py-1.5 text-xs rounded-md bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-200"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Type */}
      <div className="space-y-2">
        <label className="text-sm text-white/70">Animation Type</label>
        <div className="grid grid-cols-2 gap-2">
          {animationTypes.map((type) => (
            <button
              key={type.value}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Update both type and enabled state together
                if (type.value !== "none") {
                  onChange({ ...settings, type: type.value, enabled: true });
                  setIsPlaying(true);
                } else {
                  onChange({ ...settings, type: type.value, enabled: false });
                  setIsPlaying(false);
                }
              }}
              type="button"
              className={cn(
                "flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left cursor-pointer",
                settings.type === type.value
                  ? "bg-purple-500/20 border-purple-500/50 text-white"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30",
              )}
            >
              <span className="font-medium text-sm">{type.label}</span>
              <span className="text-xs opacity-60">{type.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings (only show when animation is selected) */}
      {settings.type !== "none" && (
        <>
          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-white/70">Duration</label>
              <span className="text-white/90 font-mono">
                {settings.duration.toFixed(1)}s
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={settings.duration}
              onChange={(e) =>
                updateSetting("duration", parseFloat(e.target.value))
              }
              className="w-full h-2 rounded-lg appearance-none bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>

          {/* Intensity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-white/70">Intensity</label>
              <span className="text-white/90 font-mono">
                {settings.intensity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.intensity}
              onChange={(e) =>
                updateSetting("intensity", parseInt(e.target.value))
              }
              className="w-full h-2 rounded-lg appearance-none bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>

          {/* Easing Dropdown */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">Easing</label>
            <select
              value={settings.easing}
              onChange={(e) =>
                updateSetting("easing", e.target.value as EasingType)
              }
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              {easingTypes.map((easing) => (
                <option
                  key={easing.value}
                  value={easing.value}
                  className="bg-gray-900"
                >
                  {easing.label}
                </option>
              ))}
            </select>
          </div>

          {/* Delay Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-white/70">Delay</label>
              <span className="text-white/90 font-mono">
                {settings.delay.toFixed(1)}s
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.delay}
              onChange={(e) =>
                updateSetting("delay", parseFloat(e.target.value))
              }
              className="w-full h-2 rounded-lg appearance-none bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>

          {/* Iteration Count */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">Repeat</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateSetting("iterationCount", "infinite")}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  settings.iterationCount === "infinite"
                    ? "bg-purple-500/30 text-purple-400 border border-purple-500/50"
                    : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20",
                )}
              >
                Infinite
              </button>
              {[1, 2, 3, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => updateSetting("iterationCount", count)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm transition-all duration-200",
                    settings.iterationCount === count
                      ? "bg-purple-500/30 text-purple-400 border border-purple-500/50"
                      : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20",
                  )}
                >
                  {count}x
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
