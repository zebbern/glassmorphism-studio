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
      cols: 12,
      gap: 16,
      cells: [
        { id: generateId(), row: 0, col: 0, rowSpan: 1, colSpan: 6 },
        { id: generateId(), row: 0, col: 6, rowSpan: 1, colSpan: 6 },
        { id: generateId(), row: 1, col: 0, rowSpan: 1, colSpan: 6 },
        { id: generateId(), row: 1, col: 6, rowSpan: 1, colSpan: 6 },
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
      cols: 12,
      gap: 16,
      cells: [
        { id: generateId(), row: 0, col: 0, rowSpan: 1, colSpan: 4 },
        { id: generateId(), row: 0, col: 4, rowSpan: 1, colSpan: 4 },
        { id: generateId(), row: 0, col: 8, rowSpan: 1, colSpan: 4 },
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
      cols: 12,
      gap: 16,
      cells: [
        { id: generateId(), row: 0, col: 0, rowSpan: 2, colSpan: 4 },
        { id: generateId(), row: 0, col: 4, rowSpan: 1, colSpan: 4 },
        { id: generateId(), row: 0, col: 8, rowSpan: 1, colSpan: 4 },
        { id: generateId(), row: 1, col: 4, rowSpan: 2, colSpan: 4 },
        { id: generateId(), row: 1, col: 8, rowSpan: 1, colSpan: 4 },
        { id: generateId(), row: 2, col: 0, rowSpan: 1, colSpan: 4 },
        { id: generateId(), row: 2, col: 8, rowSpan: 1, colSpan: 4 },
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
      cols: 12,
      gap: 16,
      cells: [
        // Top row - 4 stat widgets (4 cols, 3 units each)
        { id: generateId(), row: 0, col: 0, rowSpan: 1, colSpan: 3 },
        { id: generateId(), row: 0, col: 3, rowSpan: 1, colSpan: 3 },
        { id: generateId(), row: 0, col: 6, rowSpan: 1, colSpan: 3 },
        { id: generateId(), row: 0, col: 9, rowSpan: 1, colSpan: 3 },
        // Main content - large chart (col 0-9)
        { id: generateId(), row: 1, col: 0, rowSpan: 2, colSpan: 9 },
        // Sidebar widgets
        { id: generateId(), row: 1, col: 9, rowSpan: 1, colSpan: 3 },
        { id: generateId(), row: 2, col: 9, rowSpan: 1, colSpan: 3 },
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
      cols: 12,
      gap: 24,
      cells: [
        // Hero - full width top
        { id: generateId(), row: 0, col: 0, rowSpan: 1, colSpan: 12 },
        // Feature cards below (3 cols, 4 units each)
        { id: generateId(), row: 1, col: 0, rowSpan: 1, colSpan: 4 },
        { id: generateId(), row: 1, col: 4, rowSpan: 1, colSpan: 4 },
        { id: generateId(), row: 1, col: 8, rowSpan: 1, colSpan: 4 },
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
      cols: 12,
      gap: 16,
      cells: [
        // Sidebar - spans full height (col 0, 3 units)
        { id: generateId(), row: 0, col: 0, rowSpan: 2, colSpan: 3 },
        // Main content area (col 3, 9 units)
        { id: generateId(), row: 0, col: 3, rowSpan: 1, colSpan: 9 },
        // Bottom content
        { id: generateId(), row: 1, col: 3, rowSpan: 1, colSpan: 6 },
        { id: generateId(), row: 1, col: 9, rowSpan: 1, colSpan: 3 },
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

  // Layout category - NEW
  {
    id: "hero-section",
    name: "Hero Section",
    description: "Landing page hero with CTA",
    icon: "🚀",
    category: "layout",
    defaultContent: {
      title: "Build Something Amazing",
      subtitle: "The Next Generation Platform",
      description:
        "Create stunning applications with our powerful tools and beautiful components.",
      primaryButtonText: "Get Started",
      secondaryButtonText: "Watch Demo",
      showRating: true,
      ratingCount: 2500,
      ratingValue: "4.9",
    },
  },
  {
    id: "footer-section",
    name: "Footer",
    description: "Site footer with links",
    icon: "📋",
    category: "layout",
    defaultContent: {
      companyName: "GlassUI",
      tagline: "Beautiful glassmorphic components",
      copyright: "© 2024 All rights reserved",
      showSocial: true,
      showLinks: true,
    },
  },
  {
    id: "nav-bar",
    name: "Navigation Bar",
    description: "Top navigation with search",
    icon: "🧭",
    category: "navigation",
    defaultContent: {
      logo: "GlassUI",
      showSearch: true,
      showNotifications: true,
      showProfile: true,
      menuItems: ["Home", "Features", "Pricing", "About"],
    },
  },
  {
    id: "data-table",
    name: "Data Table",
    description: "Sortable data table",
    icon: "📊",
    category: "widgets",
    defaultContent: {
      title: "Users",
      showSearch: true,
      showFilter: true,
      columns: ["Name", "Email", "Status", "Role"],
    },
  },
  {
    id: "image-gallery",
    name: "Image Gallery",
    description: "Grid gallery with actions",
    icon: "🖼️",
    category: "media",
    defaultContent: {
      title: "Gallery",
      showViewToggle: true,
      columns: 3,
    },
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Contact form with info",
    icon: "✉️",
    category: "forms",
    defaultContent: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you!",
      showContactInfo: true,
      buttonText: "Send Message",
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
  return ["cards", "forms", "widgets", "navigation", "media", "layout"];
}
