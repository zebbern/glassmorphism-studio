"use client";

import { X } from "lucide-react";
import type {
  GlassSettings,
  ColorSettings,
  GradientSettings,
} from "@/types/glassmorphic";

interface GlassModalProps {
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

export function GlassModal({
  settings,
  colorSettings,
  gradientSettings,
  inputColor,
}: GlassModalProps) {
  const rgb = hexToRgb(inputColor);

  const getBackground = () => {
    if (gradientSettings.enabled) {
      const startRgb = hexToRgb(gradientSettings.startColor);
      const endRgb = hexToRgb(gradientSettings.endColor);
      const gradientType =
        gradientSettings.type === "radial"
          ? "radial-gradient(circle"
          : `linear-gradient(${gradientSettings.direction}deg`;
      return `${gradientType}, rgba(${startRgb.r}, ${startRgb.g}, ${startRgb.b}, ${colorSettings.opacity + 0.1}) 0%, rgba(${endRgb.r}, ${endRgb.g}, ${endRgb.b}, ${colorSettings.opacity + 0.1}) 100%)`;
    }
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${colorSettings.opacity + 0.1})`;
  };

  const modalStyle: React.CSSProperties = {
    background: getBackground(),
    backdropFilter: `blur(${settings.blur}px)`,
    WebkitBackdropFilter: `blur(${settings.blur}px)`,
    borderRadius: `${settings.borderRadius}px`,
    border: `1px solid rgba(255, 255, 255, ${settings.borderOpacity})`,
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1)
    `,
  };

  const buttonStyle: React.CSSProperties = {
    background: `rgba(255, 255, 255, 0.15)`,
    backdropFilter: `blur(10px)`,
    borderRadius: `${Math.min(settings.borderRadius, 8)}px`,
    border: `1px solid rgba(255, 255, 255, 0.2)`,
  };

  return (
    <div className="relative w-full max-w-sm mx-auto" style={modalStyle}>
      {/* Shine effect */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-[1px] h-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.8), transparent, rgba(255,255,255,0.3))",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-lg">Glass Modal</h3>
        <button
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          style={buttonStyle}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 text-white/80 text-sm">
        <p>
          This is a preview of a glassmorphic modal dialog. It features a
          frosted glass effect with customizable blur, opacity, and border
          settings.
        </p>
        <p className="mt-3 text-white/60 text-xs">
          Perfect for overlays, dialogs, and popups.
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 p-4 border-t border-white/10">
        <button className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10">
          Cancel
        </button>
        <button
          className="px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{
            ...buttonStyle,
            background: `rgba(255, 255, 255, 0.2)`,
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export function GlassModalPreview(props: GlassModalProps) {
  return (
    <div className="p-4">
      <GlassModal {...props} />
    </div>
  );
}
