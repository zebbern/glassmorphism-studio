"use client";

import React, { useState } from "react";
import {
  User,
  CreditCard,
  Zap,
  MessageSquare,
  Download,
  Copy,
  Check,
  ChevronDown,
  Sun,
  Moon,
  Palette,
  Settings2,
} from "lucide-react";
import {
  CardTemplateId,
  GlassSettings,
  ColorSettings,
  GradientSettings,
} from "@/types/glassmorphic";
import {
  ProfileCard,
  ProfileCardContent,
  PricingCard,
  PricingCardContent,
  FeatureCard,
  FeatureCardContent,
  TestimonialCard,
  TestimonialCardContent,
} from "./cards";
import { cn } from "@/lib/utils";

interface CardGeneratorProps {
  glassStyle: React.CSSProperties;
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
  className?: string;
}

type CardContent =
  | ProfileCardContent
  | PricingCardContent
  | FeatureCardContent
  | TestimonialCardContent;

const cardTemplates: {
  id: CardTemplateId;
  name: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "profile",
    name: "Profile Card",
    icon: <User className="w-5 h-5" />,
    description: "User profile with avatar, bio, and contact info",
  },
  {
    id: "pricing",
    name: "Pricing Card",
    icon: <CreditCard className="w-5 h-5" />,
    description: "Subscription plans with features list",
  },
  {
    id: "feature",
    name: "Feature Card",
    icon: <Zap className="w-5 h-5" />,
    description: "Highlight product features with icons",
  },
  {
    id: "testimonial",
    name: "Testimonial Card",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Customer quotes with ratings",
  },
];

// Background presets for card preview
const backgroundPresets = [
  { name: "Dark", color: "#1a1a2e" },
  { name: "Deep Purple", color: "#1e1e3f" },
  { name: "Navy", color: "#0a192f" },
  { name: "Charcoal", color: "#2d2d2d" },
  { name: "Light", color: "#f5f5f7" },
  { name: "Gradient 1", gradient: "linear-gradient(135deg, #1a1a2e, #2d1f54)" },
  { name: "Gradient 2", gradient: "linear-gradient(135deg, #0a192f, #172a45)" },
  { name: "Gradient 3", gradient: "linear-gradient(135deg, #240046, #3c096c)" },
];

export function CardGenerator({
  glassStyle,
  settings,
  colorSettings,
  gradientSettings,
  inputColor,
  className,
}: CardGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<CardTemplateId>("profile");
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(false);

  // Preview customization states
  const [previewBackground, setPreviewBackground] = useState("#1a1a2e");
  const [previewScale, setPreviewScale] = useState(100);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Default content for each card type
  const [profileContent, setProfileContent] = useState<ProfileCardContent>(
    ProfileCard.defaultContent,
  );
  const [pricingContent, setPricingContent] = useState<PricingCardContent>(
    PricingCard.defaultContent,
  );
  const [featureContent, setFeatureContent] = useState<FeatureCardContent>(
    FeatureCard.defaultContent,
  );
  const [testimonialContent, setTestimonialContent] =
    useState<TestimonialCardContent>(TestimonialCard.defaultContent);

  const getCurrentContent = (): CardContent => {
    switch (selectedTemplate) {
      case "profile":
        return profileContent;
      case "pricing":
        return pricingContent;
      case "feature":
        return featureContent;
      case "testimonial":
        return testimonialContent;
      default:
        return profileContent;
    }
  };

  const generateReactCode = (): string => {
    const styleString = `
  backdropFilter: "blur(${settings.blur}px)",
  backgroundColor: "rgba(${parseInt(inputColor.slice(1, 3), 16)}, ${parseInt(inputColor.slice(3, 5), 16)}, ${parseInt(inputColor.slice(5, 7), 16)}, ${colorSettings.opacity / 100})",
  borderRadius: "${settings.borderRadius}px",
  border: "1px solid rgba(255, 255, 255, ${settings.borderOpacity / 100})",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",`;

    const contentString = JSON.stringify(getCurrentContent(), null, 2);

    return `// ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Card Component
import React from "react";

const ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}Card = () => {
  const glassStyle = {${styleString}
  };

  const content = ${contentString};

  return (
    <div style={glassStyle} className="p-6 rounded-2xl">
      {/* Add your card content here */}
    </div>
  );
};

export default ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}Card;`;
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateReactCode());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadCode = () => {
    const code = generateReactCode();
    const blob = new Blob([code], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate}-card.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCardPreview = () => {
    switch (selectedTemplate) {
      case "profile":
        return <ProfileCard content={profileContent} glassStyle={glassStyle} />;
      case "pricing":
        return <PricingCard content={pricingContent} glassStyle={glassStyle} />;
      case "feature":
        return <FeatureCard content={featureContent} glassStyle={glassStyle} />;
      case "testimonial":
        return (
          <TestimonialCard
            content={testimonialContent}
            glassStyle={glassStyle}
          />
        );
      default:
        return null;
    }
  };

  const renderContentEditor = () => {
    switch (selectedTemplate) {
      case "profile":
        return (
          <ProfileContentEditor
            content={profileContent}
            onChange={setProfileContent}
          />
        );
      case "pricing":
        return (
          <PricingContentEditor
            content={pricingContent}
            onChange={setPricingContent}
          />
        );
      case "feature":
        return (
          <FeatureContentEditor
            content={featureContent}
            onChange={setFeatureContent}
          />
        );
      case "testimonial":
        return (
          <TestimonialContentEditor
            content={testimonialContent}
            onChange={setTestimonialContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Template Selector */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-cyan-400" />
          Card Templates
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {cardTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={cn(
                "flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left",
                selectedTemplate === template.id
                  ? "bg-cyan-500/20 border-cyan-500/50 text-white"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {template.icon}
                <span className="font-medium">{template.name}</span>
              </div>
              <span className="text-xs opacity-60">{template.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Background Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Preview Background
          </h4>
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-xs text-white/50 hover:text-white/70 flex items-center gap-1"
          >
            <Settings2 className="w-3 h-3" />
            {showAdvancedOptions ? "Hide" : "Show"} Options
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {backgroundPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                setPreviewBackground(
                  preset.gradient ?? preset.color ?? "#1a1a2e",
                )
              }
              className={cn(
                "w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110",
                previewBackground === (preset.gradient ?? preset.color)
                  ? "border-white ring-2 ring-cyan-500/50"
                  : "border-white/20",
              )}
              style={{ background: preset.gradient ?? preset.color }}
              title={preset.name}
            />
          ))}
          <input
            type="color"
            value={
              previewBackground.startsWith("linear")
                ? "#1a1a2e"
                : previewBackground
            }
            onChange={(e) => setPreviewBackground(e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer border-2 border-white/20"
            title="Custom color"
          />
        </div>

        {showAdvancedOptions && (
          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/60">Preview Scale</span>
                <span className="text-white/80">{previewScale}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={previewScale}
                onChange={(e) => setPreviewScale(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-white/10 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Preview */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white/70">Preview</h4>
        <div
          className="flex justify-center p-8 rounded-xl border border-white/10 min-h-[400px] items-center transition-all duration-300"
          style={{ background: previewBackground }}
        >
          <div style={{ transform: `scale(${previewScale / 100})` }}>
            {renderCardPreview()}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white/70">Edit Content</h4>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          {renderContentEditor()}
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex gap-3">
        <button
          onClick={copyCode}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 border border-white/20"
        >
          {copiedCode ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copiedCode ? "Copied!" : "Copy React Code"}
        </button>
        <button
          onClick={downloadCode}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-medium transition-all duration-200 border border-cyan-500/50"
        >
          <Download className="w-4 h-4" />
          Download .tsx
        </button>
      </div>

      {/* Code Preview Toggle */}
      <button
        onClick={() => setShowCodePanel(!showCodePanel)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-all duration-200 border border-white/10"
      >
        <span>View Generated Code</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            showCodePanel && "rotate-180",
          )}
        />
      </button>

      {showCodePanel && (
        <pre className="p-4 rounded-xl bg-black/50 border border-white/10 overflow-x-auto text-xs text-green-400 font-mono">
          {generateReactCode()}
        </pre>
      )}
    </div>
  );
}

// Content Editors for each card type
function ProfileContentEditor({
  content,
  onChange,
}: {
  content: ProfileCardContent;
  onChange: (content: ProfileCardContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Name"
          value={content.name}
          onChange={(v) => onChange({ ...content, name: v })}
        />
        <InputField
          label="Title / Role"
          value={content.title}
          onChange={(v) => onChange({ ...content, title: v })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Location"
          value={content.location || ""}
          onChange={(v) => onChange({ ...content, location: v })}
          placeholder="City, Country"
        />
        <InputField
          label="Email"
          value={content.email || ""}
          onChange={(v) => onChange({ ...content, email: v })}
          placeholder="email@example.com"
        />
      </div>
      <InputField
        label="Website URL"
        value={content.website || ""}
        onChange={(v) => onChange({ ...content, website: v })}
        placeholder="yourwebsite.com"
      />
      <InputField
        label="Avatar URL (optional)"
        value={content.avatar || ""}
        onChange={(v) => onChange({ ...content, avatar: v })}
        placeholder="https://example.com/avatar.jpg"
      />
      <TextareaField
        label="Bio / Description"
        value={content.bio || ""}
        onChange={(v) => onChange({ ...content, bio: v })}
        placeholder="Write a short bio..."
      />
    </div>
  );
}

function PricingContentEditor({
  content,
  onChange,
}: {
  content: PricingCardContent;
  onChange: (content: PricingCardContent) => void;
}) {
  const addFeature = () => {
    onChange({
      ...content,
      features: [...content.features, { text: "New feature", included: true }],
    });
  };

  const updateFeature = (index: number, text: string) => {
    const newFeatures = [...content.features];
    newFeatures[index] = { ...newFeatures[index], text };
    onChange({ ...content, features: newFeatures });
  };

  const toggleFeature = (index: number) => {
    const newFeatures = [...content.features];
    newFeatures[index] = {
      ...newFeatures[index],
      included: !newFeatures[index].included,
    };
    onChange({ ...content, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    onChange({
      ...content,
      features: content.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <InputField
        label="Plan Name"
        value={content.planName}
        onChange={(v) => onChange({ ...content, planName: v })}
      />
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Price"
          value={content.price}
          onChange={(v) => onChange({ ...content, price: v })}
          placeholder="$29"
        />
        <InputField
          label="Period"
          value={content.period}
          onChange={(v) => onChange({ ...content, period: v })}
          placeholder="/month"
        />
      </div>
      <InputField
        label="Description"
        value={content.description || ""}
        onChange={(v) => onChange({ ...content, description: v })}
        placeholder="Perfect for professionals..."
      />
      <InputField
        label="CTA Button Text"
        value={content.ctaText}
        onChange={(v) => onChange({ ...content, ctaText: v })}
      />

      {/* Features List Editor */}
      <div className="space-y-2">
        <label className="text-xs text-white/60 flex items-center justify-between">
          <span>Features List</span>
          <button
            onClick={addFeature}
            className="text-cyan-400 hover:text-cyan-300 text-xs"
          >
            + Add Feature
          </button>
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {content.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <button
                onClick={() => toggleFeature(index)}
                className={cn(
                  "w-6 h-6 rounded flex items-center justify-center text-xs",
                  feature.included
                    ? "bg-green-500/30 text-green-400"
                    : "bg-red-500/30 text-red-400",
                )}
              >
                {feature.included ? "✓" : "✗"}
              </button>
              <input
                type="text"
                value={feature.text}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 px-2 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={() => removeFeature(index)}
                className="text-red-400 hover:text-red-300 text-xs px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          checked={content.popular}
          onChange={(e) => onChange({ ...content, popular: e.target.checked })}
          className="rounded bg-white/10 border-white/20"
        />
        Show "Popular" Badge
      </label>
    </div>
  );
}

function FeatureContentEditor({
  content,
  onChange,
}: {
  content: FeatureCardContent;
  onChange: (content: FeatureCardContent) => void;
}) {
  const iconOptions = [
    { id: "star", label: "⭐ Star" },
    { id: "lightning", label: "⚡ Lightning" },
    { id: "shield", label: "🛡️ Shield" },
    { id: "chart", label: "📈 Chart" },
    { id: "globe", label: "🌐 Globe" },
    { id: "lock", label: "🔒 Lock" },
    { id: "rocket", label: "🚀 Rocket" },
    { id: "heart", label: "❤️ Heart" },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs text-white/60">Icon</label>
        <div className="grid grid-cols-4 gap-2">
          {iconOptions.map((icon) => (
            <button
              key={icon.id}
              onClick={() => onChange({ ...content, icon: icon.id as any })}
              className={cn(
                "px-2 py-2 rounded-md text-xs text-center transition-all",
                content.icon === icon.id
                  ? "bg-cyan-500/30 text-cyan-400 border border-cyan-500/50"
                  : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/15",
              )}
            >
              {icon.label}
            </button>
          ))}
        </div>
      </div>

      <InputField
        label="Title"
        value={content.title}
        onChange={(v) => onChange({ ...content, title: v })}
        placeholder="Feature name"
      />

      <TextareaField
        label="Description"
        value={content.description}
        onChange={(v) => onChange({ ...content, description: v })}
        placeholder="Describe this feature..."
      />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Badge Text"
          value={content.badge || ""}
          onChange={(v) => onChange({ ...content, badge: v || undefined })}
          placeholder="NEW"
        />
        <div className="space-y-1">
          <label className="text-xs text-white/60">Badge Color</label>
          <div className="flex gap-1">
            {["cyan", "green", "purple", "orange", "pink"].map((color) => (
              <button
                key={color}
                onClick={() =>
                  onChange({ ...content, badgeColor: color as any })
                }
                className={cn(
                  "w-7 h-7 rounded-full border-2 transition-all",
                  content.badgeColor === color
                    ? "border-white scale-110"
                    : "border-transparent",
                  color === "cyan" && "bg-cyan-500",
                  color === "green" && "bg-green-500",
                  color === "purple" && "bg-purple-500",
                  color === "orange" && "bg-orange-500",
                  color === "pink" && "bg-pink-500",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <InputField
        label="Link URL (optional)"
        value={(content as any).linkUrl || ""}
        onChange={(v) =>
          onChange({ ...content, linkUrl: v || undefined } as any)
        }
        placeholder="https://example.com"
      />
    </div>
  );
}

function TestimonialContentEditor({
  content,
  onChange,
}: {
  content: TestimonialCardContent;
  onChange: (content: TestimonialCardContent) => void;
}) {
  return (
    <div className="space-y-4">
      <TextareaField
        label="Quote"
        value={content.quote}
        onChange={(v) => onChange({ ...content, quote: v })}
        placeholder="What did they say?"
      />

      <InputField
        label="Author Name"
        value={content.author}
        onChange={(v) => onChange({ ...content, author: v })}
        placeholder="John Doe"
      />

      <InputField
        label="Avatar URL (optional)"
        value={(content as any).avatarUrl || ""}
        onChange={(v) =>
          onChange({ ...content, avatarUrl: v || undefined } as any)
        }
        placeholder="https://example.com/avatar.jpg"
      />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Role/Position"
          value={content.role}
          onChange={(v) => onChange({ ...content, role: v })}
          placeholder="CEO"
        />
        <InputField
          label="Company"
          value={content.company}
          onChange={(v) => onChange({ ...content, company: v })}
          placeholder="Acme Inc"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-white/60">
          Rating ({content.rating}/5 stars)
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onChange({ ...content, rating: star })}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all hover:scale-110",
                star <= content.rating
                  ? "bg-yellow-500/30 text-yellow-400 border border-yellow-500/50"
                  : "bg-white/10 text-white/30 border border-white/20",
              )}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          checked={(content as any).verified || false}
          onChange={(e) =>
            onChange({ ...content, verified: e.target.checked } as any)
          }
          className="rounded bg-white/10 border-white/20"
        />
        Show "Verified" Badge
      </label>
    </div>
  );
}

// Reusable form components
function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-white/60">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-500/50 placeholder:text-white/30"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-white/60">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-500/50 resize-none placeholder:text-white/30"
      />
    </div>
  );
}
