"use client";

import React from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactFormContent {
  title: string;
  subtitle: string;
  showContactInfo: boolean;
  buttonText: string;
}

interface ContactFormProps {
  content: ContactFormContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: ContactFormContent = {
  title: "Get in Touch",
  subtitle: "We'd love to hear from you. Send us a message!",
  showContactInfo: true,
  buttonText: "Send Message",
};

export function ContactForm({
  content = defaultContent,
  glassStyle,
  className,
}: ContactFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div
      className={cn("w-full p-6 rounded-2xl overflow-hidden", className)}
      style={glassStyle}
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left - Contact Info */}
        {content.showContactInfo && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {content.title}
            </h3>
            <p className="text-sm text-white/60 mb-8">{content.subtitle}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Email</p>
                  <p className="text-sm text-white">hello@example.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                  <Phone className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Phone</p>
                  <p className="text-sm text-white">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Location</p>
                  <p className="text-sm text-white">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right - Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Message
            </label>
            <textarea
              placeholder="Your message..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                {content.buttonText}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
