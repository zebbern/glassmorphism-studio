import {
  LayoutPreset,
  GridLayout,
  TemplateInfo,
  ComponentTemplateId,
} from "@/types/glassmorphic";

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// ============================================
// LAYOUT PRESETS
// ============================================

export const layoutPresets: LayoutPreset[] = [
  {
    id: "grid-2x2",
    name: "2×2 Grid",
    description: "Simple 2x2 grid layout for balanced content",
    icon: "⊞",
    layout: {
      id: generateId(),
      name: "2×2 Grid",
      rows: 2,
      cols: 2,
      gap: 16,
      cells: [
        { id: generateId(), row: 0, col: 0, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 0, col: 1, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 1, col: 0, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 1, col: 1, rowSpan: 1, colSpan: 1 },
      ],
    },
  },
  {
    id: "row-3",
    name: "3-Column Row",
    description: "Three equal columns in a single row",
    icon: "☰",
    layout: {
      id: generateId(),
      name: "3-Column Row",
      rows: 1,
      cols: 3,
      gap: 16,
      cells: [
        { id: generateId(), row: 0, col: 0, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 0, col: 1, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 0, col: 2, rowSpan: 1, colSpan: 1 },
      ],
    },
  },
  {
    id: "masonry",
    name: "Masonry",
    description: "Pinterest-style staggered layout",
    icon: "▤",
    layout: {
      id: generateId(),
      name: "Masonry",
      rows: 3,
      cols: 3,
      gap: 16,
      cells: [
        { id: generateId(), row: 0, col: 0, rowSpan: 2, colSpan: 1 },
        { id: generateId(), row: 0, col: 1, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 0, col: 2, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 1, col: 1, rowSpan: 2, colSpan: 1 },
        { id: generateId(), row: 1, col: 2, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 2, col: 0, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 2, col: 2, rowSpan: 1, colSpan: 1 },
      ],
    },
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Stats header with content grid below",
    icon: "📊",
    layout: {
      id: generateId(),
      name: "Dashboard",
      rows: 3,
      cols: 4,
      gap: 16,
      cells: [
        // Top row - 4 stat widgets
        { id: generateId(), row: 0, col: 0, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 0, col: 1, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 0, col: 2, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 0, col: 3, rowSpan: 1, colSpan: 1 },
        // Main content - large chart
        { id: generateId(), row: 1, col: 0, rowSpan: 2, colSpan: 3 },
        // Sidebar widgets
        { id: generateId(), row: 1, col: 3, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 2, col: 3, rowSpan: 1, colSpan: 1 },
      ],
    },
  },
  {
    id: "landing-hero",
    name: "Landing Hero",
    description: "Hero section with feature cards",
    icon: "🚀",
    layout: {
      id: generateId(),
      name: "Landing Hero",
      rows: 2,
      cols: 3,
      gap: 24,
      cells: [
        // Hero - full width top
        { id: generateId(), row: 0, col: 0, rowSpan: 1, colSpan: 3 },
        // Feature cards below
        { id: generateId(), row: 1, col: 0, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 1, col: 1, rowSpan: 1, colSpan: 1 },
        { id: generateId(), row: 1, col: 2, rowSpan: 1, colSpan: 1 },
      ],
    },
  },
  {
    id: "sidebar-main",
    name: "Sidebar + Main",
    description: "Sidebar navigation with main content area",
    icon: "◧",
    layout: {
      id: generateId(),
      name: "Sidebar + Main",
      rows: 2,
      cols: 4,
      gap: 16,
      cells: [
        // Sidebar - spans full height
        { id: generateId(), row: 0, col: 0, rowSpan: 2, colSpan: 1 },
        // Main content area
        { id: generateId(), row: 0, col: 1, rowSpan: 1, colSpan: 3 },
        // Bottom content
        { id: generateId(), row: 1, col: 1, rowSpan: 1, colSpan: 2 },
        { id: generateId(), row: 1, col: 3, rowSpan: 1, colSpan: 1 },
      ],
    },
  },
];

// Get default layout
export function getDefaultLayout(): GridLayout {
  return layoutPresets[0].layout;
}

// ============================================
// TEMPLATE INFO
// ============================================

export const templateInfo: TemplateInfo[] = [
  // Cards category
  {
    id: "profile",
    name: "Profile Card",
    description: "User profile with avatar and bio",
    icon: "👤",
    category: "cards",
    defaultContent: {
      name: "John Doe",
      title: "Software Engineer",
      bio: "Building amazing experiences",
      email: "john@example.com",
    },
  },
  {
    id: "pricing",
    name: "Pricing Card",
    description: "Subscription plan with features",
    icon: "💳",
    category: "cards",
    defaultContent: {
      planName: "Pro",
      price: "$29",
      period: "/month",
      features: [
        { text: "Unlimited projects", included: true },
        { text: "Priority support", included: true },
        { text: "Custom domain", included: true },
      ],
    },
  },
  {
    id: "feature",
    name: "Feature Card",
    description: "Highlight a feature with icon",
    icon: "⚡",
    category: "cards",
    defaultContent: {
      icon: "zap",
      title: "Lightning Fast",
      description: "Blazing performance",
      badge: "New",
    },
  },
  {
    id: "testimonial",
    name: "Testimonial",
    description: "Customer quote with rating",
    icon: "💬",
    category: "cards",
    defaultContent: {
      quote: "Amazing product!",
      author: "Jane Smith",
      role: "CEO",
      company: "TechCorp",
      rating: 5,
    },
  },

  // Forms category
  {
    id: "login-form",
    name: "Login Form",
    description: "Email and password login",
    icon: "🔐",
    category: "forms",
    defaultContent: {
      title: "Welcome Back",
      subtitle: "Sign in to your account",
      showSocial: true,
      showRemember: true,
    },
  },

  // Widgets category
  {
    id: "stats-widget",
    name: "Stats Widget",
    description: "Number with trend indicator",
    icon: "📈",
    category: "widgets",
    defaultContent: {
      label: "Total Users",
      value: "12,345",
      trend: "+12%",
      trendUp: true,
    },
  },
  {
    id: "chart-widget",
    name: "Chart Widget",
    description: "Mini chart visualization",
    icon: "📊",
    category: "widgets",
    defaultContent: {
      title: "Revenue",
      chartType: "line",
      data: [30, 45, 35, 55, 40, 60, 50],
    },
  },
  {
    id: "notification-toast",
    name: "Notification",
    description: "Toast notification message",
    icon: "🔔",
    category: "widgets",
    defaultContent: {
      type: "success",
      title: "Success!",
      message: "Your changes have been saved.",
      showIcon: true,
    },
  },

  // Navigation category
  {
    id: "sidebar-nav",
    name: "Sidebar Nav",
    description: "Vertical navigation menu",
    icon: "📑",
    category: "navigation",
    defaultContent: {
      items: [
        { icon: "home", label: "Dashboard", active: true },
        { icon: "chart", label: "Analytics", badge: "3" },
        { icon: "settings", label: "Settings" },
      ],
    },
  },

  // Media category
  {
    id: "music-player",
    name: "Music Player",
    description: "Audio player card",
    icon: "🎵",
    category: "media",
    defaultContent: {
      title: "Blinding Lights",
      artist: "The Weeknd",
      albumArt: "",
      progress: 45,
      duration: "3:20",
    },
  },

  // Empty placeholder
  {
    id: "empty",
    name: "Empty",
    description: "Empty placeholder cell",
    icon: "⬜",
    category: "cards",
    defaultContent: {},
  },
];

// Get template by ID
export function getTemplateInfo(
  id: ComponentTemplateId,
): TemplateInfo | undefined {
  return templateInfo.find((t) => t.id === id);
}

// Get templates by category
export function getTemplatesByCategory(
  category: TemplateInfo["category"],
): TemplateInfo[] {
  return templateInfo.filter((t) => t.category === category);
}

// Get all categories
export function getTemplateCategories(): TemplateInfo["category"][] {
  return ["cards", "forms", "widgets", "navigation", "media"];
}
