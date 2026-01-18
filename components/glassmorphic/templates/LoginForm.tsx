"use client";

import React from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoginFormContent {
  title: string;
  subtitle: string;
  showSocial: boolean;
  showRemember: boolean;
  buttonText?: string;
  signupText?: string;
}

interface LoginFormProps {
  content: LoginFormContent;
  glassStyle: React.CSSProperties;
  className?: string;
}

const defaultContent: LoginFormContent = {
  title: "Welcome Back",
  subtitle: "Sign in to your account",
  showSocial: true,
  showRemember: true,
  buttonText: "Sign In",
  signupText: "Don't have an account? Sign up",
};

export function LoginForm({
  content = defaultContent,
  glassStyle,
  className,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div
      className={cn(
        "w-full max-w-sm p-6 rounded-2xl overflow-hidden",
        className,
      )}
      style={glassStyle}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">{content.title}</h2>
        <p className="text-sm text-white/60">{content.subtitle}</p>
      </div>

      {/* Social Login */}
      {content.showSocial && (
        <div className="flex gap-3 mb-6">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>
      )}

      {/* Divider */}
      {content.showSocial && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-xs text-white/40">or continue with email</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">
        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Remember & Forgot */}
        {content.showRemember && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/60 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-white/10 border-white/20"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>
        )}

        {/* Submit Button */}
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25">
          {content.buttonText || "Sign In"}
        </button>

        {/* Sign Up Link */}
        {content.signupText && (
          <p className="text-center text-sm text-white/60">
            {content.signupText.split("Sign up")[0]}
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Sign up
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
