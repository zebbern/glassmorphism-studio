"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GridCell, ComponentTemplateId } from "@/types/glassmorphic";
import { getTemplateInfo } from "@/lib/layout-presets";
import { cn } from "@/lib/utils";

interface PropsEditorProps {
  cell: GridCell | null;
  onUpdate: (cellId: string, content: Record<string, unknown>) => void;
  onClose: () => void;
}

// Field type inference
type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "email"
  | "color"
  | "array"
  | "object"
  | "boolean"
  | "select";

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
}

// Get field configurations based on component type
const getFieldConfigs = (
  componentId: ComponentTemplateId | undefined,
): FieldConfig[] => {
  if (!componentId) return [];

  const commonFields: Record<string, FieldConfig[]> = {
    profile: [
      { key: "name", label: "Name", type: "text", placeholder: "John Doe" },
      {
        key: "role",
        label: "Role",
        type: "text",
        placeholder: "Software Engineer",
      },
      {
        key: "avatar",
        label: "Avatar URL",
        type: "url",
        placeholder: "https://...",
      },
      {
        key: "bio",
        label: "Bio",
        type: "textarea",
        placeholder: "About me...",
      },
    ],
    pricing: [
      {
        key: "title",
        label: "Plan Name",
        type: "text",
        placeholder: "Pro Plan",
      },
      { key: "price", label: "Price", type: "text", placeholder: "$29" },
      { key: "period", label: "Period", type: "text", placeholder: "/month" },
      {
        key: "description",
        label: "Description",
        type: "text",
        placeholder: "Best for teams",
      },
      { key: "badge", label: "Badge", type: "text", placeholder: "Popular" },
      {
        key: "features",
        label: "Features",
        type: "array",
        placeholder: "Feature item",
      },
      {
        key: "cta",
        label: "CTA Button",
        type: "text",
        placeholder: "Get Started",
      },
      { key: "highlighted", label: "Highlighted", type: "boolean" },
    ],
    feature: [
      {
        key: "title",
        label: "Title",
        type: "text",
        placeholder: "Feature Title",
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Feature description...",
      },
      { key: "icon", label: "Icon (emoji)", type: "text", placeholder: "⚡" },
    ],
    testimonial: [
      {
        key: "quote",
        label: "Quote",
        type: "textarea",
        placeholder: "What they said...",
      },
      {
        key: "author",
        label: "Author Name",
        type: "text",
        placeholder: "Jane Doe",
      },
      {
        key: "role",
        label: "Author Role",
        type: "text",
        placeholder: "CEO, Company",
      },
      {
        key: "avatar",
        label: "Avatar URL",
        type: "url",
        placeholder: "https://...",
      },
      {
        key: "rating",
        label: "Rating (1-5)",
        type: "number",
        placeholder: "5",
      },
    ],
    "hero-section": [
      { key: "title", label: "Title", type: "text", placeholder: "Hero Title" },
      {
        key: "subtitle",
        label: "Subtitle",
        type: "textarea",
        placeholder: "Hero description...",
      },
      {
        key: "primaryCta",
        label: "Primary Button",
        type: "text",
        placeholder: "Get Started",
      },
      {
        key: "secondaryCta",
        label: "Secondary Button",
        type: "text",
        placeholder: "Learn More",
      },
      { key: "tag", label: "Tag/Badge", type: "text", placeholder: "New" },
    ],
    "footer-section": [
      {
        key: "companyName",
        label: "Company Name",
        type: "text",
        placeholder: "Company",
      },
      {
        key: "tagline",
        label: "Tagline",
        type: "text",
        placeholder: "Building the future",
      },
    ],
    "nav-bar": [
      { key: "logo", label: "Logo Text", type: "text", placeholder: "Logo" },
      { key: "showSearch", label: "Show Search", type: "boolean" },
      {
        key: "showNotifications",
        label: "Show Notifications",
        type: "boolean",
      },
      { key: "showCart", label: "Show Cart", type: "boolean" },
      {
        key: "cartCount",
        label: "Cart Count",
        type: "number",
        placeholder: "0",
      },
    ],
    "stats-widget": [
      {
        key: "title",
        label: "Title",
        type: "text",
        placeholder: "Metric Name",
      },
      { key: "value", label: "Value", type: "text", placeholder: "$10,000" },
      { key: "change", label: "Change %", type: "number", placeholder: "12.5" },
      { key: "trend", label: "Trend", type: "select", options: ["up", "down"] },
      {
        key: "period",
        label: "Period",
        type: "text",
        placeholder: "vs last month",
      },
    ],
    "chart-widget": [
      {
        key: "title",
        label: "Title",
        type: "text",
        placeholder: "Chart Title",
      },
      {
        key: "type",
        label: "Chart Type",
        type: "select",
        options: ["line", "bar", "area"],
      },
      { key: "color", label: "Color", type: "color" },
    ],
    "login-form": [
      {
        key: "title",
        label: "Title",
        type: "text",
        placeholder: "Welcome Back",
      },
      {
        key: "subtitle",
        label: "Subtitle",
        type: "text",
        placeholder: "Sign in...",
      },
      {
        key: "submitText",
        label: "Submit Button",
        type: "text",
        placeholder: "Sign In",
      },
      { key: "showSocial", label: "Show Social Login", type: "boolean" },
      { key: "showRemember", label: "Show Remember Me", type: "boolean" },
    ],
    "notification-toast": [
      {
        key: "title",
        label: "Title",
        type: "text",
        placeholder: "Notification Title",
      },
      {
        key: "message",
        label: "Message",
        type: "text",
        placeholder: "Notification message",
      },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: ["success", "error", "warning", "info"],
      },
      { key: "time", label: "Time", type: "text", placeholder: "Just now" },
    ],
    "sidebar-nav": [
      { key: "title", label: "Title", type: "text", placeholder: "Dashboard" },
    ],
    "music-player": [
      {
        key: "title",
        label: "Song Title",
        type: "text",
        placeholder: "Song Name",
      },
      {
        key: "artist",
        label: "Artist",
        type: "text",
        placeholder: "Artist Name",
      },
      { key: "album", label: "Album", type: "text", placeholder: "Album Name" },
      {
        key: "coverUrl",
        label: "Cover URL",
        type: "url",
        placeholder: "https://...",
      },
      { key: "isPlaying", label: "Is Playing", type: "boolean" },
    ],
    "data-table": [
      {
        key: "title",
        label: "Title",
        type: "text",
        placeholder: "Table Title",
      },
    ],
    "image-gallery": [
      {
        key: "title",
        label: "Title",
        type: "text",
        placeholder: "Gallery Title",
      },
      {
        key: "layout",
        label: "Layout",
        type: "select",
        options: ["grid", "list"],
      },
    ],
    "contact-form": [
      { key: "title", label: "Title", type: "text", placeholder: "Contact Us" },
      {
        key: "submitText",
        label: "Submit Button",
        type: "text",
        placeholder: "Send Message",
      },
    ],
  };

  return commonFields[componentId] || [];
};

export function PropsEditor({ cell, onUpdate, onClose }: PropsEditorProps) {
  const [localContent, setLocalContent] = useState<Record<string, unknown>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"]),
  );

  // Sync local content with cell content
  useEffect(() => {
    if (cell?.content) {
      setLocalContent(JSON.parse(JSON.stringify(cell.content)));
    } else {
      setLocalContent({});
    }
  }, [cell]);

  if (!cell || !cell.componentId) {
    return null;
  }

  const templateInfo = getTemplateInfo(cell.componentId);
  const fieldConfigs = getFieldConfigs(cell.componentId);

  const handleFieldChange = (key: string, value: unknown) => {
    const newContent = { ...localContent, [key]: value };
    setLocalContent(newContent);
    onUpdate(cell.id, newContent);
  };

  const handleArrayAdd = (key: string) => {
    const currentArray = (localContent[key] as string[]) || [];
    handleFieldChange(key, [...currentArray, ""]);
  };

  const handleArrayRemove = (key: string, index: number) => {
    const currentArray = (localContent[key] as string[]) || [];
    handleFieldChange(
      key,
      currentArray.filter((_, i) => i !== index),
    );
  };

  const handleArrayItemChange = (key: string, index: number, value: string) => {
    const currentArray = [...((localContent[key] as string[]) || [])];
    currentArray[index] = value;
    handleFieldChange(key, currentArray);
  };

  const handleReset = () => {
    if (templateInfo?.defaultContent) {
      const resetContent = JSON.parse(
        JSON.stringify(templateInfo.defaultContent),
      );
      setLocalContent(resetContent);
      onUpdate(cell.id, resetContent);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const renderField = (config: FieldConfig) => {
    const value = localContent[config.key];

    switch (config.type) {
      case "text":
      case "url":
      case "email":
        return (
          <input
            type={
              config.type === "url"
                ? "url"
                : config.type === "email"
                  ? "email"
                  : "text"
            }
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(config.key, e.target.value)}
            placeholder={config.placeholder}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
          />
        );

      case "textarea":
        return (
          <textarea
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(config.key, e.target.value)}
            placeholder={config.placeholder}
            rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 resize-none"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={(value as number) ?? ""}
            onChange={(e) =>
              handleFieldChange(
                config.key,
                e.target.value ? parseFloat(e.target.value) : undefined,
              )
            }
            placeholder={config.placeholder}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
          />
        );

      case "color":
        return (
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={(value as string) || "#06b6d4"}
              onChange={(e) => handleFieldChange(config.key, e.target.value)}
              className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={(value as string) || "#06b6d4"}
              onChange={(e) => handleFieldChange(config.key, e.target.value)}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none"
            />
          </div>
        );

      case "boolean":
        return (
          <button
            onClick={() => handleFieldChange(config.key, !value)}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              value ? "bg-cyan-500" : "bg-white/20",
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                value ? "translate-x-7" : "translate-x-1",
              )}
            />
          </button>
        );

      case "select":
        return (
          <select
            value={(value as string) || config.options?.[0] || ""}
            onChange={(e) => handleFieldChange(config.key, e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none cursor-pointer"
          >
            {config.options?.map((opt) => (
              <option key={opt} value={opt} className="bg-zinc-800">
                {opt}
              </option>
            ))}
          </select>
        );

      case "array":
        const arrayValue = (value as string[]) || [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayItemChange(config.key, index, e.target.value)
                  }
                  placeholder={`${config.placeholder} ${index + 1}`}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                />
                <button
                  onClick={() => handleArrayRemove(config.key, index)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleArrayAdd(config.key)}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">{templateInfo?.icon}</span>
          <div>
            <h3 className="font-medium text-white">{templateInfo?.name}</h3>
            <p className="text-xs text-white/50">Edit component properties</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            title="Reset to default"
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Fields Section */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("basic")}
            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-sm font-medium text-white">
              Basic Properties
            </span>
            {expandedSections.has("basic") ? (
              <ChevronUp className="w-4 h-4 text-white/50" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/50" />
            )}
          </button>
          {expandedSections.has("basic") && (
            <div className="p-3 space-y-4">
              {fieldConfigs.map((config) => (
                <div key={config.key} className="space-y-1.5">
                  <label className="text-xs text-white/60 font-medium uppercase tracking-wide">
                    {config.label}
                  </label>
                  {renderField(config)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Raw JSON Section (collapsed by default) */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("json")}
            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-sm font-medium text-white">Raw JSON</span>
            {expandedSections.has("json") ? (
              <ChevronUp className="w-4 h-4 text-white/50" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/50" />
            )}
          </button>
          {expandedSections.has("json") && (
            <div className="p-3">
              <textarea
                value={JSON.stringify(localContent, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setLocalContent(parsed);
                    onUpdate(cell.id, parsed);
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                rows={10}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white text-xs font-mono focus:border-cyan-500/50 focus:outline-none resize-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Cell Info Footer */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex justify-between text-xs text-white/40">
          <span>Cell ID: {cell.id}</span>
          <span>
            Position: ({cell.row}, {cell.col})
          </span>
          <span>
            Size: {cell.rowSpan}×{cell.colSpan}
          </span>
        </div>
      </div>
    </div>
  );
}
