"use client";

import {
  Home,
  Search,
  Bell,
  User,
  Menu,
  Settings,
  Sparkles,
} from "lucide-react";
import type {
  GlassSettings,
  ColorSettings,
  GradientSettings,
} from "@/types/glassmorphic";

interface GlassNavbarProps {
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
  variant?: "horizontal" | "vertical";
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

export function GlassNavbar({
  settings,
  colorSettings,
  gradientSettings,
  inputColor,
  variant = "horizontal",
}: GlassNavbarProps) {
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

  const navStyle: React.CSSProperties = {
    background: getBackground(),
    backdropFilter: `blur(${settings.blur}px)`,
    WebkitBackdropFilter: `blur(${settings.blur}px)`,
    borderRadius: `${settings.borderRadius}px`,
    border: `1px solid rgba(255, 255, 255, ${settings.borderOpacity})`,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5)
    `,
  };

  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search" },
    { icon: Bell, label: "Notifications" },
    { icon: User, label: "Profile" },
    { icon: Settings, label: "Settings" },
  ];

  if (variant === "vertical") {
    return (
      <nav
        className="w-16 p-2 flex flex-col items-center gap-2"
        style={navStyle}
      >
        {/* Logo */}
        <div className="w-10 h-10 flex items-center justify-center mb-2">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        {/* Nav Items */}
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
              item.active
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>
    );
  }

  return (
    <nav className="w-full p-3" style={navStyle}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-white" />
          <span className="text-white font-semibold text-lg hidden sm:inline">
            GlassUI
          </span>
        </div>

        {/* Nav Items - Center */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.slice(0, 4).map((item, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm ${
                item.active
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all md:hidden">
            <Menu className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Shine effect */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] rounded-t-inherit"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
        }}
      />
    </nav>
  );
}

export function GlassNavbarPreview(props: GlassNavbarProps) {
  return (
    <div className="space-y-4 p-4">
      <GlassNavbar {...props} variant="horizontal" />
      <div className="flex justify-center">
        <GlassNavbar {...props} variant="vertical" />
      </div>
    </div>
  );
}
