"use client";

import React from "react";
import { User, MapPin, Link as LinkIcon, Mail } from "lucide-react";
import {
  GlassSettings,
  ColorSettings,
  GradientSettings,
} from "@/types/glassmorphic";
import { cn } from "@/lib/utils";

export interface ProfileCardContent {
  name: string;
  title: string;
  avatar: string;
  location?: string;
  email?: string;
  website?: string;
  bio?: string;
}

interface ProfileCardProps {
  content: ProfileCardContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: ProfileCardContent = {
  name: "Alex Johnson",
  title: "Senior UI Designer",
  avatar: "",
  location: "San Francisco, CA",
  email: "alex@example.com",
  website: "alexjohnson.design",
  bio: "Creating beautiful interfaces with a focus on user experience and accessibility.",
};

export function ProfileCard({
  content = defaultContent,
  glassStyle,
  className,
}: ProfileCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm p-6 rounded-2xl overflow-hidden relative",
        className,
      )}
      style={glassStyle}
    >
      {/* Avatar */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-4 border-2 border-white/30 shadow-lg overflow-hidden">
          {content.avatar ? (
            <img
              src={content.avatar}
              alt={content.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-white" />
          )}
        </div>
        <h3 className="text-xl font-bold text-white">{content.name}</h3>
        <p className="text-white/70 text-sm">{content.title}</p>
      </div>

      {/* Bio */}
      {content.bio && (
        <p className="text-white/60 text-sm text-center mb-4 leading-relaxed">
          {content.bio}
        </p>
      )}

      {/* Info Grid */}
      <div className="space-y-2">
        {content.location && (
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{content.location}</span>
          </div>
        )}
        {content.email && (
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <Mail className="w-4 h-4" />
            <span>{content.email}</span>
          </div>
        )}
        {content.website && (
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <LinkIcon className="w-4 h-4" />
            <span>{content.website}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button className="w-full mt-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 border border-white/20 hover:border-white/40">
        Connect
      </button>
    </div>
  );
}

ProfileCard.defaultContent = defaultContent;
