"use client";

import React from "react";
import { Menu, X, ChevronDown, Search, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavBarContent {
  logo: string;
  showSearch: boolean;
  showNotifications: boolean;
  showProfile: boolean;
  menuItems: string[];
}

interface NavBarProps {
  content: NavBarContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: NavBarContent = {
  logo: "GlassUI",
  showSearch: true,
  showNotifications: true,
  showProfile: true,
  menuItems: ["Home", "Features", "Pricing", "About"],
};

export function NavBar({
  content = defaultContent,
  glassStyle,
  className,
}: NavBarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav
      className={cn("w-full p-4 rounded-2xl overflow-hidden", className)}
      style={glassStyle}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <a href="#" className="text-xl font-bold text-white">
            {content.logo}
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {content.menuItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {content.showSearch && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20">
              <Search className="w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-white placeholder-white/50 outline-none w-32"
              />
            </div>
          )}

          {/* Notifications */}
          {content.showNotifications && (
            <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
          )}

          {/* Profile */}
          {content.showProfile && (
            <button className="flex items-center gap-2 p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-white/50 hidden sm:block" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-col gap-3">
            {content.menuItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-white/70 hover:text-white py-2 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
