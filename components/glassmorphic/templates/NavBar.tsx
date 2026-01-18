"use client";

import React from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  User,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavLink {
  label: string;
  href?: string;
  active?: boolean;
}

export interface NavBarContent {
  logo: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  showCart?: boolean;
  cartCount?: number;
  menuItems?: string[];
  links?: NavLink[];
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

  // Handle both menuItems (string[]) and links (NavLink[]) formats
  const navItems: NavLink[] = React.useMemo(() => {
    if (content.links && content.links.length > 0) {
      return content.links;
    }
    if (content.menuItems && content.menuItems.length > 0) {
      return content.menuItems.map((item) => ({ label: item, href: "#" }));
    }
    return (
      defaultContent.menuItems?.map((item) => ({ label: item, href: "#" })) ||
      []
    );
  }, [content.links, content.menuItems]);

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
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href || "#"}
                className={cn(
                  "text-sm transition-colors",
                  item.active
                    ? "text-white font-medium"
                    : "text-white/70 hover:text-white",
                )}
              >
                {item.label}
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

          {/* Cart */}
          {content.showCart && (
            <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {content.cartCount && content.cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-medium">
                  {content.cartCount}
                </span>
              )}
            </button>
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
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href || "#"}
                className={cn(
                  "text-sm py-2 transition-colors",
                  item.active
                    ? "text-white font-medium"
                    : "text-white/70 hover:text-white",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
