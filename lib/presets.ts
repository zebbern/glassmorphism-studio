import type { GlassPreset } from "@/types/glassmorphic";

export const defaultPresets: GlassPreset[] = [
  {
    id: "frosted-ice",
    name: "Frosted Ice",
    description: "Clean, minimal white glass effect with subtle blur",
    category: "minimal",
    settings: {
      blur: 25,
      refraction: 0.12,
      depth: 8,
      borderRadius: 16,
      borderOpacity: 0.4,
    },
    colorSettings: {
      opacity: 0.08,
      saturation: 0.5,
      brightness: 1.2,
    },
    gradientSettings: {
      enabled: false,
      startColor: "#FFFFFF",
      endColor: "#F0F0F0",
      direction: 145,
      type: "linear",
      intensity: 1.0,
    },
    inputColor: "#FFFFFF",
    tags: ["minimal", "clean", "white", "professional"],
  },
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    description: "Deep purple gradient with mysterious depth",
    category: "gradient",
    settings: {
      blur: 30,
      refraction: 0.18,
      depth: 15,
      borderRadius: 24,
      borderOpacity: 0.25,
    },
    colorSettings: {
      opacity: 0.2,
      saturation: 1.2,
      brightness: 0.9,
    },
    gradientSettings: {
      enabled: true,
      startColor: "#7C3AED",
      endColor: "#3B0764",
      direction: 135,
      type: "linear",
      intensity: 1.2,
    },
    inputColor: "#7C3AED",
    tags: ["dark", "purple", "gradient", "mysterious"],
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    description: "Warm orange to pink gradient reminiscent of sunset",
    category: "vibrant",
    settings: {
      blur: 22,
      refraction: 0.16,
      depth: 12,
      borderRadius: 20,
      borderOpacity: 0.35,
    },
    colorSettings: {
      opacity: 0.18,
      saturation: 1.3,
      brightness: 1.1,
    },
    gradientSettings: {
      enabled: true,
      startColor: "#F97316",
      endColor: "#EC4899",
      direction: 45,
      type: "linear",
      intensity: 1.1,
    },
    inputColor: "#F97316",
    tags: ["warm", "orange", "pink", "vibrant", "sunset"],
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Calming blue-teal gradient like ocean waves",
    category: "vibrant",
    settings: {
      blur: 28,
      refraction: 0.14,
      depth: 10,
      borderRadius: 18,
      borderOpacity: 0.3,
    },
    colorSettings: {
      opacity: 0.15,
      saturation: 1.1,
      brightness: 1.0,
    },
    gradientSettings: {
      enabled: true,
      startColor: "#0EA5E9",
      endColor: "#14B8A6",
      direction: 180,
      type: "linear",
      intensity: 1.0,
    },
    inputColor: "#0EA5E9",
    tags: ["blue", "teal", "ocean", "calm", "professional"],
  },
  {
    id: "forest-mist",
    name: "Forest Mist",
    description: "Natural green tones with earthy depth",
    category: "minimal",
    settings: {
      blur: 24,
      refraction: 0.13,
      depth: 9,
      borderRadius: 14,
      borderOpacity: 0.28,
    },
    colorSettings: {
      opacity: 0.12,
      saturation: 0.9,
      brightness: 1.05,
    },
    gradientSettings: {
      enabled: true,
      startColor: "#22C55E",
      endColor: "#15803D",
      direction: 160,
      type: "linear",
      intensity: 0.9,
    },
    inputColor: "#22C55E",
    tags: ["green", "nature", "forest", "earthy", "calm"],
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    description: "Elegant pink-gold gradient with luxurious feel",
    category: "pastel",
    settings: {
      blur: 26,
      refraction: 0.15,
      depth: 11,
      borderRadius: 22,
      borderOpacity: 0.38,
    },
    colorSettings: {
      opacity: 0.16,
      saturation: 1.0,
      brightness: 1.15,
    },
    gradientSettings: {
      enabled: true,
      startColor: "#FDA4AF",
      endColor: "#FBBF24",
      direction: 120,
      type: "linear",
      intensity: 0.85,
    },
    inputColor: "#FDA4AF",
    tags: ["pink", "gold", "elegant", "luxury", "pastel"],
  },
  {
    id: "arctic-aurora",
    name: "Arctic Aurora",
    description: "Magical cyan-purple northern lights effect",
    category: "vibrant",
    settings: {
      blur: 32,
      refraction: 0.2,
      depth: 14,
      borderRadius: 26,
      borderOpacity: 0.32,
    },
    colorSettings: {
      opacity: 0.22,
      saturation: 1.4,
      brightness: 1.0,
    },
    gradientSettings: {
      enabled: true,
      startColor: "#06B6D4",
      endColor: "#A855F7",
      direction: 135,
      type: "linear",
      intensity: 1.3,
    },
    inputColor: "#06B6D4",
    tags: ["cyan", "purple", "aurora", "magical", "vibrant"],
  },
  {
    id: "smoke-mirrors",
    name: "Smoke & Mirrors",
    description: "Dark sophisticated grey with subtle depth",
    category: "dark",
    settings: {
      blur: 20,
      refraction: 0.1,
      depth: 6,
      borderRadius: 12,
      borderOpacity: 0.2,
    },
    colorSettings: {
      opacity: 0.25,
      saturation: 0.3,
      brightness: 0.7,
    },
    gradientSettings: {
      enabled: false,
      startColor: "#374151",
      endColor: "#1F2937",
      direction: 180,
      type: "linear",
      intensity: 1.0,
    },
    inputColor: "#374151",
    tags: ["dark", "grey", "sophisticated", "professional", "minimal"],
  },
  {
    id: "cotton-candy",
    name: "Cotton Candy",
    description: "Playful pastel pink and blue swirl",
    category: "pastel",
    settings: {
      blur: 28,
      refraction: 0.17,
      depth: 13,
      borderRadius: 28,
      borderOpacity: 0.4,
    },
    colorSettings: {
      opacity: 0.14,
      saturation: 0.8,
      brightness: 1.2,
    },
    gradientSettings: {
      enabled: true,
      startColor: "#F9A8D4",
      endColor: "#93C5FD",
      direction: 90,
      type: "linear",
      intensity: 0.9,
    },
    inputColor: "#F9A8D4",
    tags: ["pastel", "pink", "blue", "playful", "soft"],
  },
  {
    id: "ember-glow",
    name: "Ember Glow",
    description: "Warm fiery red-orange with intense energy",
    category: "vibrant",
    settings: {
      blur: 24,
      refraction: 0.19,
      depth: 12,
      borderRadius: 20,
      borderOpacity: 0.28,
    },
    colorSettings: {
      opacity: 0.2,
      saturation: 1.35,
      brightness: 1.05,
    },
    gradientSettings: {
      enabled: true,
      startColor: "#EF4444",
      endColor: "#F97316",
      direction: 45,
      type: "radial",
      intensity: 1.2,
    },
    inputColor: "#EF4444",
    tags: ["red", "orange", "fire", "warm", "intense"],
  },
];

export const presetCategories = [
  { id: "all", name: "All Presets", icon: "Sparkles" },
  { id: "minimal", name: "Minimal", icon: "Minus" },
  { id: "vibrant", name: "Vibrant", icon: "Zap" },
  { id: "dark", name: "Dark", icon: "Moon" },
  { id: "pastel", name: "Pastel", icon: "Palette" },
  { id: "gradient", name: "Gradient", icon: "Blend" },
  { id: "custom", name: "My Presets", icon: "Heart" },
] as const;

export function getPresetsByCategory(
  category: string,
  customPresets: GlassPreset[] = [],
): GlassPreset[] {
  const allPresets = [...defaultPresets, ...customPresets];

  if (category === "all") {
    return allPresets;
  }

  if (category === "custom") {
    return customPresets;
  }

  return allPresets.filter((preset) => preset.category === category);
}

export function searchPresets(
  query: string,
  presets: GlassPreset[],
): GlassPreset[] {
  const lowerQuery = query.toLowerCase();

  return presets.filter(
    (preset) =>
      preset.name.toLowerCase().includes(lowerQuery) ||
      preset.description.toLowerCase().includes(lowerQuery) ||
      preset.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}
