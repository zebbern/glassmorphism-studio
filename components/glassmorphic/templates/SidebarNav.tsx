"use client";

import React, { useState } from "react";
import {
  Home,
  BarChart2,
  Settings,
  Users,
  MessageSquare,
  FolderOpen,
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  icon:
    | "home"
    | "chart"
    | "settings"
    | "users"
    | "messages"
    | "folder"
    | "bell";
  label: string;
  active?: boolean;
  badge?: string;
  children?: { label: string; href?: string }[];
}

export interface SidebarNavContent {
  items: NavItem[];
  collapsed?: boolean;
  showSearch?: boolean;
  title?: string;
}

interface SidebarNavProps {
  content: SidebarNavContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const icons = {
  home: Home,
  chart: BarChart2,
  settings: Settings,
  users: Users,
  messages: MessageSquare,
  folder: FolderOpen,
  bell: Bell,
};

const defaultContent: SidebarNavContent = {
  title: "Dashboard",
  showSearch: true,
  items: [
    { icon: "home", label: "Dashboard", active: true },
    { icon: "chart", label: "Analytics", badge: "3" },
    {
      icon: "users",
      label: "Team",
      children: [{ label: "Members" }, { label: "Invites" }],
    },
    { icon: "messages", label: "Messages", badge: "12" },
    { icon: "folder", label: "Projects" },
    { icon: "settings", label: "Settings" },
  ],
};

export function SidebarNav({
  content = defaultContent,
  glassStyle,
  className,
}: SidebarNavProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  return (
    <div
      className={cn(
        "w-full h-full min-h-[300px] p-4 rounded-2xl overflow-hidden flex flex-col",
        className,
      )}
      style={glassStyle}
    >
      {/* Header */}
      {content.title && (
        <div className="mb-4 pb-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{content.title}</h2>
        </div>
      )}

      {/* Search */}
      {content.showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {content.items.map((item, index) => {
          const IconComponent = icons[item.icon];
          const isExpanded = expandedItems.includes(item.label);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={index}>
              <button
                onClick={() => hasChildren && toggleExpand(item.label)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                  item.active
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-400 text-xs">
                    {item.badge}
                  </span>
                )}

                {hasChildren && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded && "rotate-180",
                    )}
                  />
                )}
              </button>

              {/* Children */}
              {hasChildren && isExpanded && (
                <div className="mt-1 ml-8 space-y-1">
                  {item.children!.map((child, childIndex) => (
                    <button
                      key={childIndex}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
