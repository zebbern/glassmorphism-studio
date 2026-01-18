"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GlassPreset } from "@/types/glassmorphic";
import { Check, Heart, Trash2 } from "lucide-react";

interface PresetCardProps {
  preset: GlassPreset;
  isSelected?: boolean;
  onSelect: (preset: GlassPreset) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export function PresetCard({
  preset,
  isSelected = false,
  onSelect,
  onDelete,
  showDelete = false,
}: PresetCardProps) {
  // Generate preview style based on preset settings
  const getPreviewStyle = (): React.CSSProperties => {
    const { settings, colorSettings, gradientSettings, inputColor } = preset;

    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 };
    };

    const rgb = hexToRgb(inputColor);

    let background: string;
    if (gradientSettings.enabled) {
      const startRgb = hexToRgb(gradientSettings.startColor);
      const endRgb = hexToRgb(gradientSettings.endColor);
      const gradientType =
        gradientSettings.type === "radial"
          ? "radial-gradient(circle"
          : `linear-gradient(${gradientSettings.direction}deg`;
      background = `${gradientType}, rgba(${startRgb.r}, ${startRgb.g}, ${startRgb.b}, ${colorSettings.opacity}) 0%, rgba(${endRgb.r}, ${endRgb.g}, ${endRgb.b}, ${colorSettings.opacity}) 100%)`;
    } else {
      background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${colorSettings.opacity})`;
    }

    return {
      background,
      backdropFilter: `blur(${settings.blur}px)`,
      WebkitBackdropFilter: `blur(${settings.blur}px)`,
      borderRadius: `${Math.min(settings.borderRadius, 16)}px`,
      border: `1px solid rgba(255, 255, 255, ${settings.borderOpacity})`,
      boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)`,
    };
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      onClick={() => onSelect(preset)}
    >
      <CardContent className="p-3">
        {/* Preview Area */}
        <div className="relative h-24 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-purple-400" />
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-400" />
            <div className="absolute bottom-3 left-6 w-4 h-4 rounded-full bg-blue-400" />
            <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-cyan-400" />
          </div>

          {/* Glass preview */}
          <div
            className="absolute inset-2 flex items-center justify-center"
            style={getPreviewStyle()}
          >
            <span className="text-white/80 text-xs font-medium drop-shadow-sm">
              Preview
            </span>
          </div>

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
              <Check className="w-3 h-3" />
            </div>
          )}

          {/* Custom preset indicator */}
          {preset.isCustom && (
            <div className="absolute top-1 left-1 text-pink-400">
              <Heart className="w-3 h-3 fill-current" />
            </div>
          )}
        </div>

        {/* Preset Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm truncate">{preset.name}</h3>
            {showDelete && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(preset.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {preset.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {preset.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {tag}
              </Badge>
            ))}
            {preset.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{preset.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
