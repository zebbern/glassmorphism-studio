"use client";

import React from "react";
import { ChevronUp, ChevronDown, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTableContent {
  title: string;
  showSearch: boolean;
  showFilter: boolean;
  columns: string[];
}

interface DataTableProps {
  content: DataTableContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: DataTableContent = {
  title: "Users",
  showSearch: true,
  showFilter: true,
  columns: ["Name", "Email", "Status", "Role"],
};

const sampleData = [
  {
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    role: "Admin",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Active",
    role: "User",
  },
  {
    name: "Bob Wilson",
    email: "bob@example.com",
    status: "Inactive",
    role: "User",
  },
  {
    name: "Alice Brown",
    email: "alice@example.com",
    status: "Active",
    role: "Editor",
  },
];

export function DataTable({
  content = defaultContent,
  glassStyle,
  className,
}: DataTableProps) {
  return (
    <div
      className={cn("w-full p-6 rounded-2xl overflow-hidden", className)}
      style={glassStyle}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-white">{content.title}</h3>

        <div className="flex items-center gap-3">
          {/* Search */}
          {content.showSearch && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20">
              <Search className="w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-white placeholder-white/50 outline-none w-32"
              />
            </div>
          )}

          {/* Filter */}
          {content.showFilter && (
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {content.columns.map((column) => (
                <th
                  key={column}
                  className="text-left py-3 px-4 text-xs font-medium text-white/50 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-1 cursor-pointer hover:text-white/70 transition-colors">
                    {column}
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 -mb-1" />
                      <ChevronDown className="w-3 h-3 -mt-1" />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleData.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-white">{row.name}</td>
                <td className="py-3 px-4 text-sm text-white/70">{row.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      row.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400",
                    )}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-white/70">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-white/50">
        <span>Showing 1-4 of 4 results</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-white/10 text-white/70 hover:text-white transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 rounded bg-cyan-500/30 text-cyan-400">
            1
          </button>
          <button className="px-3 py-1 rounded bg-white/10 text-white/70 hover:text-white transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
