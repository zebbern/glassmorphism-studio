"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialCardContent {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  avatarUrl?: string;
  rating: number; // 1-5
  verified?: boolean;
}

interface TestimonialCardProps {
  content: TestimonialCardContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: TestimonialCardContent = {
  quote:
    "This tool has completely transformed how we design our interfaces. The glassmorphic effects are stunning and so easy to create!",
  author: "Sarah Chen",
  role: "Design Lead",
  company: "TechCorp",
  rating: 5,
};

export function TestimonialCard({
  content = defaultContent,
  glassStyle,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm p-6 rounded-2xl overflow-hidden relative",
        className,
      )}
      style={glassStyle}
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <Quote className="w-5 h-5 text-white/40" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < content.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-white/20",
            )}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-white/80 text-sm leading-relaxed mb-6 italic">
        "{content.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold overflow-hidden">
          {content.avatar ? (
            <img
              src={content.avatar}
              alt={content.author}
              className="w-full h-full object-cover"
            />
          ) : (
            content.author.charAt(0)
          )}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{content.author}</p>
          <p className="text-white/50 text-xs">
            {content.role} at {content.company}
          </p>
        </div>
      </div>
    </div>
  );
}

TestimonialCard.defaultContent = defaultContent;
