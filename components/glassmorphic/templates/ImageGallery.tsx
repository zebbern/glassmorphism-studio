"use client";

import React from "react";
import { Grid, List, ZoomIn, Heart, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageGalleryContent {
  title: string;
  showViewToggle: boolean;
  columns: number;
}

interface ImageGalleryProps {
  content: ImageGalleryContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: ImageGalleryContent = {
  title: "Gallery",
  showViewToggle: true,
  columns: 3,
};

const sampleImages = [
  { id: 1, color: "from-cyan-500 to-blue-500", label: "Image 1" },
  { id: 2, color: "from-purple-500 to-pink-500", label: "Image 2" },
  { id: 3, color: "from-orange-500 to-red-500", label: "Image 3" },
  { id: 4, color: "from-green-500 to-teal-500", label: "Image 4" },
  { id: 5, color: "from-indigo-500 to-purple-500", label: "Image 5" },
  { id: 6, color: "from-yellow-500 to-orange-500", label: "Image 6" },
];

export function ImageGallery({
  content = defaultContent,
  glassStyle,
  className,
}: ImageGalleryProps) {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  return (
    <div
      className={cn("w-full p-6 rounded-2xl overflow-hidden", className)}
      style={glassStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{content.title}</h3>

        {content.showViewToggle && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/10">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-cyan-500/30 text-cyan-400"
                  : "text-white/50 hover:text-white",
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-cyan-500/30 text-cyan-400"
                  : "text-white/50 hover:text-white",
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div
        className={cn(
          viewMode === "grid" ? `grid gap-4` : "flex flex-col gap-3",
        )}
        style={{
          gridTemplateColumns:
            viewMode === "grid" ? `repeat(${content.columns}, 1fr)` : undefined,
        }}
      >
        {sampleImages.map((image) => (
          <div
            key={image.id}
            className={cn(
              "group relative overflow-hidden rounded-xl",
              viewMode === "grid"
                ? "aspect-square"
                : "h-20 flex items-center gap-4",
            )}
          >
            {/* Image Placeholder */}
            <div
              className={cn(
                "bg-gradient-to-br",
                image.color,
                viewMode === "grid"
                  ? "w-full h-full"
                  : "w-20 h-full rounded-lg flex-shrink-0",
              )}
            />

            {/* List View Info */}
            {viewMode === "list" && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{image.label}</p>
                <p className="text-xs text-white/50">1920 × 1080</p>
              </div>
            )}

            {/* Hover Overlay (Grid View) */}
            {viewMode === "grid" && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* List View Actions */}
            {viewMode === "list" && (
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
