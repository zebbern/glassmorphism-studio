"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Sun, RotateCcw, Eye, EyeOff, Lightbulb } from "lucide-react";
import { LightSource, LightPosition } from "@/types/glassmorphic";
import {
  defaultLightSource,
  lightPositionPresets,
  lightColorPresets,
} from "@/lib/light-effects";
import { cn } from "@/lib/utils";

interface LightSourceControlsProps {
  light: LightSource;
  onChange: (light: LightSource) => void;
  className?: string;
}

export function LightSourceControls({
  light,
  onChange,
  className,
}: LightSourceControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateLight = <K extends keyof LightSource>(
    key: K,
    value: LightSource[K],
  ) => {
    onChange({ ...light, [key]: value });
  };

  const updatePosition = (x: number, y: number) => {
    updateLight("position", {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      updatePosition(x, y);
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    updatePosition(x, y);
  };

  const resetToDefault = () => {
    onChange(defaultLightSource);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Light Source</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateLight("enabled", !light.enabled)}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              light.enabled
                ? "bg-yellow-500/30 text-yellow-400 border border-yellow-500/50"
                : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/20",
            )}
            title={light.enabled ? "Disable light" : "Enable light"}
          >
            {light.enabled ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
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

      {/* Interactive Light Position Grid */}
      <div className="space-y-2">
        <label className="text-sm text-white/70 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" /> Drag to position light
        </label>
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          className="relative w-full aspect-square rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20 cursor-crosshair overflow-hidden"
        >
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-white/5" />
            ))}
          </div>

          {/* Glass preview element */}
          <div
            className="absolute w-1/3 h-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg backdrop-blur-md"
            style={{
              background: light.enabled
                ? `radial-gradient(circle at ${light.position.x}% ${light.position.y}%, rgba(255,255,255,0.3), rgba(255,255,255,0.05))`
                : "rgba(255,255,255,0.1)",
              boxShadow: light.enabled
                ? `${(50 - light.position.x) * 0.3}px ${(50 - light.position.y) * 0.3}px 20px rgba(0,0,0,0.3)`
                : "none",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />

          {/* Light indicator */}
          {light.enabled && (
            <div
              className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
              style={{
                left: `${light.position.x}%`,
                top: `${light.position.y}%`,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDragging(true);
              }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: light.color,
                  filter: `blur(${light.radius / 10}px)`,
                  opacity: light.intensity / 100,
                  transform: `scale(${1 + light.radius / 100})`,
                }}
              />
              {/* Center dot */}
              <div
                className="absolute inset-0 rounded-full border-2 border-white shadow-lg"
                style={{ background: light.color }}
              />
            </div>
          )}

          {/* Position indicator */}
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/50 text-white/70 text-xs font-mono">
            X: {Math.round(light.position.x)}% Y: {Math.round(light.position.y)}
            %
          </div>
        </div>
      </div>

      {/* Position Presets */}
      <div className="space-y-2">
        <label className="text-sm text-white/70">Quick Positions</label>
        <div className="grid grid-cols-3 gap-2">
          {lightPositionPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => updateLight("position", preset.position)}
              className={cn(
                "px-2 py-1.5 text-xs rounded-md transition-all duration-200",
                light.position.x === preset.position.x &&
                  light.position.y === preset.position.y
                  ? "bg-yellow-500/30 text-yellow-400 border border-yellow-500/50"
                  : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20",
              )}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Light Color */}
      <div className="space-y-2">
        <label className="text-sm text-white/70">Light Color</label>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {lightColorPresets.map((preset) => (
              <button
                key={preset.color}
                onClick={() => updateLight("color", preset.color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110",
                  light.color === preset.color
                    ? "border-white ring-2 ring-white/50"
                    : "border-white/30",
                )}
                style={{ background: preset.color }}
                title={preset.name}
              />
            ))}
          </div>
          <input
            type="color"
            value={light.color}
            onChange={(e) => updateLight("color", e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
        </div>
      </div>

      {/* Intensity Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="text-white/70">Intensity</label>
          <span className="text-white/90 font-mono">{light.intensity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={light.intensity}
          onChange={(e) => updateLight("intensity", parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* Radius Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="text-white/70">Radius (Spread)</label>
          <span className="text-white/90 font-mono">{light.radius}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="200"
          step="10"
          value={light.radius}
          onChange={(e) => updateLight("radius", parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}
