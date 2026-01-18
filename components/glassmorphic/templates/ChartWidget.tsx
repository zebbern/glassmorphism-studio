"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ChartWidgetContent {
  title: string;
  chartType: "line" | "bar" | "area";
  data: number[];
  color?: string;
}

interface ChartWidgetProps {
  content: ChartWidgetContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: ChartWidgetContent = {
  title: "Revenue",
  chartType: "area",
  data: [30, 45, 35, 55, 40, 60, 50, 70, 55, 65, 75, 60],
  color: "#22d3ee",
};

export function ChartWidget({
  content = defaultContent,
  glassStyle,
  className,
}: ChartWidgetProps) {
  const maxValue = Math.max(...content.data);
  const minValue = Math.min(...content.data);
  const range = maxValue - minValue || 1;

  // Generate SVG path for the chart
  const width = 200;
  const height = 80;
  const padding = 4;

  const points = content.data.map((value, index) => {
    const x =
      padding + (index / (content.data.length - 1)) * (width - padding * 2);
    const y =
      height - padding - ((value - minValue) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const chartColor = content.color || "#22d3ee";

  return (
    <div
      className={cn("w-full p-5 rounded-2xl overflow-hidden", className)}
      style={glassStyle}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{content.title}</h3>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: chartColor }}
          />
          <span className="text-sm text-white/60">Last 12 periods</span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="relative h-20">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Area fill */}
          {content.chartType === "area" && (
            <path d={areaPath} fill={chartColor} fillOpacity="0.2" />
          )}

          {/* Line */}
          {(content.chartType === "line" || content.chartType === "area") && (
            <path
              d={linePath}
              fill="none"
              stroke={chartColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Bars */}
          {content.chartType === "bar" &&
            content.data.map((value, index) => {
              const barWidth = (width - padding * 2) / content.data.length - 2;
              const barHeight =
                ((value - minValue) / range) * (height - padding * 2);
              const x =
                padding +
                index * ((width - padding * 2) / content.data.length) +
                1;
              const y = height - padding - barHeight;
              return (
                <rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={chartColor}
                  fillOpacity="0.6"
                  rx="2"
                />
              );
            })}

          {/* Data points for line/area */}
          {(content.chartType === "line" || content.chartType === "area") &&
            points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="3"
                fill={chartColor}
                className="opacity-0 hover:opacity-100 transition-opacity"
              />
            ))}
        </svg>
      </div>

      {/* Chart footer */}
      <div className="flex items-center justify-between mt-3 text-xs text-white/40">
        <span>Period Start</span>
        <span>Current</span>
      </div>
    </div>
  );
}
