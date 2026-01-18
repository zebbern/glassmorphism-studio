"use client";

import React, { useEffect, useCallback } from "react";
import { X, Smartphone, Tablet, Monitor, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface DeviceFrame {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

export const deviceFrames: DeviceFrame[] = [
  {
    id: "iphone",
    name: "iPhone 14",
    width: 390,
    height: 844,
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: "iphone-se",
    name: "iPhone SE",
    width: 375,
    height: 667,
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: "ipad",
    name: "iPad",
    width: 768,
    height: 1024,
    icon: <Tablet className="h-4 w-4" />,
  },
  {
    id: "ipad-pro",
    name: "iPad Pro",
    width: 1024,
    height: 1366,
    icon: <Tablet className="h-4 w-4" />,
  },
  {
    id: "desktop",
    name: "Desktop",
    width: 1280,
    height: 800,
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    id: "desktop-lg",
    name: "Desktop Large",
    width: 1920,
    height: 1080,
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    id: "full",
    name: "Full Screen",
    width: 0,
    height: 0,
    icon: <Maximize2 className="h-4 w-4" />,
  },
];

interface PreviewModeProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function PreviewMode({ isOpen, onClose, children }: PreviewModeProps) {
  const [selectedDevice, setSelectedDevice] = React.useState<DeviceFrame>(
    deviceFrames.find((d) => d.id === "desktop") || deviceFrames[4],
  );
  const [isRotated, setIsRotated] = React.useState(false);

  // Handle escape key to close preview
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const isFullScreen = selectedDevice.id === "full";
  const frameWidth = isRotated ? selectedDevice.height : selectedDevice.width;
  const frameHeight = isRotated ? selectedDevice.width : selectedDevice.height;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Toolbar */}
      <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-sm font-medium">
            Preview Mode
          </span>
          <span className="text-white/50 text-xs">Press ESC to exit</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                {selectedDevice.icon}
                {selectedDevice.name}
                {!isFullScreen && (
                  <span className="text-white/50 text-xs ml-1">
                    {isRotated
                      ? `${frameHeight}×${frameWidth}`
                      : `${frameWidth}×${frameHeight}`}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-800 border-zinc-700"
            >
              {deviceFrames.map((device) => (
                <DropdownMenuItem
                  key={device.id}
                  onClick={() => {
                    setSelectedDevice(device);
                    setIsRotated(false);
                  }}
                  className="text-white hover:bg-zinc-700 cursor-pointer gap-2"
                >
                  {device.icon}
                  <span>{device.name}</span>
                  {device.width > 0 && (
                    <span className="text-white/50 text-xs ml-auto">
                      {device.width}×{device.height}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Rotate Button (only for non-full devices) */}
          {!isFullScreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRotated(!isRotated)}
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              title="Rotate device"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </Button>
          )}

          {/* Close Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
          >
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        {isFullScreen ? (
          <div className="w-full h-full overflow-auto">{children}</div>
        ) : (
          <div className="relative">
            {/* Device Frame */}
            <div
              className="relative bg-zinc-950 rounded-[2.5rem] p-3 shadow-2xl"
              style={{
                width: frameWidth + 24,
                height: frameHeight + 24,
              }}
            >
              {/* Notch for phones */}
              {selectedDevice.id.includes("iphone") && !isRotated && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-zinc-950 rounded-b-2xl z-10" />
              )}

              {/* Screen */}
              <div
                className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-[2rem] overflow-hidden"
                style={{
                  width: frameWidth,
                  height: frameHeight,
                }}
              >
                <div className="w-full h-full overflow-auto">{children}</div>
              </div>
            </div>

            {/* Device Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs">
              {selectedDevice.name} (
              {isRotated
                ? `${frameHeight}×${frameWidth}`
                : `${frameWidth}×${frameHeight}`}
              )
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
