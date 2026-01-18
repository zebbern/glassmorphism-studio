"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PresetCard } from "./PresetCard";
import {
  defaultPresets,
  presetCategories,
  getPresetsByCategory,
  searchPresets,
} from "@/lib/presets";
import type { GlassPreset, PresetCategory } from "@/types/glassmorphic";
import {
  Search,
  Sparkles,
  Moon,
  Zap,
  Palette,
  Heart,
  Layers,
} from "lucide-react";

interface PresetLibraryProps {
  customPresets: GlassPreset[];
  selectedPresetId?: string;
  onSelectPreset: (preset: GlassPreset) => void;
  onDeleteCustomPreset?: (id: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  all: <Sparkles className="w-4 h-4" />,
  minimal: <Layers className="w-4 h-4" />,
  vibrant: <Zap className="w-4 h-4" />,
  dark: <Moon className="w-4 h-4" />,
  pastel: <Palette className="w-4 h-4" />,
  gradient: <Sparkles className="w-4 h-4" />,
  custom: <Heart className="w-4 h-4" />,
};

export function PresetLibrary({
  customPresets,
  selectedPresetId,
  onSelectPreset,
  onDeleteCustomPreset,
}: PresetLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPresets = useMemo(() => {
    let presets = getPresetsByCategory(activeCategory, customPresets);

    if (searchQuery.trim()) {
      presets = searchPresets(searchQuery, presets);
    }

    return presets;
  }, [activeCategory, searchQuery, customPresets]);

  const allPresets = [...defaultPresets, ...customPresets];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          Preset Library
        </CardTitle>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Category Tabs */}
        <ScrollArea className="w-full pb-2">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="inline-flex h-9 w-max">
              {presetCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-1.5 text-xs px-3"
                >
                  {categoryIcons[category.id]}
                  <span>{category.name}</span>
                  {category.id === "custom" && customPresets.length > 0 && (
                    <span className="ml-1 bg-primary/20 text-primary rounded-full px-1.5 text-[10px]">
                      {customPresets.length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </ScrollArea>

        {/* Presets Grid */}
        <ScrollArea className="h-[400px] mt-4 pr-4">
          {filteredPresets.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredPresets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedPresetId === preset.id}
                  onSelect={onSelectPreset}
                  onDelete={onDeleteCustomPreset}
                  showDelete={preset.isCustom}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              {activeCategory === "custom" && customPresets.length === 0 ? (
                <>
                  <Heart className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">No custom presets yet</p>
                  <p className="text-xs mt-1">
                    Save your configurations as presets!
                  </p>
                </>
              ) : (
                <>
                  <Search className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">No presets found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
          <span>{filteredPresets.length} presets shown</span>
          <span>{allPresets.length} total presets</span>
        </div>
      </CardContent>
    </Card>
  );
}
