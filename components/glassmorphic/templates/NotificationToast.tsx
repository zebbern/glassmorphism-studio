"use client";

import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItem {
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  time?: string;
}

export interface NotificationToastContent {
  // Single toast format
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  showIcon?: boolean;
  showClose?: boolean;
  // Multiple toasts format (items array)
  items?: NotificationItem[];
}

interface NotificationToastProps {
  content: NotificationToastContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-400",
    borderColor: "border-l-green-500",
    bgTint: "bg-green-500/10",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-red-400",
    borderColor: "border-l-red-500",
    bgTint: "bg-red-500/10",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-400",
    borderColor: "border-l-yellow-500",
    bgTint: "bg-yellow-500/10",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-400",
    borderColor: "border-l-blue-500",
    bgTint: "bg-blue-500/10",
  },
};

const defaultContent: NotificationToastContent = {
  type: "success",
  title: "Success!",
  message: "Your changes have been saved successfully.",
  showIcon: true,
  showClose: true,
};

function SingleToast({
  item,
  showIcon = true,
  showClose = false,
  glassStyle,
}: {
  item: NotificationItem;
  showIcon?: boolean;
  showClose?: boolean;
  glassStyle?: React.CSSProperties;
}) {
  const toastType = item.type && toastConfig[item.type] ? item.type : "info";
  const config = toastConfig[toastType];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "w-full rounded-lg overflow-hidden border-l-4",
        config.borderColor,
      )}
      style={glassStyle}
    >
      <div className={cn("p-3", config.bgTint)}>
        <div className="flex items-start gap-3">
          {showIcon && (
            <div className={cn("mt-0.5", config.iconColor)}>
              <IconComponent className="w-4 h-4" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              {item.time && (
                <span className="text-xs text-white/40">{item.time}</span>
              )}
            </div>
            <p className="text-xs text-white/60 mt-0.5">{item.message}</p>
          </div>
          {showClose && (
            <button className="text-white/40 hover:text-white/60 transition-colors">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationToast({
  content = defaultContent,
  glassStyle,
  className,
}: NotificationToastProps) {
  // Check if we have items array (multiple notifications)
  if (
    content.items &&
    Array.isArray(content.items) &&
    content.items.length > 0
  ) {
    return (
      <div
        className={cn("w-full rounded-xl overflow-hidden p-4", className)}
        style={glassStyle}
      >
        {content.title && (
          <h3 className="text-sm font-semibold text-white mb-3">
            {content.title}
          </h3>
        )}
        <div className="space-y-2">
          {content.items.map((item, index) => (
            <SingleToast
              key={index}
              item={item}
              showIcon={content.showIcon !== false}
              showClose={content.showClose}
            />
          ))}
        </div>
      </div>
    );
  }

  // Single toast format
  const toastType =
    content?.type && toastConfig[content.type] ? content.type : "info";
  const config = toastConfig[toastType];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-xl overflow-hidden border-l-4",
        config.borderColor,
        className,
      )}
      style={glassStyle}
    >
      <div className={cn("p-4", config.bgTint)}>
        <div className="flex items-start gap-3">
          {content.showIcon !== false && (
            <div className={cn("mt-0.5", config.iconColor)}>
              <IconComponent className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white mb-0.5">
              {content.title}
            </h4>
            {content.message && (
              <p className="text-sm text-white/70">{content.message}</p>
            )}
          </div>
          {content.showClose && (
            <button className="text-white/40 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
