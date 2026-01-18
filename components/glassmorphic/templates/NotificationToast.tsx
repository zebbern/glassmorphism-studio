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

export interface NotificationToastContent {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  showIcon: boolean;
  showClose?: boolean;
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

export function NotificationToast({
  content = defaultContent,
  glassStyle,
  className,
}: NotificationToastProps) {
  const config = toastConfig[content.type];
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
          {/* Icon */}
          {content.showIcon && (
            <div className={cn("mt-0.5", config.iconColor)}>
              <IconComponent className="w-5 h-5" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white mb-0.5">
              {content.title}
            </h4>
            <p className="text-sm text-white/70">{content.message}</p>
          </div>

          {/* Close button */}
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
