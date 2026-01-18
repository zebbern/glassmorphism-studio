// Types for Glassmorphism Tool

export interface GlassSettings {
  blur: number;
  refraction: number;
  depth: number;
  borderRadius: number;
  borderOpacity: number;
}

export interface ColorSettings {
  opacity: number;
  saturation: number;
  brightness: number;
}

export interface GradientSettings {
  enabled: boolean;
  startColor: string;
  endColor: string;
  direction: number;
  type: "linear" | "radial";
  intensity: number;
}

export interface BackgroundSettings {
  imageUrl: string;
  opacity: number;
  blur: number;
  customUrl: string;
}

export interface GlassPreset {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  thumbnail?: string;
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
  tags: string[];
  isCustom?: boolean;
  createdAt?: string;
}

export type PresetCategory =
  | "minimal"
  | "vibrant"
  | "dark"
  | "pastel"
  | "gradient"
  | "custom";

export interface SavedConfiguration {
  id: string;
  name: string;
  description?: string;
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
  createdAt: string;
  updatedAt: string;
}

export type ExportFormat = "css" | "tailwind" | "css-in-js" | "scss";

export interface ExportOptions {
  format: ExportFormat;
  includeComments: boolean;
  includeVariables: boolean;
  componentName?: string;
}

export type ComponentType = "card" | "button" | "modal" | "navbar" | "input";

export interface GlassComponentConfig {
  type: ComponentType;
  name: string;
  description: string;
  icon: string;
  defaultSize: {
    width: string;
    height: string;
  };
}

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

// URL encoding types
export interface EncodedSettings {
  s: GlassSettings; // settings
  c: ColorSettings; // colorSettings
  g: GradientSettings; // gradientSettings
  i: string; // inputColor
}

// ============================================
// PHASE 2: Animation, Light, Theme & Cards
// ============================================

// Animation Types
export type AnimationType =
  | "none"
  | "hover-glow"
  | "pulse"
  | "shimmer"
  | "float"
  | "breathe"
  | "rotate-border";

export type EasingType =
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "linear"
  | "spring";

export interface AnimationSettings {
  type: AnimationType;
  duration: number; // 0.1 - 3 seconds
  easing: EasingType;
  intensity: number; // 0 - 100
  enabled: boolean;
  delay: number; // 0 - 2 seconds
  iterationCount: "infinite" | number;
}

// Light Source Types
export interface LightPosition {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

export interface LightSource {
  position: LightPosition;
  color: string;
  intensity: number; // 0-100
  radius: number; // spread radius 0-200
  enabled: boolean;
}

// Theme Types
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeSettings {
  mode: ThemeMode;
  darkBackground: string;
  lightBackground: string;
  accentColor: string;
}

// Card Template Types
export type CardFieldType =
  | "text"
  | "image"
  | "icon"
  | "list"
  | "price"
  | "rating"
  | "badge";

export interface CardField {
  id: string;
  name: string;
  type: CardFieldType;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
}

export type CardTemplateId = "profile" | "pricing" | "feature" | "testimonial";

export interface CardTemplate {
  id: CardTemplateId;
  name: string;
  description: string;
  icon: string;
  fields: CardField[];
  defaultLayout: CardLayout;
}

export interface CardLayout {
  padding: number;
  gap: number;
  alignment: "left" | "center" | "right";
  direction: "vertical" | "horizontal";
  maxWidth: string;
}

export interface CardContent {
  [fieldId: string]: string | string[] | number;
}

export interface GeneratedCard {
  templateId: CardTemplateId;
  content: CardContent;
  layout: CardLayout;
  glassSettings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  animationSettings?: AnimationSettings;
  lightSource?: LightSource;
}

// Extended export options for new features
export interface ExtendedExportOptions extends ExportOptions {
  includeAnimations: boolean;
  includeLightEffects: boolean;
  exportAsComponent: boolean;
  framework?: "react" | "vue" | "svelte" | "html";
}

// ============================================
// LAYOUT BUILDER TYPES
// ============================================

export type LayoutPresetId =
  | "grid-2x2"
  | "row-3"
  | "masonry"
  | "dashboard"
  | "landing-hero"
  | "sidebar-main"
  | "custom";

export type ComponentTemplateId =
  | "profile"
  | "pricing"
  | "feature"
  | "testimonial"
  | "login-form"
  | "stats-widget"
  | "chart-widget"
  | "notification-toast"
  | "sidebar-nav"
  | "music-player"
  | "hero-section"
  | "footer-section"
  | "nav-bar"
  | "data-table"
  | "image-gallery"
  | "contact-form"
  | "empty";

export interface GridCell {
  id: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  componentId?: ComponentTemplateId;
  content?: Record<string, unknown>;
  glassSettings?: GlassSettings;
}

export interface GridLayout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  gap: number;
  cells: GridCell[];
}

export interface LayoutPreset {
  id: LayoutPresetId;
  name: string;
  description: string;
  icon: string;
  thumbnail?: string;
  layout: GridLayout;
}

export interface DragItem {
  type: "template" | "cell";
  templateId?: ComponentTemplateId;
  cellId?: string;
}

export interface DropZone {
  row: number;
  col: number;
  rowSpan?: number;
  colSpan?: number;
}

// Template metadata for the template picker
export interface TemplateInfo {
  id: ComponentTemplateId;
  name: string;
  description: string;
  icon: string;
  category: "cards" | "forms" | "widgets" | "navigation" | "media";
  defaultContent: Record<string, unknown>;
}
