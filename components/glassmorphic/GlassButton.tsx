"use client";

import type {
  GlassSettings,
  ColorSettings,
  GradientSettings,
} from "@/types/glassmorphic";

interface GlassButtonProps {
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

export function GlassButton({
  settings,
  colorSettings,
  gradientSettings,
  inputColor,
  variant = "default",
  size = "md",
}: GlassButtonProps) {
  const rgb = hexToRgb(inputColor);

  const getBackground = () => {
    if (gradientSettings.enabled) {
      const startRgb = hexToRgb(gradientSettings.startColor);
      const endRgb = hexToRgb(gradientSettings.endColor);
      const gradientType =
        gradientSettings.type === "radial"
          ? "radial-gradient(circle"
          : `linear-gradient(${gradientSettings.direction}deg`;
      return `${gradientType}, rgba(${startRgb.r}, ${startRgb.g}, ${startRgb.b}, ${colorSettings.opacity}) 0%, rgba(${endRgb.r}, ${endRgb.g}, ${endRgb.b}, ${colorSettings.opacity}) 100%)`;
    }
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${colorSettings.opacity})`;
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const buttonStyle: React.CSSProperties = {
    background: variant === "ghost" ? "transparent" : getBackground(),
    backdropFilter:
      variant !== "ghost" ? `blur(${settings.blur}px)` : undefined,
    WebkitBackdropFilter:
      variant !== "ghost" ? `blur(${settings.blur}px)` : undefined,
    borderRadius: `${Math.min(settings.borderRadius, 12)}px`,
    border:
      variant === "outline"
        ? `2px solid rgba(255, 255, 255, ${settings.borderOpacity * 2})`
        : `1px solid rgba(255, 255, 255, ${settings.borderOpacity})`,
    boxShadow:
      variant !== "ghost"
        ? `0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)`
        : "none",
    transition: "all 0.2s ease",
  };

  return (
    <button
      className={`${sizeClasses[size]} font-medium text-white/90 hover:scale-105 hover:shadow-lg active:scale-95 transition-all relative overflow-hidden`}
      style={buttonStyle}
    >
      <span className="relative z-10">Glass Button</span>
      {/* Shine effect */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
        }}
      />
    </button>
  );
}

export function GlassButtonPreview(props: GlassButtonProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-center p-6">
      <GlassButton {...props} size="sm" />
      <GlassButton {...props} size="md" />
      <GlassButton {...props} size="lg" />
      <GlassButton {...props} variant="outline" />
      <GlassButton {...props} variant="ghost" />
    </div>
  );
}
