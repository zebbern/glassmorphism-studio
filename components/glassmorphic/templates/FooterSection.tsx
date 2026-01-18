"use client";

import React from "react";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FooterSectionContent {
  companyName: string;
  tagline: string;
  copyright: string;
  showSocial: boolean;
  showLinks: boolean;
}

interface FooterSectionProps {
  content: FooterSectionContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: FooterSectionContent = {
  companyName: "GlassUI",
  tagline: "Beautiful glassmorphic components",
  copyright: "© 2024 All rights reserved",
  showSocial: true,
  showLinks: true,
};

const links = [
  { title: "Product", items: ["Features", "Pricing", "Docs", "Changelog"] },
  { title: "Company", items: ["About", "Blog", "Careers", "Press"] },
  { title: "Resources", items: ["Community", "Support", "Status", "Terms"] },
];

export function FooterSection({
  content = defaultContent,
  glassStyle,
  className,
}: FooterSectionProps) {
  return (
    <footer
      className={cn("w-full p-8 rounded-2xl overflow-hidden", className)}
      style={glassStyle}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <h3 className="text-xl font-bold text-white mb-2">
            {content.companyName}
          </h3>
          <p className="text-sm text-white/60 mb-4">{content.tagline}</p>

          {/* Social Links */}
          {content.showSocial && (
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Links */}
        {content.showLinks &&
          links.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-white/50">{content.copyright}</p>
        <p className="text-sm text-white/50 flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by
          developers
        </p>
      </div>
    </footer>
  );
}
