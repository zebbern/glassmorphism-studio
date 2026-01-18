"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Shuffle,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MusicPlayerContent {
  title: string;
  artist: string;
  albumArt?: string;
  progress: number; // 0-100
  duration: string;
  currentTime?: string;
  isPlaying?: boolean;
  isLiked?: boolean;
}

interface MusicPlayerProps {
  content: MusicPlayerContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: MusicPlayerContent = {
  title: "Blinding Lights",
  artist: "The Weeknd",
  albumArt: "",
  progress: 45,
  duration: "3:20",
  currentTime: "1:30",
  isPlaying: true,
  isLiked: false,
};

export function MusicPlayer({
  content = defaultContent,
  glassStyle,
  className,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(content.isPlaying ?? true);
  const [isLiked, setIsLiked] = useState(content.isLiked ?? false);
  const [progress, setProgress] = useState(content.progress);

  // Default album art gradient if none provided
  const albumArtStyle = content.albumArt
    ? { backgroundImage: `url(${content.albumArt})`, backgroundSize: "cover" }
    : { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" };

  return (
    <div
      className={cn(
        "w-full max-w-sm p-5 rounded-2xl overflow-hidden",
        className,
      )}
      style={glassStyle}
    >
      {/* Album Art & Track Info */}
      <div className="flex items-center gap-4 mb-5">
        {/* Album Art */}
        <div
          className="w-16 h-16 rounded-xl flex-shrink-0 shadow-lg"
          style={albumArtStyle}
        >
          {!content.albumArt && (
            <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl">
              🎵
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{content.title}</h3>
          <p className="text-white/60 text-sm truncate">{content.artist}</p>
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={cn(
            "p-2 rounded-full transition-colors",
            isLiked ? "text-pink-500" : "text-white/50 hover:text-white/70",
          )}
        >
          <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-white/50">
          <span>{content.currentTime || "0:00"}</span>
          <span>{content.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button className="text-white/50 hover:text-white/70 transition-colors">
          <Shuffle className="w-4 h-4" />
        </button>

        <button className="text-white/70 hover:text-white transition-colors">
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 hover:scale-105 transition-transform shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <button className="text-white/70 hover:text-white transition-colors">
          <SkipForward className="w-5 h-5" />
        </button>

        <button className="text-white/50 hover:text-white/70 transition-colors">
          <Repeat className="w-4 h-4" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <Volume2 className="w-4 h-4 text-white/50" />
        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-white/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
