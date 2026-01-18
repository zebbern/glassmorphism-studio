"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Palette,
  Settings,
  Code,
  Zap,
  Sparkles,
  Save,
  Sun,
  LayoutGrid,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PresetLibrary } from "@/components/glassmorphic/PresetLibrary";
import { SavedConfigs } from "@/components/glassmorphic/SavedConfigs";
import { ExportModal } from "@/components/glassmorphic/ExportModal";
import {
  ThemeToggle,
  ThemeToggleCompact,
} from "@/components/glassmorphic/ThemeToggle";
import { AnimationControls } from "@/components/glassmorphic/AnimationControls";
import { LightSourceControls } from "@/components/glassmorphic/LightSource";
import { LayoutBuilder } from "@/components/glassmorphic/LayoutBuilder";
import {
  useLocalStorage,
  useSavedConfigurations,
} from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";
import { getSettingsFromURL } from "@/lib/url-encoder";
import {
  defaultAnimationSettings,
  getAnimationStyleObject,
} from "@/lib/animations";
import {
  defaultLightSource,
  generateLightGradient,
  generateLightShadow,
} from "@/lib/light-effects";
import type {
  GlassPreset,
  SavedConfiguration,
  AnimationSettings,
  LightSource,
} from "@/types/glassmorphic";

interface GlassSettings {
  blur: number;
  refraction: number;
  depth: number;
  borderRadius: number;
  borderOpacity: number;
}

interface ColorSettings {
  opacity: number;
  saturation: number;
  brightness: number;
}

interface GradientColorSettings {
  opacity: number;
  saturation: number;
  brightness: number;
}

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface GradientSettings {
  enabled: boolean;
  startColor: string;
  endColor: string;
  direction: number;
  type: "linear" | "radial";
  intensity: number;
}

export default function GlassmorphismUtility() {
  const [settings, setSettings] = useState<GlassSettings>({
    blur: 15,
    refraction: 0.05,
    depth: 5,
    borderRadius: 30,
    borderOpacity: 0.3,
  });

  const [colorSettings, setColorSettings] = useState<ColorSettings>({
    opacity: 0.15,
    saturation: 1.0,
    brightness: 1.0,
  });

  const [gradientColorSettings, setGradientColorSettings] =
    useState<GradientColorSettings>({
      opacity: 0.15,
      saturation: 1.0,
      brightness: 1.0,
    });

  const [inputColor, setInputColor] = useState("#EB8EFD");
  const [glassColors, setGlassColors] = useState<string[]>([
    "#FBECFF",
    "#F6D5FE",
    "#F0B1FE",
    "#EB8EFD",
    "#E76DFC",
    "#E327FC",
    "#BC12D1",
    "#910BA1",
    "#650571",
    "#3A0241",
    "#240129",
  ]);

  const [gradientSettings, setGradientSettings] = useState<GradientSettings>({
    enabled: false,
    startColor: "#A5A0FF",
    endColor: "#8B85FF",
    direction: 145,
    type: "linear",
    intensity: 1.0,
  });

  const [backgroundSettings, setBackgroundSettings] = useState({
    imageUrl: "/tech-background.png",
    opacity: 1.0,
    blur: 0,
    customUrl: "",
  });

  // New feature states
  const [customPresets, setCustomPresets] = useLocalStorage<GlassPreset[]>(
    "glass-custom-presets",
    [],
  );
  const [selectedPresetId, setSelectedPresetId] = useState<
    string | undefined
  >();
  const [activeMainTab, setActiveMainTab] = useState<string>("editor");

  // Phase 2 states: Animation, Light Source, Theme
  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>(
    defaultAnimationSettings,
  );
  const [lightSource, setLightSource] =
    useState<LightSource>(defaultLightSource);
  const { backgroundColor, isDark, effectiveTheme, themeSettings } = useTheme();

  const {
    configs: savedConfigs,
    addConfig: addSavedConfig,
    removeConfig: removeSavedConfig,
    updateConfig: updateSavedConfig,
  } = useSavedConfigurations<SavedConfiguration>("glass-saved-configs");

  // Load settings from URL on mount
  useEffect(() => {
    const urlSettings = getSettingsFromURL();
    if (urlSettings) {
      setSettings(urlSettings.s);
      setColorSettings(urlSettings.c);
      setGradientSettings(urlSettings.g);
      setInputColor(urlSettings.i);
      toast({
        title: "Settings Loaded!",
        description: "Configuration loaded from shared URL.",
      });
    }
  }, []);

  // Handle preset selection
  const handleSelectPreset = (preset: GlassPreset) => {
    setSelectedPresetId(preset.id);
    setSettings(preset.settings);
    setColorSettings(preset.colorSettings);
    setGradientSettings(preset.gradientSettings);
    setInputColor(preset.inputColor);
    setGlassColors(generateGlassmorphicVariants(preset.inputColor));
    toast({
      title: "Preset Applied!",
      description: `"${preset.name}" has been applied.`,
    });
  };

  // Handle saving as custom preset
  const handleSaveAsPreset = () => {
    const newPreset: GlassPreset = {
      id: `custom-${Date.now()}`,
      name: `My Preset ${customPresets.length + 1}`,
      description: "Custom saved preset",
      category: "custom",
      settings,
      colorSettings,
      gradientSettings,
      inputColor,
      tags: ["custom", "saved"],
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    setCustomPresets((prev) => [...prev, newPreset]);
    toast({
      title: "Preset Saved!",
      description: "Your configuration has been saved as a custom preset.",
    });
  };

  // Handle deleting custom preset
  const handleDeleteCustomPreset = (id: string) => {
    setCustomPresets((prev) => prev.filter((p) => p.id !== id));
    if (selectedPresetId === id) {
      setSelectedPresetId(undefined);
    }
    toast({
      title: "Preset Deleted",
      description: "Custom preset has been removed.",
    });
  };

  // Handle loading saved config
  const handleLoadConfig = (config: SavedConfiguration) => {
    setSettings(config.settings);
    setColorSettings(config.colorSettings);
    setGradientSettings(config.gradientSettings);
    setInputColor(config.inputColor);
    setGlassColors(generateGlassmorphicVariants(config.inputColor));
    toast({
      title: "Configuration Loaded!",
      description: `"${config.name}" has been loaded.`,
    });
  };

  const hexToRgb = (hex: string): ColorRGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const adjustColorForGlass = (
    color: string,
    intensity = 1.0,
    useGradientSettings = false,
  ): ColorRGB | null => {
    const rgb = hexToRgb(color);
    if (!rgb) return null;

    const settings = useGradientSettings
      ? gradientColorSettings
      : colorSettings;

    // Apply saturation and brightness adjustments
    const { r, g, b } = rgb;

    // Convert to HSL for better saturation control
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const diff = max - min;
    const sum = max + min;
    const lightness = sum / 2;

    let saturation = 0;
    if (diff !== 0) {
      saturation = lightness > 0.5 ? diff / (2 - sum) : diff / sum;
    }

    // Apply adjustments with intensity
    const newSaturation = Math.min(
      1,
      saturation * settings.saturation * intensity,
    );
    const newLightness = Math.min(1, lightness * settings.brightness);

    // Convert back to RGB with intensity boost
    const adjustedR = Math.round(r * settings.brightness * intensity);
    const adjustedG = Math.round(g * settings.brightness * intensity);
    const adjustedB = Math.round(b * settings.brightness * intensity);

    return {
      r: Math.min(255, Math.max(0, adjustedR)),
      g: Math.min(255, Math.max(0, adjustedG)),
      b: Math.min(255, Math.max(0, adjustedB)),
    };
  };

  const generateGlassmorphicVariants = useCallback((baseColor: string) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [];

    const variants = [];

    for (let i = 0; i < 11; i++) {
      const factor = (i / 10) * 0.8 + 0.2; // Range from 0.2 to 1.0
      const glassOpacity = 0.05 + (i / 10) * 0.3; // Range from 0.05 to 0.35

      const newR = Math.round(
        rgb.r * factor + (255 - rgb.r) * (1 - factor) * 0.3,
      );
      const newG = Math.round(
        rgb.g * factor + (255 - rgb.g) * (1 - factor) * 0.3,
      );
      const newB = Math.round(
        rgb.b * factor + (255 - rgb.b) * (1 - factor) * 0.3,
      );

      variants.push(
        rgbToHex(
          Math.min(255, Math.max(0, newR)),
          Math.min(255, Math.max(0, newG)),
          Math.min(255, Math.max(0, newB)),
        ),
      );
    }

    return variants;
  }, []);

  const generateBaseCSS = () => {
    return `.glass-card {
  width: 240px;
  height: 360px;
  background: rgba(255, 255, 255, ${settings.refraction});
  backdrop-filter: blur(${settings.blur}px);
  -webkit-backdrop-filter: blur(${settings.blur}px);
  border-radius: ${settings.borderRadius}px;
  border: 1px solid rgba(255, 255, 255, ${settings.borderOpacity});
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 ${settings.depth * 2}px ${settings.depth}px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
}

.glass-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8),
    transparent,
    rgba(255, 255, 255, 0.3)
  );
}`;
  };

  const generateColorCSS = () => {
    const adjustedColor = adjustColorForGlass(inputColor);
    if (!adjustedColor) return "";

    return `.glass-card-colored {
  width: 240px;
  height: 360px;
  background: rgba(${adjustedColor.r}, ${adjustedColor.g}, ${adjustedColor.b}, ${colorSettings.opacity});
  backdrop-filter: blur(${settings.blur}px);
  -webkit-backdrop-filter: blur(${settings.blur}px);
  border-radius: ${settings.borderRadius}px;
  border: 1px solid rgba(255, 255, 255, ${settings.borderOpacity});
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 ${settings.depth * 2}px ${settings.depth}px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.glass-card-colored::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
}

.glass-card-colored::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8),
    transparent,
    rgba(255, 255, 255, 0.3)
  );
}`;
  };

  const generateGradientCSS = () => {
    const startRgb = adjustColorForGlass(
      gradientSettings.startColor,
      gradientSettings.intensity,
      true,
    );
    const endRgb = adjustColorForGlass(
      gradientSettings.endColor,
      gradientSettings.intensity,
      true,
    );

    if (!startRgb || !endRgb) return "";

    const gradientType =
      gradientSettings.type === "radial"
        ? "radial-gradient(circle"
        : `linear-gradient(${gradientSettings.direction}deg`;

    return `.glass-card-gradient {
  width: 240px;
  height: 360px;
  background: ${gradientType}, rgba(${startRgb.r}, ${startRgb.g}, ${startRgb.b}, ${gradientColorSettings.opacity}) 0%, rgba(${endRgb.r}, ${endRgb.g}, ${endRgb.b}, ${gradientColorSettings.opacity}) 100%);
  backdrop-filter: blur(${settings.blur}px);
  -webkit-backdrop-filter: blur(${settings.blur}px);
  border-radius: ${settings.borderRadius}px;
  border: 1px solid rgba(255, 255, 255, ${settings.borderOpacity});
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 ${settings.depth * 2}px ${settings.depth}px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.glass-card-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
}

.glass-card-gradient::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8),
    transparent,
    rgba(255, 255, 255, 0.3)
  );
}`;
  };

  const copyBaseCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateBaseCSS());
      toast({
        title: "Base CSS Copied!",
        description:
          "The base glassmorphism CSS has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy CSS to clipboard.",
        variant: "destructive",
      });
    }
  };

  const copyColorCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateColorCSS());
      toast({
        title: "Color CSS Copied!",
        description:
          "The colored glassmorphism CSS has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy CSS to clipboard.",
        variant: "destructive",
      });
    }
  };

  const copyGradientCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateGradientCSS());
      toast({
        title: "Gradient CSS Copied!",
        description:
          "The gradient glassmorphism CSS has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy CSS to clipboard.",
        variant: "destructive",
      });
    }
  };

  const copyAllCSS = async () => {
    try {
      const combinedCSS = `/* Base Glassmorphic Card */\n${generateBaseCSS()}\n\n/* Colored Glassmorphic Card */\n${generateColorCSS()}\n\n/* Gradient Glassmorphic Card */\n${generateGradientCSS()}`;
      await navigator.clipboard.writeText(combinedCSS);
      toast({
        title: "All CSS Copied!",
        description:
          "All glassmorphism CSS variants have been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy CSS to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleColorChange = (color: string) => {
    setInputColor(color);
    setGlassColors(generateGlassmorphicVariants(color));
  };

  const getGlassStyle = () => {
    return {
      background: `rgba(255, 255, 255, ${settings.refraction})`,
      backdropFilter: `blur(${settings.blur}px)`,
      WebkitBackdropFilter: `blur(${settings.blur}px)`,
      borderRadius: `${settings.borderRadius}px`,
      border: `1px solid rgba(255, 255, 255, ${settings.borderOpacity})`,
      boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.5),
        inset 0 -1px 0 rgba(255, 255, 255, 0.1),
        inset 0 0 ${settings.depth * 2}px ${settings.depth}px rgba(255, 255, 255, 0.05)
      `,
      position: "relative" as const,
      overflow: "hidden" as const,
    };
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4 relative"
      style={{
        backgroundColor: "rgb(18, 16, 16)",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundSettings.imageUrl
            ? `url(${backgroundSettings.imageUrl})`
            : "none",
          opacity: backgroundSettings.opacity,
          filter:
            backgroundSettings.blur > 0
              ? `blur(${backgroundSettings.blur}px)`
              : "none",
        }}
      />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Navigation Tabs */}
          <Tabs
            value={activeMainTab}
            onValueChange={setActiveMainTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20">
              <TabsTrigger
                value="editor"
                className="flex items-center gap-2 text-white data-[state=active]:bg-white/20"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Editor</span>
              </TabsTrigger>
              <TabsTrigger
                value="presets"
                className="flex items-center gap-2 text-white data-[state=active]:bg-white/20"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Presets</span>
              </TabsTrigger>
              <TabsTrigger
                value="animations"
                className="flex items-center gap-2 text-white data-[state=active]:bg-white/20"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Animate</span>
              </TabsTrigger>
              <TabsTrigger
                value="lighting"
                className="flex items-center gap-2 text-white data-[state=active]:bg-white/20"
              >
                <Sun className="w-4 h-4" />
                <span className="hidden sm:inline">Light</span>
              </TabsTrigger>
              <TabsTrigger
                value="studio"
                className="flex items-center gap-2 text-white data-[state=active]:bg-white/20"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Design Studio</span>
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex items-center gap-2 text-white data-[state=active]:bg-white/20"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
            </TabsList>

            {/* Action Buttons Row */}
            <div className="flex justify-center gap-3 mt-4">
              <ExportModal
                settings={settings}
                colorSettings={colorSettings}
                gradientSettings={gradientSettings}
                inputColor={inputColor}
              />
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={handleSaveAsPreset}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Preset
              </Button>
            </div>

            {/* Editor Tab Content */}
            <TabsContent value="editor" className="mt-6">
              <div className="space-y-6">
                {/* Main Three Cards Row */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Settings Panel */}
                  <Card className="glass-panel" style={getGlassStyle()}>
                    <CardHeader>
                      <CardTitle className="text-blue-400 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-white">Blur value</Label>
                          <span className="text-green-400 font-mono">
                            {settings.blur}
                          </span>
                        </div>
                        <Slider
                          value={[settings.blur]}
                          onValueChange={([value]) =>
                            setSettings((prev) => ({ ...prev, blur: value }))
                          }
                          max={50}
                          min={0}
                          step={1}
                          className="glass-slider"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-white">Refraction</Label>
                          <span className="text-green-400 font-mono">
                            {settings.refraction.toFixed(2)}
                          </span>
                        </div>
                        <Slider
                          value={[settings.refraction]}
                          onValueChange={([value]) =>
                            setSettings((prev) => ({
                              ...prev,
                              refraction: value,
                            }))
                          }
                          max={1}
                          min={0}
                          step={0.01}
                          className="glass-slider"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-white">Depth</Label>
                          <span className="text-green-400 font-mono">
                            {settings.depth}
                          </span>
                        </div>
                        <Slider
                          value={[settings.depth]}
                          onValueChange={([value]) =>
                            setSettings((prev) => ({ ...prev, depth: value }))
                          }
                          max={30}
                          min={0}
                          step={1}
                          className="glass-slider"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-white">Border Radius</Label>
                          <span className="text-green-400 font-mono">
                            {settings.borderRadius}px
                          </span>
                        </div>
                        <Slider
                          value={[settings.borderRadius]}
                          onValueChange={([value]) =>
                            setSettings((prev) => ({
                              ...prev,
                              borderRadius: value,
                            }))
                          }
                          max={50}
                          min={0}
                          step={1}
                          className="glass-slider"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-white">Border Opacity</Label>
                          <span className="text-green-400 font-mono">
                            {settings.borderOpacity.toFixed(2)}
                          </span>
                        </div>
                        <Slider
                          value={[settings.borderOpacity]}
                          onValueChange={([value]) =>
                            setSettings((prev) => ({
                              ...prev,
                              borderOpacity: value,
                            }))
                          }
                          max={1}
                          min={0}
                          step={0.01}
                          className="glass-slider"
                        />
                      </div>

                      <div className="border-t border-white/20 pt-4">
                        <h3 className="text-white font-semibold mb-3">
                          Background
                        </h3>

                        <div>
                          <Label className="text-white mb-2 block">
                            Background Image
                          </Label>
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                onClick={() =>
                                  setBackgroundSettings((prev) => ({
                                    ...prev,
                                    imageUrl: "/background.png",
                                  }))
                                }
                                size="sm"
                                className={`${
                                  backgroundSettings.imageUrl ===
                                  "/background.png"
                                    ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
                                    : "bg-white/10 text-white/70 border-white/20"
                                } hover:bg-blue-500/40 border backdrop-blur-sm text-xs`}
                              >
                                Tech
                              </Button>
                              <Button
                                onClick={() =>
                                  setBackgroundSettings((prev) => ({
                                    ...prev,
                                    imageUrl: "",
                                  }))
                                }
                                size="sm"
                                className={`${
                                  backgroundSettings.imageUrl === ""
                                    ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
                                    : "bg-white/10 text-white/70 border-white/20"
                                } hover:bg-blue-500/40 border backdrop-blur-sm text-xs`}
                              >
                                None
                              </Button>
                            </div>

                            <div>
                              <Label className="text-white text-xs mb-1 block">
                                Custom URL
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  value={backgroundSettings.customUrl}
                                  onChange={(e) =>
                                    setBackgroundSettings((prev) => ({
                                      ...prev,
                                      customUrl: e.target.value,
                                    }))
                                  }
                                  className="flex-1 text-xs bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                  placeholder="https://example.com/image.jpg"
                                />
                                <Button
                                  onClick={() =>
                                    setBackgroundSettings((prev) => ({
                                      ...prev,
                                      imageUrl:
                                        prev.customUrl ||
                                        "/tech-background.png",
                                    }))
                                  }
                                  size="sm"
                                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 backdrop-blur-sm text-xs px-3"
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-white">
                              Background Opacity
                            </Label>
                            <span className="text-green-400 font-mono">
                              {backgroundSettings.opacity.toFixed(2)}
                            </span>
                          </div>
                          <Slider
                            value={[backgroundSettings.opacity]}
                            onValueChange={([value]) =>
                              setBackgroundSettings((prev) => ({
                                ...prev,
                                opacity: value,
                              }))
                            }
                            max={1}
                            min={0}
                            step={0.01}
                            className="glass-slider"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-white">
                              Background Blur
                            </Label>
                            <span className="text-green-400 font-mono">
                              {backgroundSettings.blur}px
                            </span>
                          </div>
                          <Slider
                            value={[backgroundSettings.blur]}
                            onValueChange={([value]) =>
                              setBackgroundSettings((prev) => ({
                                ...prev,
                                blur: value,
                              }))
                            }
                            max={20}
                            min={0}
                            step={1}
                            className="glass-slider"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Color Preview Panel */}
                  <Card className="glass-panel" style={getGlassStyle()}>
                    <CardHeader>
                      <CardTitle className="text-blue-400 flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Color Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-white mb-2 block">
                          Base Color
                        </Label>
                        <div className="flex gap-2 items-center">
                          <div
                            className="w-12 h-10 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                            onClick={() =>
                              document.getElementById("color-picker")?.click()
                            }
                            style={{
                              ...getGlassStyle(),
                              borderRadius: `${Math.max(4, settings.borderRadius * 0.4)}px`,
                            }}
                          >
                            <div
                              className="absolute inset-1 rounded"
                              style={{
                                backgroundColor: inputColor,
                                borderRadius: `${Math.max(2, settings.borderRadius * 0.3)}px`,
                              }}
                            />
                            <input
                              id="color-picker"
                              type="color"
                              value={inputColor}
                              onChange={(e) =>
                                handleColorChange(e.target.value)
                              }
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <Input
                            type="text"
                            value={inputColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="#EB8EFD"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-white">Glass Opacity</Label>
                          <span className="text-green-400 font-mono">
                            {colorSettings.opacity.toFixed(2)}
                          </span>
                        </div>
                        <Slider
                          value={[colorSettings.opacity]}
                          onValueChange={([value]) =>
                            setColorSettings((prev) => ({
                              ...prev,
                              opacity: value,
                            }))
                          }
                          max={1.0}
                          min={0.01}
                          step={0.01}
                          className="glass-slider"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-white">Saturation</Label>
                          <span className="text-green-400 font-mono">
                            {colorSettings.saturation.toFixed(2)}
                          </span>
                        </div>
                        <Slider
                          value={[colorSettings.saturation]}
                          onValueChange={([value]) =>
                            setColorSettings((prev) => ({
                              ...prev,
                              saturation: value,
                            }))
                          }
                          max={2}
                          min={0.1}
                          step={0.1}
                          className="glass-slider"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-white">Brightness</Label>
                          <span className="text-green-400 font-mono">
                            {colorSettings.brightness.toFixed(2)}
                          </span>
                        </div>
                        <Slider
                          value={[colorSettings.brightness]}
                          onValueChange={([value]) =>
                            setColorSettings((prev) => ({
                              ...prev,
                              brightness: value,
                            }))
                          }
                          max={1.5}
                          min={0.3}
                          step={0.1}
                          className="glass-slider"
                        />
                      </div>

                      <div className="mt-6">
                        <Label className="text-white mb-2 block">
                          Glassmorphic Variants
                        </Label>
                        <div className="grid grid-cols-4 gap-2">
                          {glassColors.map((color, index) => (
                            <div
                              key={index}
                              className="aspect-square cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                              onClick={() => setInputColor(color)}
                              title={color}
                              style={{
                                ...getGlassStyle(),
                                borderRadius: `${settings.borderRadius}px`,
                              }}
                            >
                              <div
                                className="absolute inset-1 rounded-lg"
                                style={{
                                  backgroundColor: color,
                                  borderRadius: `${Math.max(0, settings.borderRadius - 4)}px`,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <div
                          className="w-full h-32 rounded-lg flex items-center justify-center"
                          style={{
                            background: `rgba(${adjustColorForGlass(inputColor)?.r || 255}, ${adjustColorForGlass(inputColor)?.g || 255}, ${adjustColorForGlass(inputColor)?.b || 255}, ${colorSettings.opacity})`,
                            backdropFilter: `blur(${settings.blur}px)`,
                            WebkitBackdropFilter: `blur(${settings.blur}px)`,
                            borderRadius: `${settings.borderRadius}px`,
                            border: `1px solid rgba(255, 255, 255, ${settings.borderOpacity})`,
                            boxShadow: `
                          0 8px 32px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.5),
                          inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                          inset 0 0 ${settings.depth * 2}px ${settings.depth}px rgba(255, 255, 255, 0.1)
                        `,
                            position: "relative" as const,
                            overflow: "hidden" as const,
                          }}
                        >
                          <div className="text-white text-center">
                            <h3 className="font-semibold">Color Preview</h3>
                            <p className="text-sm opacity-80">{inputColor}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Code Panel */}
                  <Card className="glass-panel" style={getGlassStyle()}>
                    <CardHeader>
                      <CardTitle className="text-blue-400 flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        Generated CSS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-white font-semibold">
                            Colored Glass Card
                          </Label>
                          <Button
                            onClick={copyColorCSS}
                            size="sm"
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 backdrop-blur-sm"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div
                          className="relative rounded-lg overflow-hidden"
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
                          <div
                            className="p-4 text-xs font-mono text-white/90 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar"
                            style={{
                              scrollbarWidth: "none",
                              msOverflowStyle: "none",
                            }}
                          >
                            <div className="whitespace-pre-wrap">
                              {generateColorCSS()
                                .split("\n")
                                .map((line, index) => (
                                  <div
                                    key={index}
                                    className="hover:bg-white/5 px-1 -mx-1 rounded transition-colors"
                                  >
                                    {line || "\u00A0"}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {gradientSettings.enabled && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-white font-semibold">
                              Gradient Glass Card
                            </Label>

                            <Label className="text-white font-semibold">
                              Gradient Glass Card
                            </Label>

                            <Button
                              onClick={copyGradientCSS}
                              size="sm"
                              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 backdrop-blur-sm"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <div
                            className="relative rounded-lg overflow-hidden"
                            style={{
                              background: "rgba(0, 0, 0, 0.3)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
                            <div
                              className="p-4 text-xs font-mono text-white/90 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar"
                              style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                              }}
                            >
                              <div className="whitespace-pre-wrap">
                                {generateGradientCSS()
                                  .split("\n")
                                  .map((line, index) => (
                                    <div
                                      key={index}
                                      className="hover:bg-white/5 px-1 -mx-1 rounded transition-colors"
                                    >
                                      {line || "\u00A0"}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-white font-semibold">
                            Base Glass Card
                          </Label>
                          <Button
                            onClick={copyBaseCSS}
                            size="sm"
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 backdrop-blur-sm"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div
                          className="relative rounded-lg overflow-hidden"
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
                          <div
                            className="p-4 text-xs font-mono text-white/90 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar"
                            style={{
                              scrollbarWidth: "none",
                              msOverflowStyle: "none",
                            }}
                          >
                            <div className="whitespace-pre-wrap">
                              {generateBaseCSS()
                                .split("\n")
                                .map((line, index) => (
                                  <div
                                    key={index}
                                    className="hover:bg-white/5 px-1 -mx-1 rounded transition-colors"
                                  >
                                    {line || "\u00A0"}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {gradientSettings.enabled && (
                        <Button
                          onClick={copyAllCSS}
                          className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 backdrop-blur-sm font-semibold"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All CSS
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Gradient Controls Card - Full Width Below */}
                <Card className="glass-panel" style={getGlassStyle()}>
                  <CardHeader>
                    <CardTitle className="text-purple-400 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Gradient Controls
                      <Button
                        onClick={() =>
                          setGradientSettings((prev) => ({
                            ...prev,
                            enabled: !prev.enabled,
                          }))
                        }
                        size="sm"
                        className={`ml-auto ${
                          gradientSettings.enabled
                            ? "bg-purple-500/30 text-purple-300 border-purple-500/50"
                            : "bg-white/10 text-white/70 border-white/20"
                        } hover:bg-purple-500/40 border backdrop-blur-sm transition-all`}
                      >
                        {gradientSettings.enabled ? "ON" : "OFF"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent
                    className={`transition-all duration-300 ${gradientSettings.enabled ? "opacity-100" : "opacity-50"}`}
                  >
                    <div className="grid lg:grid-cols-5 gap-6">
                      {/* Color Controls */}
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold mb-3">
                          Colors
                        </h3>
                        <div>
                          <Label className="text-white text-sm mb-2 block">
                            Start Color
                          </Label>
                          <div className="flex gap-2 items-center">
                            <div
                              className="w-10 h-10 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                              onClick={() =>
                                document
                                  .getElementById("gradient-start-picker")
                                  ?.click()
                              }
                              style={{
                                ...getGlassStyle(),
                                borderRadius: `${Math.max(4, settings.borderRadius * 0.4)}px`,
                              }}
                            >
                              <div
                                className="absolute inset-1 rounded"
                                style={{
                                  backgroundColor: gradientSettings.startColor,
                                  borderRadius: `${Math.max(2, settings.borderRadius * 0.3)}px`,
                                }}
                              />
                              <input
                                id="gradient-start-picker"
                                type="color"
                                value={gradientSettings.startColor}
                                onChange={(e) =>
                                  setGradientSettings((prev) => ({
                                    ...prev,
                                    startColor: e.target.value,
                                  }))
                                }
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={!gradientSettings.enabled}
                              />
                            </div>
                            <Input
                              type="text"
                              value={gradientSettings.startColor}
                              onChange={(e) =>
                                setGradientSettings((prev) => ({
                                  ...prev,
                                  startColor: e.target.value,
                                }))
                              }
                              className="flex-1 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              disabled={!gradientSettings.enabled}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-white text-sm mb-2 block">
                            End Color
                          </Label>
                          <div className="flex gap-2 items-center">
                            <div
                              className="w-10 h-10 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                              onClick={() =>
                                document
                                  .getElementById("gradient-end-picker")
                                  ?.click()
                              }
                              style={{
                                ...getGlassStyle(),
                                borderRadius: `${Math.max(4, settings.borderRadius * 0.4)}px`,
                              }}
                            >
                              <div
                                className="absolute inset-1 rounded"
                                style={{
                                  backgroundColor: gradientSettings.endColor,
                                  borderRadius: `${Math.max(2, settings.borderRadius * 0.3)}px`,
                                }}
                              />
                              <input
                                id="gradient-end-picker"
                                type="color"
                                value={gradientSettings.endColor}
                                onChange={(e) =>
                                  setGradientSettings((prev) => ({
                                    ...prev,
                                    endColor: e.target.value,
                                  }))
                                }
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={!gradientSettings.enabled}
                              />
                            </div>
                            <Input
                              type="text"
                              value={gradientSettings.endColor}
                              onChange={(e) =>
                                setGradientSettings((prev) => ({
                                  ...prev,
                                  endColor: e.target.value,
                                }))
                              }
                              className="flex-1 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              disabled={!gradientSettings.enabled}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Color Adjustments */}
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold mb-3">
                          Adjustments
                        </h3>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-white text-sm">
                              Glass Opacity
                            </Label>
                            <span className="text-purple-400 font-mono text-sm">
                              {gradientColorSettings.opacity.toFixed(2)}
                            </span>
                          </div>
                          <Slider
                            value={[gradientColorSettings.opacity]}
                            onValueChange={([value]) =>
                              setGradientColorSettings((prev) => ({
                                ...prev,
                                opacity: value,
                              }))
                            }
                            max={1.0}
                            min={0.01}
                            step={0.01}
                            className="glass-slider"
                            disabled={!gradientSettings.enabled}
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-white text-sm">
                              Saturation
                            </Label>
                            <span className="text-purple-400 font-mono text-sm">
                              {gradientColorSettings.saturation.toFixed(2)}
                            </span>
                          </div>
                          <Slider
                            value={[gradientColorSettings.saturation]}
                            onValueChange={([value]) =>
                              setGradientColorSettings((prev) => ({
                                ...prev,
                                saturation: value,
                              }))
                            }
                            max={2}
                            min={0.1}
                            step={0.1}
                            className="glass-slider"
                            disabled={!gradientSettings.enabled}
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-white text-sm">
                              Brightness
                            </Label>
                            <span className="text-purple-400 font-mono text-sm">
                              {gradientColorSettings.brightness.toFixed(2)}
                            </span>
                          </div>
                          <Slider
                            value={[gradientColorSettings.brightness]}
                            onValueChange={([value]) =>
                              setGradientColorSettings((prev) => ({
                                ...prev,
                                brightness: value,
                              }))
                            }
                            max={1.5}
                            min={0.3}
                            step={0.1}
                            className="glass-slider"
                            disabled={!gradientSettings.enabled}
                          />
                        </div>
                      </div>

                      {/* Gradient Settings */}
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold mb-3">
                          Settings
                        </h3>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-white">Intensity</Label>
                            <span className="text-purple-400 font-mono">
                              {gradientSettings.intensity.toFixed(1)}
                            </span>
                          </div>
                          <Slider
                            value={[gradientSettings.intensity]}
                            onValueChange={([value]) =>
                              setGradientSettings((prev) => ({
                                ...prev,
                                intensity: value,
                              }))
                            }
                            max={2.0}
                            min={0.3}
                            step={0.1}
                            className="glass-slider"
                            disabled={!gradientSettings.enabled}
                          />
                        </div>
                        <div>
                          <Label className="text-white mb-2 block">Type</Label>
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                setGradientSettings((prev) => ({
                                  ...prev,
                                  type: "linear",
                                }))
                              }
                              size="sm"
                              className={`flex-1 ${
                                gradientSettings.type === "linear"
                                  ? "bg-purple-500/30 text-purple-300 border-purple-500/50"
                                  : "bg-white/10 text-white/70 border-white/20"
                              } hover:bg-purple-500/40 border backdrop-blur-sm`}
                              disabled={!gradientSettings.enabled}
                            >
                              Linear
                            </Button>
                            <Button
                              onClick={() =>
                                setGradientSettings((prev) => ({
                                  ...prev,
                                  type: "radial",
                                }))
                              }
                              size="sm"
                              className={`flex-1 ${
                                gradientSettings.type === "radial"
                                  ? "bg-purple-500/30 text-purple-300 border-purple-500/50"
                                  : "bg-white/10 text-white/70 border-white/20"
                              } hover:bg-purple-500/40 border backdrop-blur-sm`}
                              disabled={!gradientSettings.enabled}
                            >
                              Radial
                            </Button>
                          </div>
                        </div>
                        {gradientSettings.type === "linear" && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label className="text-white">Direction</Label>
                              <span className="text-purple-400 font-mono">
                                {gradientSettings.direction}°
                              </span>
                            </div>
                            <Slider
                              value={[gradientSettings.direction]}
                              onValueChange={([value]) =>
                                setGradientSettings((prev) => ({
                                  ...prev,
                                  direction: value,
                                }))
                              }
                              max={360}
                              min={0}
                              step={1}
                              className="glass-slider"
                              disabled={!gradientSettings.enabled}
                            />
                          </div>
                        )}
                      </div>

                      {/* Quick Presets */}
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold mb-3">
                          Quick Presets
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          <Button
                            onClick={() =>
                              setGradientSettings((prev) => ({
                                ...prev,
                                startColor: "#A5A0FF",
                                endColor: "#8B85FF",
                                direction: 145,
                              }))
                            }
                            size="sm"
                            className="bg-gradient-to-r from-purple-400/20 to-purple-500/20 hover:from-purple-400/30 hover:to-purple-500/30 text-purple-300 border border-purple-500/30 backdrop-blur-sm"
                            disabled={!gradientSettings.enabled}
                          >
                            Soft Purple
                          </Button>
                          <Button
                            onClick={() =>
                              setGradientSettings((prev) => ({
                                ...prev,
                                startColor: "#60A5FA",
                                endColor: "#3B82F6",
                                direction: 135,
                              }))
                            }
                            size="sm"
                            className="bg-gradient-to-r from-blue-400/20 to-blue-500/20 hover:from-blue-400/30 hover:to-blue-500/30 text-blue-300 border border-blue-500/30 backdrop-blur-sm"
                            disabled={!gradientSettings.enabled}
                          >
                            Ocean Blue
                          </Button>
                          <Button
                            onClick={() =>
                              setGradientSettings((prev) => ({
                                ...prev,
                                startColor: "#F472B6",
                                endColor: "#EC4899",
                                direction: 180,
                              }))
                            }
                            size="sm"
                            className="bg-gradient-to-r from-pink-400/20 to-pink-500/20 hover:from-pink-400/30 hover:to-pink-500/30 text-pink-300 border border-pink-500/30 backdrop-blur-sm"
                            disabled={!gradientSettings.enabled}
                          >
                            Pink Glow
                          </Button>
                          <Button
                            onClick={() =>
                              setGradientSettings((prev) => ({
                                ...prev,
                                startColor: "#34D399",
                                endColor: "#10B981",
                                direction: 90,
                              }))
                            }
                            size="sm"
                            className="bg-gradient-to-r from-green-400/20 to-green-500/20 hover:from-green-400/30 hover:to-green-500/30 text-green-300 border border-green-500/30 backdrop-blur-sm"
                            disabled={!gradientSettings.enabled}
                          >
                            Fresh Green
                          </Button>
                        </div>
                      </div>

                      {/* Live Preview */}
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold mb-3">
                          Live Preview
                        </h3>
                        <div className="space-y-3">
                          <div
                            className="w-full h-24 rounded-lg flex items-center justify-center"
                            style={
                              gradientSettings.enabled
                                ? {
                                    background: (() => {
                                      const startRgb = adjustColorForGlass(
                                        gradientSettings.startColor,
                                        gradientSettings.intensity,
                                        true,
                                      );
                                      const endRgb = adjustColorForGlass(
                                        gradientSettings.endColor,
                                        gradientSettings.intensity,
                                        true,
                                      );

                                      if (!startRgb || !endRgb)
                                        return `rgba(255, 255, 255, ${settings.refraction})`;

                                      const gradientType =
                                        gradientSettings.type === "radial"
                                          ? "radial-gradient(circle"
                                          : `linear-gradient(${gradientSettings.direction}deg`;

                                      return `${gradientType}, rgba(${startRgb.r}, ${startRgb.g}, ${startRgb.b}, ${gradientColorSettings.opacity}) 0%, rgba(${endRgb.r}, ${endRgb.g}, ${endRgb.b}, ${gradientColorSettings.opacity}) 100%)`;
                                    })(),
                                    backdropFilter: `blur(${settings.blur}px)`,
                                    WebkitBackdropFilter: `blur(${settings.blur}px)`,
                                    borderRadius: `${settings.borderRadius}px`,
                                    border: `1px solid rgba(255, 255, 255, ${settings.borderOpacity})`,
                                    boxShadow: `
                            0 8px 32px rgba(0, 0, 0, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.5),
                            inset 0 -1px 0 rgba(255, 255, 255, 0.1),
                            inset 0 0 ${settings.depth * 2}px ${settings.depth}px rgba(255, 255, 255, 0.1)
                          `,
                                    position: "relative" as const,
                                    overflow: "hidden" as const,
                                  }
                                : getGlassStyle()
                            }
                          >
                            <div className="text-white text-center">
                              <p className="text-sm font-medium">
                                {gradientSettings.enabled
                                  ? "Gradient Glass"
                                  : "Enable Gradient"}
                              </p>
                            </div>
                          </div>
                          <div
                            className="w-full h-16 rounded-lg"
                            style={{
                              background: gradientSettings.enabled
                                ? `linear-gradient(${gradientSettings.direction}deg, ${gradientSettings.startColor}, ${gradientSettings.endColor})`
                                : "rgba(255, 255, 255, 0.1)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Presets Tab Content */}
            <TabsContent value="presets" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <PresetLibrary
                  customPresets={customPresets}
                  selectedPresetId={selectedPresetId}
                  onSelectPreset={handleSelectPreset}
                  onDeleteCustomPreset={handleDeleteCustomPreset}
                />

                {/* Live Preview */}
                <Card className="glass-panel" style={getGlassStyle()}>
                  <CardHeader>
                    <CardTitle className="text-purple-400 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
                      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-xl" />
                      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-400/30 blur-xl" />

                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div
                          className="w-full max-w-sm h-64 flex items-center justify-center"
                          style={{
                            background: gradientSettings.enabled
                              ? (() => {
                                  const startRgb = adjustColorForGlass(
                                    gradientSettings.startColor,
                                    gradientSettings.intensity,
                                    true,
                                  );
                                  const endRgb = adjustColorForGlass(
                                    gradientSettings.endColor,
                                    gradientSettings.intensity,
                                    true,
                                  );
                                  if (!startRgb || !endRgb)
                                    return `rgba(255, 255, 255, ${colorSettings.opacity})`;
                                  const gradientType =
                                    gradientSettings.type === "radial"
                                      ? "radial-gradient(circle"
                                      : `linear-gradient(${gradientSettings.direction}deg`;
                                  return `${gradientType}, rgba(${startRgb.r}, ${startRgb.g}, ${startRgb.b}, ${colorSettings.opacity}) 0%, rgba(${endRgb.r}, ${endRgb.g}, ${endRgb.b}, ${colorSettings.opacity}) 100%)`;
                                })()
                              : `rgba(${adjustColorForGlass(inputColor)?.r || 255}, ${adjustColorForGlass(inputColor)?.g || 255}, ${adjustColorForGlass(inputColor)?.b || 255}, ${colorSettings.opacity})`,
                            backdropFilter: `blur(${settings.blur}px)`,
                            WebkitBackdropFilter: `blur(${settings.blur}px)`,
                            borderRadius: `${settings.borderRadius}px`,
                            border: `1px solid rgba(255, 255, 255, ${settings.borderOpacity})`,
                            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)`,
                          }}
                        >
                          <div className="text-center text-white">
                            <h3 className="text-xl font-bold mb-2">
                              Glass Card
                            </h3>
                            <p className="text-sm opacity-80">
                              Select a preset to see changes
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Animations Tab Content */}
            <TabsContent value="animations" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Animation Controls */}
                <Card className="glass-panel" style={getGlassStyle()}>
                  <CardContent className="p-6">
                    <AnimationControls
                      settings={animationSettings}
                      onChange={setAnimationSettings}
                    />
                  </CardContent>
                </Card>

                {/* Animation Preview */}
                <Card className="glass-panel" style={getGlassStyle()}>
                  <CardHeader>
                    <CardTitle className="text-purple-400 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center p-8 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-white/10 min-h-[300px]">
                      <div
                        className="w-48 h-48 rounded-2xl flex items-center justify-center text-white text-center"
                        style={{
                          ...getGlassStyle(),
                          ...getAnimationStyleObject(animationSettings),
                        }}
                      >
                        <div>
                          <p className="font-semibold">Animated Glass</p>
                          <p className="text-xs opacity-60 mt-1">
                            {animationSettings.type !== "none"
                              ? `${animationSettings.type} - ${animationSettings.duration}s`
                              : "No animation"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Animation CSS Preview */}
                    {animationSettings.enabled &&
                      animationSettings.type !== "none" && (
                        <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/10">
                          <p className="text-xs text-white/60 mb-2">
                            Add this CSS to enable animation:
                          </p>
                          <code className="text-xs text-green-400 font-mono">
                            animation: {animationSettings.type}{" "}
                            {animationSettings.duration}s{" "}
                            {animationSettings.easing}{" "}
                            {animationSettings.iterationCount};
                          </code>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Lighting Tab Content */}
            <TabsContent value="lighting" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Light Controls */}
                <Card className="glass-panel" style={getGlassStyle()}>
                  <CardContent className="p-6">
                    <LightSourceControls
                      light={lightSource}
                      onChange={setLightSource}
                    />
                  </CardContent>
                </Card>

                {/* Light Preview */}
                <Card className="glass-panel" style={getGlassStyle()}>
                  <CardHeader>
                    <CardTitle className="text-yellow-400 flex items-center gap-2">
                      <Sun className="w-5 h-5" />
                      Light Effect Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="flex justify-center items-center p-8 rounded-xl border border-white/10 min-h-[300px] relative overflow-hidden transition-colors duration-300"
                      style={{ backgroundColor: backgroundColor }}
                    >
                      {/* Background grid */}
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div key={i} className="border border-white/20" />
                        ))}
                      </div>
                      {/* Glass element with light effect */}
                      <div
                        className="relative w-56 h-56 rounded-2xl flex items-center justify-center text-white text-center"
                        style={{
                          ...getGlassStyle(),
                          boxShadow: lightSource.enabled
                            ? generateLightShadow(lightSource)
                            : getGlassStyle().boxShadow,
                        }}
                      >
                        {/* Light overlay */}
                        {lightSource.enabled && (
                          <div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{
                              background: generateLightGradient(lightSource),
                            }}
                          />
                        )}
                        <div className="relative z-10">
                          <p
                            className="font-semibold"
                            style={{ color: isDark ? "white" : "#1a1a2e" }}
                          >
                            Glass + Light
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{
                              color: isDark
                                ? "rgba(255,255,255,0.6)"
                                : "rgba(0,0,0,0.6)",
                            }}
                          >
                            {lightSource.enabled
                              ? `Light at ${Math.round(lightSource.position.x)}%, ${Math.round(lightSource.position.y)}%`
                              : "Light disabled"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Theme Toggle */}
                    <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-white/70 mb-3">
                        Preview Theme
                      </h4>
                      <ThemeToggle showBackgroundPicker={true} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Design Studio Tab Content */}
            <TabsContent value="studio" className="mt-6">
              <LayoutBuilder
                glassStyle={getGlassStyle()}
                settings={settings}
                colorSettings={colorSettings}
                gradientSettings={gradientSettings}
                inputColor={inputColor}
              />
            </TabsContent>

            {/* Saved Tab Content */}
            <TabsContent value="saved" className="mt-6">
              <div className="max-w-2xl mx-auto">
                <SavedConfigs
                  configs={savedConfigs}
                  currentSettings={settings}
                  currentColorSettings={colorSettings}
                  currentGradientSettings={gradientSettings}
                  currentInputColor={inputColor}
                  onSaveConfig={addSavedConfig}
                  onLoadConfig={handleLoadConfig}
                  onDeleteConfig={removeSavedConfig}
                  onUpdateConfig={updateSavedConfig}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
