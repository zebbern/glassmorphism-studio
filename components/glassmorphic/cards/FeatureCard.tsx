"use client";

import React from "react";
import {
  Zap,
  Shield,
  Rocket,
  Sparkles,
  Star,
  Globe,
  Lock,
  Heart,
  Smartphone,
  Palette,
  FileText,
  Lightbulb,
  PenTool,
  Code,
  Cpu,
  Grid,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCardContent {
  icon?:
    | "zap"
    | "shield"
    | "rocket"
    | "sparkles"
    | "star"
    | "lightning"
    | "globe"
    | "lock"
    | "heart";
  iconType?: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: "cyan" | "green" | "purple" | "orange" | "pink";
  linkUrl?: string;
}

interface FeatureCardProps {
  content: FeatureCardContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  zap: Zap,
  lightning: Zap,
  shield: Shield,
  rocket: Rocket,
  sparkles: Sparkles,
  star: Star,
  globe: Globe,
  lock: Lock,
  heart: Heart,
  smartphone: Smartphone,
  palette: Palette,
  "file-text": FileText,
  lightbulb: Lightbulb,
  "pen-tool": PenTool,
  code: Code,
  cpu: Cpu,
  grid: Grid,
};

const iconColors: Record<string, string> = {
  zap: "from-yellow-400 to-orange-500",
  lightning: "from-yellow-400 to-orange-500",
  shield: "from-blue-400 to-cyan-500",
  rocket: "from-purple-400 to-pink-500",
  sparkles: "from-green-400 to-emerald-500",
  star: "from-amber-400 to-yellow-500",
  globe: "from-blue-400 to-indigo-500",
  lock: "from-slate-400 to-zinc-500",
  heart: "from-red-400 to-pink-500",
  smartphone: "from-cyan-400 to-blue-500",
  palette: "from-pink-400 to-purple-500",
  "file-text": "from-slate-400 to-gray-500",
  lightbulb: "from-yellow-400 to-amber-500",
  "pen-tool": "from-violet-400 to-purple-500",
  code: "from-emerald-400 to-green-500",
  cpu: "from-blue-400 to-indigo-500",
  grid: "from-cyan-400 to-teal-500",
};

const badgeColors = {
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  green: "bg-green-500/20 text-green-400 border-green-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  pink: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const defaultContent: FeatureCardContent = {
  icon: "zap",
  title: "Lightning Fast",
  description:
    "Experience blazing-fast performance with our optimized infrastructure. Built for speed from the ground up.",
  badge: "New",
};

export function FeatureCard({
  content = defaultContent,
  glassStyle,
  className,
}: FeatureCardProps) {
  // Support both icon and iconType
  const iconKey = content.iconType || content.icon || "zap";
  const IconComponent = icons[iconKey] || Zap;
  const gradientColor = iconColors[iconKey] || iconColors.zap;

  return (
    <div
      className={cn(
        "w-full max-w-sm p-6 rounded-2xl overflow-hidden relative group",
        className,
      )}
      style={glassStyle}
    >
      {/* Badge */}
      {content.badge && (
        <div
          className={cn(
            "absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-medium border",
            content.badgeColor
              ? badgeColors[content.badgeColor]
              : "bg-white/10 text-white/70 border-white/20",
          )}
        >
          {content.badge}
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br shadow-lg",
          gradientColor,
        )}
      >
        <IconComponent className="w-7 h-7 text-white" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
        {content.title}
      </h3>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed">
        {content.description}
      </p>

      {/* Hover Arrow */}
      <div className="mt-4 flex items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors">
        <span className="text-sm">Learn more</span>
        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </div>
  );
}

FeatureCard.defaultContent = defaultContent;
FeatureCard.icons = Object.keys(icons) as Array<keyof typeof icons>;
