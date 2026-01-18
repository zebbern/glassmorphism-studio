"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Undo2,
  Redo2,
  GripHorizontal,
  Move,
  Eye,
  Group,
  Ungroup,
  LayoutTemplate,
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
import { PreviewMode } from "./PreviewMode";
import { TemplatesGallery } from "./TemplatesGallery";
import { PropsEditor } from "./PropsEditor";

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
  HeroSection,
  HeroSectionContent,
  FooterSection,
  FooterSectionContent,
  NavBar,
  NavBarContent,
  DataTable,
  DataTableContent,
  ImageGallery,
  ImageGalleryContent,
  ContactForm,
  ContactFormContent,
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
  { id: "hero-section", name: "Hero Section", icon: "🚀" },
  { id: "footer-section", name: "Footer", icon: "📋" },
  { id: "nav-bar", name: "Nav Bar", icon: "🧭" },
  { id: "data-table", name: "Data Table", icon: "📊" },
  { id: "image-gallery", name: "Gallery", icon: "🖼️" },
  { id: "contact-form", name: "Contact Form", icon: "✉️" },
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
    applyLayout,
    selectCell,
    updateCell,
    clearCell,
    placeComponent,
    resetLayout,
    exportLayout,
    updateLayoutSettings,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useLayoutBuilder("grid-2x2");

  const [showTemplates, setShowTemplates] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("cards");
  const [copied, setCopied] = useState(false);
  const [cellStyleOverrides, setCellStyleOverrides] = useState<
    Record<string, CellStyleOverride>
  >({});

  // Multi-select state
  const [selectedCellIds, setSelectedCellIds] = useState<Set<string>>(
    new Set(),
  );
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [editingContent, setEditingContent] = useState<Record<string, unknown>>(
    {},
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"react" | "html" | "json">(
    "react",
  );
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplatesGallery, setShowTemplatesGallery] = useState(false);

  // Responsive breakpoints state
  type Breakpoint = "mobile" | "tablet" | "desktop";
  const [activeBreakpoint, setActiveBreakpoint] =
    useState<Breakpoint>("desktop");
  const [responsiveLayouts, setResponsiveLayouts] = useState<
    Record<Breakpoint, typeof layout | null>
  >({
    mobile: null,
    tablet: null,
    desktop: null,
  });

  const breakpoints: {
    id: Breakpoint;
    name: string;
    width: number;
    icon: string;
    maxCols: number;
  }[] = [
    { id: "mobile", name: "Mobile", width: 375, icon: "📱", maxCols: 2 },
    { id: "tablet", name: "Tablet", width: 768, icon: "📱", maxCols: 4 },
    { id: "desktop", name: "Desktop", width: 1280, icon: "🖥️", maxCols: 6 },
  ];

  // Handle breakpoint change
  const handleBreakpointChange = (breakpoint: Breakpoint) => {
    // Save current layout to the active breakpoint
    setResponsiveLayouts((prev) => ({
      ...prev,
      [activeBreakpoint]: JSON.parse(JSON.stringify(layout)),
    }));

    // Load saved layout for new breakpoint or create one from desktop
    const savedLayout = responsiveLayouts[breakpoint];
    if (savedLayout) {
      applyLayout(savedLayout);
    } else if (breakpoint !== "desktop") {
      // First time switching - create responsive version from desktop
      const bp = breakpoints.find((b) => b.id === breakpoint)!;
      const responsiveLayout = {
        ...layout,
        id: `${layout.id}-${breakpoint}`,
        cols: Math.min(layout.cols, bp.maxCols),
        cells: layout.cells.map((cell) => ({
          ...cell,
          colSpan: Math.min(cell.colSpan, bp.maxCols),
          col: Math.min(cell.col, bp.maxCols - 1),
        })),
      };
      applyLayout(responsiveLayout);
    }

    setActiveBreakpoint(breakpoint);
  };

  // Keyboard shortcuts for undo/redo
  // Handle multi-select cell click
  const handleCellClick = (cellId: string, e: React.MouseEvent) => {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      // Multi-select mode
      setSelectedCellIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(cellId)) {
          newSet.delete(cellId);
        } else {
          newSet.add(cellId);
        }
        return newSet;
      });
      setIsMultiSelectMode(true);
    } else {
      // Single select mode
      setSelectedCellIds(new Set([cellId]));
      setIsMultiSelectMode(false);
      selectCell(cellId);
    }
  };

  // Group selected cells
  const groupSelectedCells = () => {
    if (selectedCellIds.size < 2) return;

    const groupId = `group-${Date.now()}`;
    const cellIdsArray = Array.from(selectedCellIds);

    // Update cells with group ID
    cellIdsArray.forEach((cellId) => {
      const cell = layout.cells.find((c) => c.id === cellId);
      if (cell) {
        updateCell(cellId, { ...cell, groupId });
      }
    });

    // Clear multi-select
    setSelectedCellIds(new Set());
    setIsMultiSelectMode(false);
  };

  // Ungroup cells
  const ungroupCells = (groupId: string) => {
    layout.cells
      .filter((c) => c.groupId === groupId)
      .forEach((cell) => {
        updateCell(cell.id, { ...cell, groupId: undefined });
      });
  };

  // Check if selected cells are in a group
  const selectedGroup = useMemo(() => {
    if (selectedCellIds.size === 0) return null;
    const firstCellId = Array.from(selectedCellIds)[0];
    const firstCell = layout.cells.find((c) => c.id === firstCellId);
    if (!firstCell?.groupId) return null;

    // Check if all selected cells are in the same group
    const allInSameGroup = Array.from(selectedCellIds).every((cellId) => {
      const cell = layout.cells.find((c) => c.id === cellId);
      return cell?.groupId === firstCell.groupId;
    });

    return allInSameGroup ? firstCell.groupId : null;
  }, [selectedCellIds, layout.cells]);

  // Keyboard shortcuts for undo/redo and group/ungroup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if focus is in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "g" && !e.shiftKey) {
        // Ctrl+G to group
        e.preventDefault();
        groupSelectedCells();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "G") {
        // Ctrl+Shift+G to ungroup
        e.preventDefault();
        if (selectedGroup) {
          ungroupCells(selectedGroup);
        }
      } else if (e.key === "Escape") {
        // Clear multi-select
        setSelectedCellIds(new Set());
        setIsMultiSelectMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, selectedGroup, selectedCellIds]);

  // Cell resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizingCellId, setResizingCellId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [resizeDirection, setResizeDirection] = useState<
    "row" | "col" | "both" | null
  >(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Handle resize start
  const handleResizeStart = (
    e: React.MouseEvent,
    cellId: string,
    direction: "row" | "col" | "both",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizingCellId(cellId);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setResizeDirection(direction);
  };

  // Handle resize move
  useEffect(() => {
    if (!isResizing || !resizingCellId || !resizeStart || !gridRef.current)
      return;

    const handleMouseMove = (e: MouseEvent) => {
      const grid = gridRef.current;
      if (!grid) return;

      const cell = layout.cells.find((c) => c.id === resizingCellId);
      if (!cell) return;

      const gridRect = grid.getBoundingClientRect();
      const cellWidth = gridRect.width / layout.cols;
      const cellHeight = gridRect.height / layout.rows;

      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      // Calculate new spans
      let newColSpan = cell.colSpan;
      let newRowSpan = cell.rowSpan;

      if (resizeDirection === "col" || resizeDirection === "both") {
        const colChange = Math.round(deltaX / cellWidth);
        newColSpan = Math.max(
          1,
          Math.min(cell.colSpan + colChange, layout.cols - cell.col),
        );
      }

      if (resizeDirection === "row" || resizeDirection === "both") {
        const rowChange = Math.round(deltaY / cellHeight);
        newRowSpan = Math.max(
          1,
          Math.min(cell.rowSpan + rowChange, layout.rows - cell.row),
        );
      }

      // Only update if changed
      if (newColSpan !== cell.colSpan || newRowSpan !== cell.rowSpan) {
        updateCell(resizingCellId, {
          colSpan: newColSpan,
          rowSpan: newRowSpan,
        });
        setResizeStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizingCellId(null);
      setResizeStart(null);
      setResizeDirection(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizing,
    resizingCellId,
    resizeStart,
    resizeDirection,
    layout,
    updateCell,
  ]);

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
      case "hero-section":
        return (
          <HeroSection
            content={content as unknown as HeroSectionContent}
            glassStyle={cellStyle}
          />
        );
      case "footer-section":
        return (
          <FooterSection
            content={content as unknown as FooterSectionContent}
            glassStyle={cellStyle}
          />
        );
      case "nav-bar":
        return (
          <NavBar
            content={content as unknown as NavBarContent}
            glassStyle={cellStyle}
          />
        );
      case "data-table":
        return (
          <DataTable
            content={content as unknown as DataTableContent}
            glassStyle={cellStyle}
          />
        );
      case "image-gallery":
        return (
          <ImageGallery
            content={content as unknown as ImageGalleryContent}
            glassStyle={cellStyle}
          />
        );
      case "contact-form":
        return (
          <ContactForm
            content={content as unknown as ContactFormContent}
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

    // React TSX format - Build proper imports
    const componentImports = new Map<
      string,
      { component: string; content: string }
    >();

    filledCells.forEach((cell) => {
      if (cell.componentId && cell.componentId !== "empty") {
        const componentName = cell.componentId
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join("");
        const contentName = componentName + "Content";
        componentImports.set(cell.componentId, {
          component: componentName,
          content: contentName,
        });
      }
    });

    // Generate import statements
    const importStatements = Array.from(componentImports.values())
      .map(
        ({ component, content }) =>
          `import { ${component}, type ${content} } from "@/components/glassmorphic/templates";`,
      )
      .join("\n");

    // Generate content data for each cell
    const contentDeclarations = filledCells
      .map((cell, index) => {
        const { content } = componentImports.get(cell.componentId!) || {
          content: "unknown",
        };
        return `const cell${index + 1}Content: ${content} = ${JSON.stringify(cell.content, null, 2)};`;
      })
      .join("\n\n");

    // Generate JSX for each filled cell
    const cellsJsx = filledCells
      .map((cell, index) => {
        const { component } = componentImports.get(cell.componentId!) || {
          component: "UnknownComponent",
        };
        return `      {/* ${component} - Cell ${index + 1} */}
      <div
        style={{
          gridRow: "${cell.row + 1} / span ${cell.rowSpan}",
          gridColumn: "${cell.col + 1} / span ${cell.colSpan}",
        }}
      >
        <${component}
          content={cell${index + 1}Content}
          glassStyle={glassStyle}
        />
      </div>`;
      })
      .join("\n\n");

    return `"use client";

import React from "react";

// Component imports
${importStatements}

// Glass morphism styles
const glassStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, ${colorSettings.opacity / 100})",
  backdropFilter: "blur(${settings.blur}px)",
  WebkitBackdropFilter: "blur(${settings.blur}px)",
  border: "1px solid rgba(255, 255, 255, ${settings.borderOpacity})",
  borderRadius: "${settings.borderRadius}px",
};

// Content data for each component
${contentDeclarations}

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
${cellsJsx}
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

        {/* Responsive Breakpoints */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          {breakpoints.map((bp) => (
            <button
              key={bp.id}
              onClick={() => handleBreakpointChange(bp.id)}
              title={`${bp.name} (${bp.width}px)`}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-xs",
                activeBreakpoint === bp.id
                  ? "bg-cyan-500/30 text-cyan-400"
                  : "text-white/50 hover:bg-white/10 hover:text-white",
              )}
            >
              <span>{bp.icon}</span>
              <span className="hidden sm:inline">{bp.name}</span>
            </button>
          ))}
          <span className="text-[10px] text-white/30 ml-1">
            {breakpoints.find((b) => b.id === activeBreakpoint)?.width}px
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo Buttons */}
          <div className="flex items-center gap-1 px-1 py-1 rounded-lg bg-white/5 border border-white/10">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className={cn(
                "p-1.5 rounded-md transition-colors",
                canUndo
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-white/20 cursor-not-allowed",
              )}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className={cn(
                "p-1.5 rounded-md transition-colors",
                canRedo
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-white/20 cursor-not-allowed",
              )}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Group/Ungroup Buttons */}
          {(selectedCellIds.size > 1 || selectedGroup) && (
            <div className="flex items-center gap-1 px-1 py-1 rounded-lg bg-white/5 border border-white/10">
              {selectedCellIds.size > 1 && !selectedGroup && (
                <button
                  onClick={groupSelectedCells}
                  title="Group Selected (Ctrl+G)"
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors text-xs"
                >
                  <Group className="w-3.5 h-3.5" />
                  Group
                </button>
              )}
              {selectedGroup && (
                <button
                  onClick={() => ungroupCells(selectedGroup)}
                  title="Ungroup (Ctrl+Shift+G)"
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors text-xs"
                >
                  <Ungroup className="w-3.5 h-3.5" />
                  Ungroup
                </button>
              )}
            </div>
          )}

          {/* Multi-select indicator */}
          {selectedCellIds.size > 0 && (
            <span className="text-xs text-white/50 px-2">
              {selectedCellIds.size} selected
            </span>
          )}

          <button
            onClick={() => setShowTemplatesGallery(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 hover:from-violet-500/30 hover:to-purple-500/30 border border-violet-500/30 text-sm text-violet-400 transition-colors"
          >
            <LayoutTemplate className="w-4 h-4" /> Templates
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/30 text-sm text-emerald-400 transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
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

      {/* Templates Gallery Modal */}
      <TemplatesGallery
        isOpen={showTemplatesGallery}
        onClose={() => setShowTemplatesGallery(false)}
        onSelectTemplate={applyLayout}
      />

      {/* Preview Mode */}
      <PreviewMode
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        contentWidth={1200}
      >
        <div
          className="w-full min-h-full p-4"
          style={{
            background: gradientSettings.enabled
              ? `linear-gradient(${gradientSettings.direction}deg, ${gradientSettings.startColor}, ${gradientSettings.endColor})`
              : inputColor,
          }}
        >
          <div
            className="grid gap-4"
            style={{
              gridTemplateRows: `repeat(${layout.rows}, minmax(100px, auto))`,
              gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
              gap: `${layout.gap}px`,
            }}
          >
            {layout.cells
              .filter(
                (cell) => cell.componentId && cell.componentId !== "empty",
              )
              .map((cell) => (
                <div
                  key={cell.id}
                  style={{
                    gridRow: `${cell.row + 1} / span ${cell.rowSpan}`,
                    gridColumn: `${cell.col + 1} / span ${cell.colSpan}`,
                  }}
                >
                  {renderComponent(cell)}
                </div>
              ))}
          </div>
        </div>
      </PreviewMode>

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

            {/* Grid Container - Relative for overlay */}
            <div className="relative">
              {/* Grid Snap Guide Overlay - Shows during resize */}
              {isResizing && (
                <div
                  className="absolute inset-0 pointer-events-none z-10 p-4"
                  style={{
                    display: "grid",
                    gridTemplateRows: `repeat(${layout.rows}, minmax(120px, 1fr))`,
                    gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                    gap: `${layout.gap}px`,
                  }}
                >
                  {/* Grid guide cells */}
                  {Array.from({ length: layout.rows * layout.cols }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="border border-dashed border-cyan-400/40 rounded-lg bg-cyan-400/5"
                      />
                    ),
                  )}
                </div>
              )}

              {/* Main Grid */}
              <div
                ref={gridRef}
                className="grid min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-orange-400/30 p-4"
                style={{
                  gridTemplateRows: `repeat(${layout.rows}, minmax(120px, 1fr))`,
                  gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                  gap: `${layout.gap}px`,
                }}
              >
                {layout.cells.map((cell) => {
                  const isSelected =
                    selectedCellIds.has(cell.id) || selectedCellId === cell.id;
                  const isInGroup = !!cell.groupId;
                  const groupColor = isInGroup
                    ? `hsl(${((cell.groupId?.charCodeAt(6) || 0) * 30) % 360}, 70%, 50%)`
                    : undefined;

                  return (
                    <div
                      key={cell.id}
                      onClick={(e) => handleCellClick(cell.id, e)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add(
                          "ring-2",
                          "ring-cyan-400",
                        );
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove(
                          "ring-2",
                          "ring-cyan-400",
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "ring-2",
                          "ring-cyan-400",
                        );
                        const templateId = e.dataTransfer.getData(
                          "templateId",
                        ) as ComponentTemplateId;
                        if (templateId) {
                          handleDrop(cell.id, templateId);
                        }
                      }}
                      className={cn(
                        "relative rounded-xl overflow-hidden transition-all cursor-pointer group",
                        isSelected
                          ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent"
                          : "hover:ring-1 hover:ring-white/30",
                        selectedCellIds.has(cell.id) && selectedCellIds.size > 1
                          ? "ring-2 ring-blue-400 ring-offset-1"
                          : "",
                        !cell.componentId &&
                          "bg-white/5 border-2 border-dashed border-white/20",
                        isResizing &&
                          resizingCellId === cell.id &&
                          "ring-2 ring-yellow-400",
                      )}
                      style={{
                        gridRow: `${cell.row + 1} / span ${cell.rowSpan}`,
                        gridColumn: `${cell.col + 1} / span ${cell.colSpan}`,
                        boxShadow: isInGroup
                          ? `inset 0 0 0 3px ${groupColor}40`
                          : undefined,
                      }}
                    >
                      {/* Group indicator badge */}
                      {isInGroup && (
                        <div
                          className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded text-[10px] font-medium text-white/90"
                          style={{ backgroundColor: groupColor }}
                        >
                          Grouped
                        </div>
                      )}

                      {/* Multi-select checkbox indicator */}
                      {selectedCellIds.has(cell.id) &&
                        selectedCellIds.size > 1 && (
                          <div className="absolute top-1 right-1 z-10 w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}

                      {/* Cell Content */}
                      <div className="w-full h-full">
                        {renderComponent(cell)}
                      </div>

                      {/* Resize Handles - show on selected cell */}
                      {selectedCellId === cell.id && (
                        <>
                          {/* Right edge - resize column */}
                          <div
                            onMouseDown={(e) =>
                              handleResizeStart(e, cell.id, "col")
                            }
                            className="absolute top-0 right-0 w-3 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            title="Drag to resize width"
                          >
                            <div className="w-1 h-8 bg-cyan-400 rounded-full" />
                          </div>
                          {/* Bottom edge - resize row */}
                          <div
                            onMouseDown={(e) =>
                              handleResizeStart(e, cell.id, "row")
                            }
                            className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            title="Drag to resize height"
                          >
                            <div className="w-8 h-1 bg-cyan-400 rounded-full" />
                          </div>
                          {/* Corner - resize both */}
                          <div
                            onMouseDown={(e) =>
                              handleResizeStart(e, cell.id, "both")
                            }
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            title="Drag to resize"
                          >
                            <div className="w-2 h-2 bg-cyan-400 rounded-sm rotate-45" />
                          </div>
                        </>
                      )}

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
                            <span className="text-xs text-white/30">
                              Drop here
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Template Palette OR Editor OR Props */}
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
              {selectedCell?.componentId ? "Props" : "Edit"}
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
          ) : selectedCell?.componentId ? (
            // Props Editor Panel - when a cell with component is selected
            <div className="rounded-xl bg-white/5 border border-white/10 sticky top-4 overflow-hidden max-h-[600px]">
              <PropsEditor
                cell={selectedCell}
                onUpdate={(cellId, content) => {
                  updateCell(cellId, { content });
                }}
                onClose={() => setShowTemplates(true)}
              />
            </div>
          ) : (
            // Empty state - no cell selected
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Edit Card
                </h3>
              </div>

              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                  <Sliders className="w-6 h-6 text-white/30" />
                </div>
                <p className="text-white/50 text-sm">
                  Select a cell with a component
                  <br />
                  to edit its properties
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
