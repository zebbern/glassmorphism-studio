"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingCardContent {
  planName: string;
  price: string;
  period: string;
  description?: string;
  features: { text: string; included: boolean }[];
  ctaText: string;
  popular?: boolean;
}

interface PricingCardProps {
  content: PricingCardContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: PricingCardContent = {
  planName: "Pro",
  price: "$29",
  period: "/month",
  description: "Perfect for professionals and small teams",
  features: [
    { text: "Unlimited projects", included: true },
    { text: "Advanced analytics", included: true },
    { text: "Priority support", included: true },
    { text: "Custom integrations", included: true },
    { text: "API access", included: true },
    { text: "White label", included: false },
  ],
  ctaText: "Get Started",
  popular: true,
};

export function PricingCard({
  content = defaultContent,
  glassStyle,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm p-6 rounded-2xl overflow-hidden relative",
        className,
      )}
      style={glassStyle}
    >
      {/* Popular Badge */}
      {content.popular && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wide">
          Popular
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-lg font-semibold text-white/80 mb-2">
        {content.planName}
      </h3>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-5xl font-bold text-white">{content.price}</span>
        <span className="text-white/60 text-lg">{content.period}</span>
      </div>

      {/* Description */}
      {content.description && (
        <p className="text-white/60 text-sm mb-6">{content.description}</p>
      )}

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {content.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            {feature.included ? (
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-400" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="w-3 h-3 text-red-400" />
              </div>
            )}
            <span
              className={cn(
                "text-sm",
                feature.included
                  ? "text-white/80"
                  : "text-white/40 line-through",
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        className={cn(
          "w-full py-3 rounded-xl font-medium transition-all duration-200",
          content.popular
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40",
        )}
      >
        {content.ctaText}
      </button>
    </div>
  );
}

PricingCard.defaultContent = defaultContent;
