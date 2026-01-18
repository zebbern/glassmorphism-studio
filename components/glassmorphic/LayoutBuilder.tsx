"use client";

import React, { useState, useMemo } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Settings2,
  Copy,
  RotateCcw,
  RefreshCcw,
  X,
  Check,
  Palette,
  Sliders,
  ArrowRight,
  Code,
  FileCode,
} from "lucide-react";
import {
  GridCell,
  GridLayout,
  LayoutPresetId,
  ComponentTemplateId,
  GlassSettings,
  ColorSettings,
  GradientSettings,
} from "@/types/glassmorphic";
import { useLayoutBuilder } from "@/hooks/useLayoutBuilder";
import {
  layoutPresets,
  templateInfo,
  getTemplateInfo,
  getTemplatesByCategory,
  getTemplateCategories,
} from "@/lib/layout-presets";
import { cn } from "@/lib/utils";

// Import template components
import { ProfileCard, ProfileCardContent } from "./cards/ProfileCard";
import { PricingCard, PricingCardContent } from "./cards/PricingCard";
import { FeatureCard, FeatureCardContent } from "./cards/FeatureCard";
import {
  TestimonialCard,
  TestimonialCardContent,
} from "./cards/TestimonialCard";

// New template imports
import {
  LoginForm,
  LoginFormContent,
  StatsWidget,
  StatsWidgetContent,
  ChartWidget,
  ChartWidgetContent,
  NotificationToast,
  NotificationToastContent,
  SidebarNav,
  SidebarNavContent,
  MusicPlayer,
  MusicPlayerContent,
} from "./templates/index";

// Per-cell glass style overrides
interface CellStyleOverride {
  blur?: number;
  opacity?: number;
  borderOpacity?: number;
  useCustomStyle?: boolean;
}

interface LayoutBuilderProps {
  glassStyle: React.CSSProperties;
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
  className?: string;
}

// Available card types for switcher
const cardTypes: { id: ComponentTemplateId; name: string; icon: string }[] = [
  { id: "profile", name: "Profile Card", icon: "👤" },
  { id: "pricing", name: "Pricing Card", icon: "💰" },
  { id: "feature", name: "Feature Card", icon: "✨" },
  { id: "testimonial", name: "Testimonial", icon: "💬" },
  { id: "login-form", name: "Login Form", icon: "🔐" },
  { id: "stats-widget", name: "Stats Widget", icon: "📊" },
  { id: "chart-widget", name: "Chart Widget", icon: "📈" },
  { id: "notification-toast", name: "Notification", icon: "🔔" },
  { id: "sidebar-nav", name: "Sidebar Nav", icon: "📋" },
  { id: "music-player", name: "Music Player", icon: "🎵" },
];

export function LayoutBuilder({
  glassStyle,
  settings,
  colorSettings,
  gradientSettings,
  inputColor,
  className,
}: LayoutBuilderProps) {
  const {
    layout,
    selectedCellId,
    isDragging,
    loadPreset,
    selectCell,
    updateCell,
    clearCell,
    placeComponent,
    resetLayout,
    exportLayout,
    updateLayoutSettings,
  } = useLayoutBuilder("grid-2x2");

  const [showTemplates, setShowTemplates] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("cards");
  const [copied, setCopied] = useState(false);
  const [cellStyleOverrides, setCellStyleOverrides] = useState<
    Record<string, CellStyleOverride>
  >({});
  const [editingContent, setEditingContent] = useState<Record<string, unknown>>(
    {},
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"react" | "html" | "json">(
    "react",
  );

  // Get selected cell
  const selectedCell = useMemo(() => {
    return layout.cells.find((c) => c.id === selectedCellId);
  }, [layout.cells, selectedCellId]);

  // Get cell glass style with overrides
  const getCellGlassStyle = (cellId: string): React.CSSProperties => {
    const override = cellStyleOverrides[cellId];
    if (!override?.useCustomStyle) return glassStyle;

    return {
      ...glassStyle,
      backdropFilter:
        override.blur !== undefined
          ? `blur(${override.blur}px)`
          : glassStyle.backdropFilter,
      WebkitBackdropFilter:
        override.blur !== undefined
          ? `blur(${override.blur}px)`
          : glassStyle.WebkitBackdropFilter,
      backgroundColor:
        override.opacity !== undefined
          ? `rgba(255, 255, 255, ${override.opacity / 100})`
          : glassStyle.backgroundColor,
    };
  };

  // Update cell style override
  const updateCellStyle = (
    cellId: string,
    updates: Partial<CellStyleOverride>,
  ) => {
    setCellStyleOverrides((prev) => ({
      ...prev,
      [cellId]: { ...prev[cellId], ...updates },
    }));
  };

  // Handle content update for selected cell
  const handleContentUpdate = (field: string, value: unknown) => {
    if (!selectedCellId || !selectedCell) return;

    const newContent = { ...selectedCell.content, [field]: value };
    setEditingContent(newContent);
    updateCell(selectedCellId, { content: newContent });
  };

  // Switch card type
  const handleSwitchCardType = (newType: ComponentTemplateId) => {
    if (!selectedCellId) return;
    const template = getTemplateInfo(newType);
    if (template) {
      placeComponent(selectedCellId, newType, template.defaultContent);
    }
  };

  // Reset cell style to global
  const resetCellStyle = (cellId: string) => {
    setCellStyleOverrides((prev) => {
      const next = { ...prev };
      delete next[cellId];
      return next;
    });
  };

  // Render a component in a cell
  const renderComponent = (cell: GridCell) => {
    if (!cell.componentId || cell.componentId === "empty") {
      return (
        <div className="w-full h-full flex items-center justify-center text-white/30">
          <Plus className="w-8 h-8" />
        </div>
      );
    }

    const content = cell.content || {};
    const cellStyle = getCellGlassStyle(cell.id);

    switch (cell.componentId) {
      case "profile":
        return (
          <ProfileCard
            content={content as unknown as ProfileCardContent}
            glassStyle={cellStyle}
          />
        );
      case "pricing":
        return (
          <PricingCard
            content={content as unknown as PricingCardContent}
            glassStyle={cellStyle}
          />
        );
      case "feature":
        return (
          <FeatureCard
            content={content as unknown as FeatureCardContent}
            glassStyle={cellStyle}
          />
        );
      case "testimonial":
        return (
          <TestimonialCard
            content={content as unknown as TestimonialCardContent}
            glassStyle={cellStyle}
          />
        );
      case "login-form":
        return (
          <LoginForm
            content={content as unknown as LoginFormContent}
            glassStyle={cellStyle}
          />
        );
      case "stats-widget":
        return (
          <StatsWidget
            content={content as unknown as StatsWidgetContent}
            glassStyle={cellStyle}
          />
        );
      case "chart-widget":
        return (
          <ChartWidget
            content={content as unknown as ChartWidgetContent}
            glassStyle={cellStyle}
          />
        );
      case "notification-toast":
        return (
          <NotificationToast
            content={content as unknown as NotificationToastContent}
            glassStyle={cellStyle}
          />
        );
      case "sidebar-nav":
        return (
          <SidebarNav
            content={content as unknown as SidebarNavContent}
            glassStyle={cellStyle}
          />
        );
      case "music-player":
        return (
          <MusicPlayer
            content={content as unknown as MusicPlayerContent}
            glassStyle={cellStyle}
          />
        );
      default:
        return null;
    }
  };

  // Handle dropping a template onto a cell
  const handleDrop = (cellId: string, templateId: ComponentTemplateId) => {
    const template = getTemplateInfo(templateId);
    if (template) {
      placeComponent(cellId, templateId, template.defaultContent);
    }
  };

  // Generate export code
  const generateExportCode = (): string => {
    const filledCells = layout.cells.filter(
      (c) => c.componentId && c.componentId !== "empty",
    );

    if (exportFormat === "json") {
      return exportLayout();
    }

    if (exportFormat === "html") {
      const glassCSS = `
.glass-card {
  background: rgba(255, 255, 255, ${colorSettings.opacity / 100});
  backdrop-filter: blur(${settings.blur}px);
  -webkit-backdrop-filter: blur(${settings.blur}px);
  border: 1px solid rgba(255, 255, 255, ${settings.borderOpacity});
  border-radius: ${settings.borderRadius}px;
  padding: 1.5rem;
}`;

      const gridHTML = `
<div class="layout-grid" style="
  display: grid;
  grid-template-rows: repeat(${layout.rows}, minmax(120px, 1fr));
  grid-template-columns: repeat(${layout.cols}, 1fr);
  gap: ${layout.gap}px;
  padding: 1rem;
">
${filledCells
  .map(
    (cell) => `  <div class="glass-card" style="
    grid-row: ${cell.row + 1} / span ${cell.rowSpan};
    grid-column: ${cell.col + 1} / span ${cell.colSpan};
  ">
    <!-- ${cell.componentId} card content -->
    ${JSON.stringify(cell.content, null, 2)}
  </div>`,
  )
  .join("\n")}
</div>`;

      return `<!-- Glassmorphic Layout -->
<style>${glassCSS}
</style>
${gridHTML}`;
    }

    // React TSX format
    const imports = new Set<string>();
    filledCells.forEach((cell) => {
      const template = cardTypes.find((t) => t.id === cell.componentId);
      if (template) {
        const componentName = cell
          .componentId!.split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join("");
        imports.add(componentName);
      }
    });

    return `"use client";

import React from "react";
// Import your glassmorphic components
// ${Array.from(imports)
      .map((i) => `import { ${i} } from "@/components/glassmorphic";`)
      .join("\n// ")}

const glassStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, ${colorSettings.opacity / 100})",
  backdropFilter: "blur(${settings.blur}px)",
  WebkitBackdropFilter: "blur(${settings.blur}px)",
  border: "1px solid rgba(255, 255, 255, ${settings.borderOpacity})",
  borderRadius: "${settings.borderRadius}px",
};

export function GlassmorphicLayout() {
  return (
    <div
      className="grid min-h-screen p-4"
      style={{
        gridTemplateRows: "repeat(${layout.rows}, minmax(120px, 1fr))",
        gridTemplateColumns: "repeat(${layout.cols}, 1fr)",
        gap: "${layout.gap}px",
      }}
    >
${filledCells
  .map((cell) => {
    const componentName = cell
      .componentId!.split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("");
    return `      {/* ${componentName} */}
      <div
        style={{
          ...glassStyle,
          gridRow: "${cell.row + 1} / span ${cell.rowSpan}",
          gridColumn: "${cell.col + 1} / span ${cell.colSpan}",
        }}
      >
        {/* Add your ${componentName} component here */}
        {/* Content: ${JSON.stringify(cell.content)} */}
      </div>`;
  })
  .join("\n\n")}
    </div>
  );
}`;
  };

  // Copy generated code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy layout JSON (legacy)
  const handleCopyLayout = () => {
    navigator.clipboard.writeText(exportLayout());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render the content editor based on selected cell type
  const renderContentEditor = () => {
    if (!selectedCell || !selectedCell.componentId) {
      return (
        <div className="text-center py-8 text-white/50">
          <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a cell to edit</p>
        </div>
      );
    }

    const content = selectedCell.content || {};
    const cellId = selectedCell.id;
    const override = cellStyleOverrides[cellId] || {};

    return (
      <div className="space-y-4">
        {/* Card Type Switcher */}
        <div>
          <label className="block text-xs text-white/50 mb-2">Card Type</label>
          <select
            value={selectedCell.componentId}
            onChange={(e) =>
              handleSwitchCardType(e.target.value as ComponentTemplateId)
            }
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
          >
            {cardTypes.map((type) => (
              <option key={type.id} value={type.id} className="bg-gray-900">
                {type.icon} {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Per-Card Style Overrides */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-white/70 flex items-center gap-1">
              <Palette className="w-3 h-3" />
              Custom Glass Style
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={override.useCustomStyle || false}
                onChange={(e) =>
                  updateCellStyle(cellId, { useCustomStyle: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500/50"></div>
            </label>
          </div>

          {override.useCustomStyle && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Blur</span>
                  <span className="text-cyan-400">
                    {override.blur ?? settings.blur}px
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={override.blur ?? settings.blur}
                  onChange={(e) =>
                    updateCellStyle(cellId, { blur: parseInt(e.target.value) })
                  }
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Opacity</span>
                  <span className="text-cyan-400">
                    {override.opacity ?? colorSettings.opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={override.opacity ?? colorSettings.opacity}
                  onChange={(e) =>
                    updateCellStyle(cellId, {
                      opacity: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
              <button
                onClick={() => resetCellStyle(cellId)}
                className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
              >
                <RefreshCcw className="w-3 h-3" />
                Reset to global
              </button>
            </div>
          )}
        </div>

        {/* Content Fields - Dynamic based on card type */}
        <div className="space-y-3">
          <label className="block text-xs text-white/50 mb-2">Content</label>

          {/* Generic text fields based on content */}
          {Object.entries(content).map(([key, value]) => {
            if (typeof value === "string") {
              return (
                <div key={key}>
                  <label className="block text-xs text-white/50 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  {value.length > 50 ? (
                    <textarea
                      value={value}
                      onChange={(e) => handleContentUpdate(key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm resize-none"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleContentUpdate(key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                    />
                  )}
                </div>
              );
            }
            if (typeof value === "number") {
              return (
                <div key={key}>
                  <label className="block text-xs text-white/50 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleContentUpdate(key, parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                  />
                </div>
              );
            }
            if (typeof value === "boolean") {
              return (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-xs text-white/70 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handleContentUpdate(key, e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500/50"></div>
                  </label>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Delete Card */}
        <button
          onClick={() => clearCell(selectedCell.id)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Remove Card
        </button>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Quick Actions Bar - minimal, consistent with other tabs */}
      <div className="flex items-center justify-between">
        {/* Quick Preset Buttons */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          {layoutPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset.id)}
              title={preset.name}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                layout.name === preset.name
                  ? "bg-cyan-500/30 text-cyan-400"
                  : "text-white/50 hover:bg-white/10 hover:text-white",
              )}
            >
              <span className="text-sm">{preset.icon}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-sm text-cyan-400 transition-colors"
          >
            <Code className="w-4 h-4" /> Export Code
          </button>
          <button
            onClick={resetLayout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-sm text-red-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl mx-4 p-6 rounded-2xl bg-gray-900/95 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                Export Layout Code
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Format Tabs */}
            <div className="flex gap-1 p-1 mb-4 rounded-lg bg-white/5 border border-white/10">
              {(["react", "html", "json"] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize",
                    exportFormat === format
                      ? "bg-cyan-500/30 text-cyan-400"
                      : "text-white/50 hover:text-white hover:bg-white/5",
                  )}
                >
                  {format === "react" ? "React TSX" : format.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Code Preview */}
            <div className="relative rounded-xl bg-black/50 border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs text-white/50 font-mono">
                  {exportFormat === "react"
                    ? "layout.tsx"
                    : exportFormat === "html"
                      ? "layout.html"
                      : "layout.json"}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 text-xs text-white/70 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 max-h-[400px] overflow-auto text-sm text-white/80 font-mono">
                <code>{generateExportCode()}</code>
              </pre>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-sm transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCopyCode();
                  setTimeout(() => setShowExportModal(false), 500);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/40 border border-cyan-500/50 text-cyan-400 text-sm transition-colors"
              >
                <Copy className="w-4 h-4" /> Copy & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Grid Preview */}
        <div className="flex-1">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            {/* Grid Settings */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/50">Rows:</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={layout.rows}
                  onChange={(e) =>
                    updateLayoutSettings({
                      rows: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-12 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-sm text-center"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/50">Cols:</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={layout.cols}
                  onChange={(e) =>
                    updateLayoutSettings({
                      cols: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-12 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-sm text-center"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/50">Gap:</label>
                <input
                  type="number"
                  min={0}
                  max={48}
                  value={layout.gap}
                  onChange={(e) =>
                    updateLayoutSettings({ gap: parseInt(e.target.value) || 0 })
                  }
                  className="w-12 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-sm text-center"
                />
              </div>
            </div>

            {/* Grid */}
            <div
              className="grid min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-orange-400/30 p-4"
              style={{
                gridTemplateRows: `repeat(${layout.rows}, minmax(120px, 1fr))`,
                gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                gap: `${layout.gap}px`,
              }}
            >
              {layout.cells.map((cell) => (
                <div
                  key={cell.id}
                  onClick={() => selectCell(cell.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("ring-2", "ring-cyan-400");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("ring-2", "ring-cyan-400");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("ring-2", "ring-cyan-400");
                    const templateId = e.dataTransfer.getData(
                      "templateId",
                    ) as ComponentTemplateId;
                    if (templateId) {
                      handleDrop(cell.id, templateId);
                    }
                  }}
                  className={cn(
                    "relative rounded-xl overflow-hidden transition-all cursor-pointer",
                    selectedCellId === cell.id
                      ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent"
                      : "hover:ring-1 hover:ring-white/30",
                    !cell.componentId &&
                      "bg-white/5 border-2 border-dashed border-white/20",
                  )}
                  style={{
                    gridRow: `${cell.row + 1} / span ${cell.rowSpan}`,
                    gridColumn: `${cell.col + 1} / span ${cell.colSpan}`,
                  }}
                >
                  {/* Cell Content */}
                  <div className="w-full h-full">{renderComponent(cell)}</div>

                  {/* Cell Controls */}
                  {selectedCellId === cell.id && cell.componentId && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTemplates(false); // Switch to edit panel
                        }}
                        title="Edit Card"
                        className="p-1.5 rounded-md bg-cyan-500/80 text-white hover:bg-cyan-500 transition-colors"
                      >
                        <Settings2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearCell(cell.id);
                        }}
                        title="Remove Card"
                        className="p-1.5 rounded-md bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Cell indicator when empty */}
                  {!cell.componentId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <Plus className="w-6 h-6 mx-auto mb-1 text-white/20" />
                        <span className="text-xs text-white/30">Drop here</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Template Palette OR Editor */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Tab Switcher */}
          <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            <button
              onClick={() => setShowTemplates(true)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                showTemplates
                  ? "bg-cyan-500/30 text-cyan-400"
                  : "text-white/50 hover:text-white",
              )}
            >
              <GripVertical className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setShowTemplates(false)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                !showTemplates
                  ? "bg-cyan-500/30 text-cyan-400"
                  : "text-white/50 hover:text-white",
                selectedCell?.componentId && "animate-pulse",
              )}
            >
              <Sliders className="w-4 h-4" />
              Edit
              {selectedCell?.componentId && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>
          </div>

          {/* Content based on active tab */}
          {showTemplates ? (
            // Template Palette
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <GripVertical className="w-4 h-4" />
                  Templates
                </h3>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1 mb-4">
                {getTemplateCategories().map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-2 py-1 rounded-md text-xs capitalize transition-colors",
                      activeCategory === cat
                        ? "bg-cyan-500/30 text-cyan-400"
                        : "bg-white/5 text-white/50 hover:bg-white/10",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {getTemplatesByCategory(activeCategory as any).map(
                  (template) => (
                    <div
                      key={template.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("templateId", template.id);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-grab hover:bg-white/10 hover:border-white/20 transition-all active:cursor-grabbing"
                    >
                      <span className="text-xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {template.name}
                        </div>
                        <div className="text-xs text-white/50 truncate">
                          {template.description}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30" />
                    </div>
                  ),
                )}
              </div>

              <p className="mt-4 text-xs text-white/40 text-center">
                Drag templates into grid cells
              </p>
            </div>
          ) : (
            // Editor Panel
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Edit Card
                </h3>
                {selectedCell?.componentId && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                    {cardTypes.find((t) => t.id === selectedCell.componentId)
                      ?.name || "Unknown"}
                  </span>
                )}
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {renderContentEditor()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
