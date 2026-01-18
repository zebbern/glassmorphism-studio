"use client";

import React from "react";
import { ArrowRight, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroSectionContent {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  showRating?: boolean;
  ratingCount?: number;
  ratingValue?: string;
}

interface HeroSectionProps {
  content: HeroSectionContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: HeroSectionContent = {
  title: "Build Something Amazing",
  subtitle: "The Next Generation Platform",
  description:
    "Create stunning applications with our powerful tools and beautiful components. Start building today.",
  primaryButtonText: "Get Started",
  secondaryButtonText: "Watch Demo",
  showRating: true,
  ratingCount: 2500,
  ratingValue: "4.9",
};

export function HeroSection({
  content = defaultContent,
  glassStyle,
  className,
}: HeroSectionProps) {
  return (
    <div
      className={cn(
        "w-full p-8 md:p-12 rounded-2xl overflow-hidden",
        className,
      )}
      style={glassStyle}
    >
      <div className="max-w-2xl">
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm text-cyan-400 font-medium">
            {content.subtitle}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          {content.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-white/70 mb-8 max-w-xl">
          {content.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity">
            {content.primaryButtonText}
            <ArrowRight className="w-4 h-4" />
          </button>
          {content.secondaryButtonText && (
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-colors">
              <Play className="w-4 h-4" />
              {content.secondaryButtonText}
            </button>
          )}
        </div>

        {/* Rating */}
        {content.showRating && (
          <div className="flex items-center gap-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <span className="font-semibold text-white">
                {content.ratingValue}
              </span>
              <span>•</span>
              <span>{content.ratingCount?.toLocaleString()}+ reviews</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
