"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsWidgetContent {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon?: "users" | "dollar" | "cart" | "eye";
}

interface StatsWidgetProps {
  content: StatsWidgetContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const icons = {
  users: Users,
  dollar: DollarSign,
  cart: ShoppingCart,
  eye: Eye,
};

const defaultContent: StatsWidgetContent = {
  label: "Total Users",
  value: "12,345",
  trend: "+12%",
  trendUp: true,
  icon: "users",
};

export function StatsWidget({
  content = defaultContent,
  glassStyle,
  className,
}: StatsWidgetProps) {
  const IconComponent = content.icon ? icons[content.icon] : Users;

  return (
    <div
      className={cn("w-full p-5 rounded-2xl overflow-hidden", className)}
      style={glassStyle}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60 mb-1">{content.label}</p>
          <p className="text-3xl font-bold text-white">{content.value}</p>
          <div
            className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              content.trendUp ? "text-green-400" : "text-red-400",
            )}
          >
            {content.trendUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{content.trend}</span>
            <span className="text-white/40 font-normal">vs last month</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/10">
          <IconComponent className="w-6 h-6 text-cyan-400" />
        </div>
      </div>
    </div>
  );
}
