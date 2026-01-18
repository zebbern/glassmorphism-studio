"use client";

import { Search, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import type {
  GlassSettings,
  ColorSettings,
  GradientSettings,
} from "@/types/glassmorphic";

interface GlassInputProps {
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
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

interface SingleInputProps extends GlassInputProps {
  placeholder?: string;
  type?: "text" | "email" | "password" | "search";
  icon?: React.ReactNode;
  label?: string;
}

export function GlassInput({
  settings,
  colorSettings,
  gradientSettings,
  inputColor,
  placeholder = "Enter text...",
  type = "text",
  icon,
  label,
}: SingleInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const rgb = hexToRgb(inputColor);

  const getBackground = () => {
    const opacity = isFocused
      ? colorSettings.opacity + 0.05
      : colorSettings.opacity;
    if (gradientSettings.enabled) {
      const startRgb = hexToRgb(gradientSettings.startColor);
      const endRgb = hexToRgb(gradientSettings.endColor);
      const gradientType =
        gradientSettings.type === "radial"
          ? "radial-gradient(circle"
          : `linear-gradient(${gradientSettings.direction}deg`;
      return `${gradientType}, rgba(${startRgb.r}, ${startRgb.g}, ${startRgb.b}, ${opacity}) 0%, rgba(${endRgb.r}, ${endRgb.g}, ${endRgb.b}, ${opacity}) 100%)`;
    }
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  };

  const inputStyle: React.CSSProperties = {
    background: getBackground(),
    backdropFilter: `blur(${settings.blur}px)`,
    WebkitBackdropFilter: `blur(${settings.blur}px)`,
    borderRadius: `${Math.min(settings.borderRadius, 12)}px`,
    border: `1px solid rgba(255, 255, 255, ${isFocused ? settings.borderOpacity * 1.5 : settings.borderOpacity})`,
    boxShadow: isFocused
      ? `0 0 0 3px rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.1)`
      : `0 4px 16px rgba(0, 0, 0, 0.05)`,
    transition: "all 0.2s ease",
  };

  const actualType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-white/80 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}
        <input
          type={actualType}
          placeholder={placeholder}
          className={`w-full py-2.5 text-white placeholder:text-white/40 outline-none text-sm ${
            icon ? "pl-10" : "pl-4"
          } ${type === "password" ? "pr-10" : "pr-4"}`}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function GlassInputPreview(props: GlassInputProps) {
  return (
    <div className="space-y-4 p-4 max-w-sm mx-auto">
      <GlassInput
        {...props}
        label="Username"
        placeholder="Enter username"
        icon={<User className="w-4 h-4" />}
      />
      <GlassInput
        {...props}
        label="Email"
        type="email"
        placeholder="you@example.com"
        icon={<Mail className="w-4 h-4" />}
      />
      <GlassInput
        {...props}
        label="Password"
        type="password"
        placeholder="Enter password"
        icon={<Lock className="w-4 h-4" />}
      />
      <GlassInput
        {...props}
        type="search"
        placeholder="Search..."
        icon={<Search className="w-4 h-4" />}
      />
    </div>
  );
}
