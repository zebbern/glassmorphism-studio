"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassButtonPreview } from "./GlassButton";
import { GlassModalPreview } from "./GlassModal";
import { GlassNavbarPreview } from "./GlassNavbar";
import { GlassInputPreview } from "./GlassInput";
import type {
  GlassSettings,
  ColorSettings,
  GradientSettings,
  ComponentType,
} from "@/types/glassmorphic";
import {
  RectangleHorizontal,
  LayoutGrid,
  Navigation,
  FormInput,
  Layers,
  Sun,
  Moon,
  Palette,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComponentGalleryProps {
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
}

interface ComponentTab {
  id: ComponentType;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const componentTabs: ComponentTab[] = [
  {
    id: "button",
    name: "Buttons",
    icon: <RectangleHorizontal className="w-4 h-4" />,
    description: "Interactive glass buttons with hover effects",
  },
  {
    id: "modal",
    name: "Modal",
    icon: <LayoutGrid className="w-4 h-4" />,
    description: "Dialog and overlay components",
  },
  {
    id: "navbar",
    name: "Navbar",
    icon: <Navigation className="w-4 h-4" />,
    description: "Navigation bars and menus",
  },
  {
    id: "input",
    name: "Inputs",
    icon: <FormInput className="w-4 h-4" />,
    description: "Form inputs and text fields",
  },
];

// Background presets for gallery
const backgroundPresets = [
  {
    name: "Purple Gradient",
    gradient: "linear-gradient(135deg, #9333ea, #ec4899, #f97316)",
    dark: false,
  },
  {
    name: "Dark Purple",
    gradient: "linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)",
    dark: true,
  },
  {
    name: "Ocean",
    gradient: "linear-gradient(135deg, #0ea5e9, #06b6d4, #22d3d3)",
    dark: false,
  },
  {
    name: "Dark Ocean",
    gradient: "linear-gradient(135deg, #0c4a6e, #164e63, #134e4a)",
    dark: true,
  },
  {
    name: "Sunset",
    gradient: "linear-gradient(135deg, #f97316, #ef4444, #ec4899)",
    dark: false,
  },
  {
    name: "Dark Sunset",
    gradient: "linear-gradient(135deg, #7c2d12, #991b1b, #831843)",
    dark: true,
  },
  {
    name: "Forest",
    gradient: "linear-gradient(135deg, #22c55e, #10b981, #14b8a6)",
    dark: false,
  },
  {
    name: "Dark Forest",
    gradient: "linear-gradient(135deg, #14532d, #064e3b, #134e4a)",
    dark: true,
  },
  {
    name: "Night Sky",
    color: "#0f172a",
    dark: true,
  },
  {
    name: "Pure White",
    color: "#f8fafc",
    dark: false,
  },
];

export function ComponentGallery({
  settings,
  colorSettings,
  gradientSettings,
  inputColor,
}: ComponentGalleryProps) {
  const [activeTab, setActiveTab] = useState<ComponentType>("button");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previewScale, setPreviewScale] = useState(100);
  const [selectedBackground, setSelectedBackground] = useState(
    backgroundPresets[0],
  );
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);

  const commonProps = {
    settings,
    colorSettings,
    gradientSettings,
    inputColor,
  };

  // Filter backgrounds by dark/light mode
  const filteredBackgrounds = backgroundPresets.filter(
    (bg) => bg.dark === isDarkMode,
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="w-5 h-5 text-primary" />
              Component Gallery
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Preview your glass style on different UI components
            </p>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              // Auto-select first background of the new mode
              const newModeBackgrounds = backgroundPresets.filter(
                (bg) => bg.dark === !isDarkMode,
              );
              if (newModeBackgrounds.length > 0) {
                setSelectedBackground(newModeBackgrounds[0]);
              }
            }}
            className={cn(
              "p-2 rounded-lg transition-all",
              isDarkMode
                ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300",
            )}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Background & Scale Controls */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-border/50">
          {/* Background Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBackgroundOptions(!showBackgroundOptions)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Background</span>
            </button>
            <div className="flex gap-1">
              {filteredBackgrounds.slice(0, 4).map((bg) => (
                <button
                  key={bg.name}
                  onClick={() => setSelectedBackground(bg)}
                  className={cn(
                    "w-6 h-6 rounded-md border-2 transition-all hover:scale-110",
                    selectedBackground.name === bg.name
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border",
                  )}
                  style={{ background: bg.gradient || bg.color }}
                  title={bg.name}
                />
              ))}
            </div>
          </div>

          {/* Scale Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewScale(Math.max(50, previewScale - 10))}
              className="p-1.5 rounded-md bg-muted hover:bg-muted/80"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground w-12 text-center">
              {previewScale}%
            </span>
            <button
              onClick={() => setPreviewScale(Math.min(150, previewScale + 10))}
              className="p-1.5 rounded-md bg-muted hover:bg-muted/80"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewScale(100)}
              className="p-1.5 rounded-md bg-muted hover:bg-muted/80"
              title="Reset Scale"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Background Options */}
        {showBackgroundOptions && (
          <div className="mt-3 p-3 rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {isDarkMode ? "Dark" : "Light"} Backgrounds
              </span>
              <input
                type="color"
                className="w-8 h-8 rounded cursor-pointer"
                onChange={(e) =>
                  setSelectedBackground({
                    name: "Custom",
                    color: e.target.value,
                    dark: isDarkMode,
                  })
                }
                title="Custom color"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {filteredBackgrounds.map((bg) => (
                <button
                  key={bg.name}
                  onClick={() => setSelectedBackground(bg)}
                  className={cn(
                    "aspect-video rounded-lg border-2 transition-all hover:scale-105 flex items-end p-1",
                    selectedBackground.name === bg.name
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border",
                  )}
                  style={{ background: bg.gradient || bg.color }}
                >
                  <span className="text-[10px] text-white/80 bg-black/30 px-1 rounded">
                    {bg.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ComponentType)}
        >
          <TabsList className="grid grid-cols-4 mb-4">
            {componentTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1.5 text-xs"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Component Preview Area */}
          <div className="relative rounded-xl overflow-hidden min-h-[350px]">
            {/* Dynamic Background */}
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background:
                  selectedBackground.gradient || selectedBackground.color,
              }}
            >
              {/* Decorative elements - adjusted for dark/light mode */}
              <div
                className={cn(
                  "absolute top-10 left-10 w-32 h-32 rounded-full blur-xl",
                  isDarkMode ? "bg-white/10" : "bg-white/20",
                )}
              />
              <div
                className={cn(
                  "absolute bottom-10 right-10 w-40 h-40 rounded-full blur-xl",
                  isDarkMode ? "bg-purple-400/20" : "bg-purple-400/30",
                )}
              />
              <div
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full blur-2xl",
                  isDarkMode ? "bg-pink-400/10" : "bg-pink-400/20",
                )}
              />
            </div>

            {/* Component Preview with Scale */}
            <ScrollArea className="relative h-[350px]">
              <div
                className="transition-transform duration-300 origin-center"
                style={{
                  transform: `scale(${previewScale / 100})`,
                  transformOrigin: "center center",
                }}
              >
                <TabsContent value="button" className="m-0">
                  <GlassButtonPreview {...commonProps} />
                </TabsContent>

                <TabsContent value="modal" className="m-0">
                  <GlassModalPreview {...commonProps} />
                </TabsContent>

                <TabsContent value="navbar" className="m-0">
                  <GlassNavbarPreview {...commonProps} />
                </TabsContent>

                <TabsContent value="input" className="m-0">
                  <GlassInputPreview {...commonProps} />
                </TabsContent>
              </div>
            </ScrollArea>
          </div>

          {/* Component Description */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
            <p className="text-muted-foreground">
              {componentTabs.find((t) => t.id === activeTab)?.description}
            </p>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
