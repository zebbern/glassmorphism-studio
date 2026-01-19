"use client";

import React, { useState } from "react";
import {
  X,
  Layout,
  Sparkles,
  Store,
  FileText,
  Briefcase,
  CreditCard,
} from "lucide-react";
import {
  GridLayout,
  GridCell,
  ComponentTemplateId,
} from "@/types/glassmorphic";
import { cn } from "@/lib/utils";

// Pre-made page layout templates
export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "marketing" | "app" | "portfolio" | "content";
  preview: string; // Emoji preview or thumbnail
  layout: GridLayout;
}

// Helper to create cells
const createCell = (
  id: string,
  row: number,
  col: number,
  rowSpan: number,
  colSpan: number,
  componentId?: ComponentTemplateId,
  content?: Record<string, unknown>,
): GridCell => ({
  id,
  row,
  col,
  rowSpan,
  colSpan,
  componentId,
  content,
});

export const pageTemplates: PageTemplate[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    description: "Hero section with features, testimonials, and CTA",
    icon: <Sparkles className="w-5 h-5" />,
    category: "marketing",
    preview: "",
    layout: {
      id: "landing-page",
      name: "Landing Page",
      rows: 26,
      cols: 4,
      gap: 16,
      cells: [
        // Header/Navigation
        createCell("header", 0, 0, 2, 4, "nav-bar", {
          logo: "Glassmorphic",
          links: [
            { label: "Home", href: "#", active: true },
            { label: "Features", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "Contact", href: "#" },
          ],
          showSearch: false,
          showNotifications: false,
        }),
        // Hero Section
        createCell("hero", 2, 0, 8, 4, "hero-section", {
          title: "Build Beautiful Apps",
          subtitle:
            "Create stunning glassmorphic interfaces with our drag-and-drop builder",
          primaryCta: "Get Started",
          secondaryCta: "Learn More",
          rating: 4.9,
          reviews: 2500,
        }),
        // Features Row
        createCell("feature-1", 10, 0, 6, 1, "feature", {
          title: "Easy to Use",
          description: "Intuitive drag-and-drop interface",
          iconType: "zap",
        }),
        createCell("feature-2", 10, 1, 6, 1, "feature", {
          title: "Customizable",
          description: "Endless styling options",
          iconType: "palette",
        }),
        createCell("feature-3", 10, 2, 6, 1, "feature", {
          title: "Responsive",
          description: "Works on all devices",
          iconType: "smartphone",
        }),
        createCell("feature-4", 10, 3, 6, 1, "feature", {
          title: "Fast",
          description: "Optimized performance",
          iconType: "rocket",
        }),
        // Testimonial + Stats Row
        createCell("testimonial-1", 16, 0, 6, 3, "testimonial", {
          quote:
            "This tool has completely transformed how we build interfaces!",
          author: "Jane Cooper",
          role: "Design Lead",
          avatar: "https://i.pravatar.cc/150?img=1",
          rating: 5,
        }),
        createCell("stats", 16, 3, 4, 1, "stats-widget", {
          title: "Active Users",
          value: "50K+",
          change: 12.5,
          trend: "up",
          period: "this month",
        }),
        // Footer
        createCell("footer", 22, 0, 4, 4, "footer-section", {
          companyName: "Glassmorphic Studio",
          tagline: "Design beautiful interfaces",
          links: [
            { label: "Home", href: "#" },
            { label: "Features", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "Contact", href: "#" },
          ],
          socialLinks: [
            { platform: "twitter", href: "#" },
            { platform: "github", href: "#" },
            { platform: "linkedin", href: "#" },
          ],
        }),
      ],
    },
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Admin dashboard with stats, charts, and data table",
    icon: <Layout className="w-5 h-5" />,
    category: "app",
    preview: "",
    layout: {
      id: "dashboard",
      name: "Dashboard",
      rows: 17,
      cols: 5,
      gap: 16,
      cells: [
        // Sidebar Navigation (Full Height)
        createCell("nav", 0, 0, 17, 1, "sidebar-nav", {
          title: "Dashboard",
          items: [
            { iconType: "layout", label: "Overview", active: true },
            { iconType: "chart", label: "Analytics" },
            { iconType: "users", label: "Users" },
            { iconType: "settings", label: "Settings" },
          ],
          user: { name: "Admin", role: "Administrator", avatar: "" },
        }),
        // Top Stats Row (180px)
        createCell("stat-1", 0, 1, 3, 1, "stats-widget", {
          title: "Total Revenue",
          value: "$124,500",
          change: 15.3,
          trend: "up",
          period: "vs last month",
        }),
        createCell("stat-2", 0, 2, 3, 1, "stats-widget", {
          title: "Active Users",
          value: "8,420",
          change: 8.1,
          trend: "up",
          period: "vs last month",
        }),
        createCell("stat-3", 0, 3, 3, 1, "stats-widget", {
          title: "Conversion Rate",
          value: "3.2%",
          change: -2.4,
          trend: "down",
          period: "vs last month",
        }),
        createCell("stat-4", 0, 4, 3, 1, "stats-widget", {
          title: "Orders",
          value: "1,248",
          change: 5.7,
          trend: "up",
          period: "vs last month",
        }),
        // Chart + Notifications (480px)
        createCell("chart", 3, 1, 8, 3, "chart-widget", {
          title: "Revenue Overview",
          type: "line",
          data: [30, 45, 35, 50, 49, 60, 70, 91, 85],
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
          ],
          color: "#06b6d4",
        }),
        createCell("notifications", 3, 4, 8, 1, "notification-toast", {
          title: "Notifications",
          items: [
            {
              title: "New Order",
              message: "Order #1234 received",
              type: "success",
              time: "Just now",
            },
            {
              title: "Payment",
              message: "Payment processed",
              type: "info",
              time: "5m ago",
            },
            {
              title: "Warning",
              message: "Low inventory",
              type: "warning",
              time: "1h ago",
            },
          ],
        }),
        // Data Table (360px)
        createCell("table", 11, 1, 6, 4, "data-table", {
          title: "Recent Orders",
          columns: ["Order ID", "Customer", "Amount", "Status"],
          rows: [
            ["#1234", "John Doe", "$150.00", "Completed"],
            ["#1235", "Jane Smith", "$89.00", "Pending"],
            ["#1236", "Bob Wilson", "$234.00", "Processing"],
          ],
        }),
      ],
    },
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Personal portfolio with hero, gallery, and contact",
    icon: <Briefcase className="w-5 h-5" />,
    category: "portfolio",
    preview: "",
    layout: {
      id: "portfolio",
      name: "Portfolio",
      rows: 26,
      cols: 4,
      gap: 16,
      cells: [
        // Navigation Header
        createCell("header", 0, 0, 2, 4, "nav-bar", {
          logo: "Alex.Design",
          links: [
            { label: "Home", href: "#", active: true },
            { label: "Work", href: "#" },
            { label: "About", href: "#" },
            { label: "Contact", href: "#" },
          ],
          showSearch: false,
          showNotifications: false,
        }),
        // Profile + Hero (480px)
        createCell("profile", 2, 0, 8, 1, "profile", {
          name: "Alex Designer",
          role: "UI/UX Designer",
          avatar: "https://i.pravatar.cc/150?img=3",
          bio: "Creating beautiful digital experiences",
          stats: { projects: 45, clients: 32, awards: 8 },
        }),
        createCell("hero", 2, 1, 8, 3, "hero-section", {
          title: "Creative Designer",
          subtitle:
            "I craft beautiful digital experiences that inspire and engage",
          primaryCta: "View Work",
          secondaryCta: "Contact Me",
        }),
        // Gallery Row (600px + testimonial 360px)
        createCell("gallery", 10, 0, 10, 3, "image-gallery", {
          title: "Recent Projects",
          images: [
            {
              src: "https://picsum.photos/400/300?random=1",
              alt: "Project 1",
              caption: "Mobile App Design",
            },
            {
              src: "https://picsum.photos/400/300?random=2",
              alt: "Project 2",
              caption: "Web Dashboard",
            },
            {
              src: "https://picsum.photos/400/300?random=3",
              alt: "Project 3",
              caption: "Brand Identity",
            },
            {
              src: "https://picsum.photos/400/300?random=4",
              alt: "Project 4",
              caption: "E-commerce",
            },
          ],
          layout: "grid",
        }),
        createCell("testimonial", 10, 3, 6, 1, "testimonial", {
          quote:
            "Alex delivered exceptional work that exceeded our expectations!",
          author: "Sarah Johnson",
          role: "CEO, TechCorp",
          avatar: "https://i.pravatar.cc/150?img=5",
          rating: 5,
        }),
        // Contact + Footer
        createCell("contact", 20, 0, 6, 3, "contact-form", {
          title: "Get in Touch",
          fields: ["name", "email", "message"],
          submitText: "Send Message",
          contactInfo: {
            email: "alex@designer.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
          },
        }),
        createCell("footer", 20, 3, 6, 1, "footer-section", {
          companyName: "Alex Designer",
          tagline: "Let's create",
          socialLinks: [
            { platform: "twitter", href: "#" },
            { platform: "dribbble", href: "#" },
            { platform: "linkedin", href: "#" },
          ],
        }),
      ],
    },
  },
  {
    id: "blog",
    name: "Blog Layout",
    description: "Blog page with featured posts and sidebar",
    icon: <FileText className="w-5 h-5" />,
    category: "content",
    preview: "",
    layout: {
      id: "blog",
      name: "Blog Layout",
      rows: 24,
      cols: 4,
      gap: 16,
      cells: [
        // Navigation Header
        createCell("nav", 0, 0, 2, 4, "nav-bar", {
          logo: "BlogName",
          links: [
            { label: "Home", href: "#", active: true },
            { label: "Articles", href: "#" },
            { label: "Categories", href: "#" },
            { label: "About", href: "#" },
          ],
          showSearch: true,
          showNotifications: false,
        }),
        // Featured Post & Sidebar (480px + 360px)
        createCell("featured", 2, 0, 8, 3, "hero-section", {
          title: "Featured Article Title",
          subtitle:
            "This is a compelling introduction to your featured blog post that captures readers' attention",
          primaryCta: "Read More",
          tag: "Featured",
        }),
        // Sidebar Profile
        createCell("sidebar-profile", 2, 3, 14, 1, "profile", {
          name: "Author Name",
          role: "Tech Writer",
          avatar: "https://i.pravatar.cc/150?img=7",
          bio: "Writing about technology and design",
          stats: { posts: 120, followers: "5K", years: 5 },
        }),
        // Recent Posts Grid (360px)
        createCell("post-1", 10, 0, 6, 1, "feature", {
          title: "Article Title 1",
          description: "Brief description of the article content",
          iconType: "file-text",
        }),
        createCell("post-2", 10, 1, 6, 1, "feature", {
          title: "Article Title 2",
          description: "Brief description of the article content",
          iconType: "lightbulb",
        }),
        createCell("post-3", 10, 2, 6, 1, "feature", {
          title: "Article Title 3",
          description: "Brief description of the article content",
          iconType: "pen-tool",
        }),
        // More Posts + Newsletter
        createCell("post-4", 16, 0, 6, 1, "feature", {
          title: "Article Title 4",
          description: "Brief description of the article content",
          iconType: "code",
        }),
        createCell("post-5", 16, 1, 6, 1, "feature", {
          title: "Article Title 5",
          description: "Brief description of the article content",
          iconType: "cpu",
        }),
        createCell("post-6", 16, 2, 6, 1, "feature", {
          title: "Article Title 6",
          description: "Brief description of the article content",
          iconType: "globe",
        }),
        createCell("newsletter", 16, 3, 6, 1, "contact-form", {
          title: "Newsletter",
          fields: ["email"],
          submitText: "Subscribe",
        }),
        // Footer
        createCell("footer", 22, 0, 4, 4, "footer-section", {
          companyName: "BlogName",
          tagline: "Insights and stories",
          links: [
            { label: "Home", href: "#" },
            { label: "Articles", href: "#" },
            { label: "About", href: "#" },
            { label: "Contact", href: "#" },
          ],
          socialLinks: [
            { platform: "twitter", href: "#" },
            { platform: "github", href: "#" },
            { platform: "linkedin", href: "#" },
          ],
        }),
      ],
    },
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Product showcase with cart and filters",
    icon: <Store className="w-5 h-5" />,
    category: "app",
    preview: "",
    layout: {
      id: "ecommerce",
      name: "E-commerce",
      rows: 24,
      cols: 4,
      gap: 16,
      cells: [
        // Navigation Header
        createCell("nav", 0, 0, 2, 4, "nav-bar", {
          logo: "ShopName",
          links: [
            { label: "Home", href: "#" },
            { label: "Products", href: "#", active: true },
            { label: "Categories", href: "#" },
            { label: "Sale", href: "#" },
          ],
          showSearch: true,
          showCart: true,
          cartCount: 3,
        }),
        // Hero Banner (480px + products)
        createCell("hero", 2, 0, 8, 2, "hero-section", {
          title: "Summer Collection",
          subtitle: "Discover our latest arrivals with up to 50% off",
          primaryCta: "Shop Now",
          secondaryCta: "View All",
        }),
        // Featured Products
        createCell("product-1", 2, 2, 8, 1, "pricing", {
          title: "Premium Headphones",
          price: "$299",
          originalPrice: "$399",
          features: ["Noise Cancelling", "40h Battery", "Premium Sound"],
          badge: "Sale",
        }),
        createCell("product-2", 2, 3, 8, 1, "pricing", {
          title: "Smart Watch Pro",
          price: "$449",
          features: ["Health Tracking", "GPS", "5 Day Battery"],
          badge: "New",
        }),
        // Product Gallery (600px)
        createCell("gallery", 10, 0, 10, 3, "image-gallery", {
          title: "Trending Products",
          images: [
            {
              src: "https://picsum.photos/300/300?random=10",
              alt: "Product 1",
              caption: "$99",
            },
            {
              src: "https://picsum.photos/300/300?random=11",
              alt: "Product 2",
              caption: "$149",
            },
            {
              src: "https://picsum.photos/300/300?random=12",
              alt: "Product 3",
              caption: "$199",
            },
            {
              src: "https://picsum.photos/300/300?random=13",
              alt: "Product 4",
              caption: "$79",
            },
            {
              src: "https://picsum.photos/300/300?random=14",
              alt: "Product 5",
              caption: "$129",
            },
            {
              src: "https://picsum.photos/300/300?random=15",
              alt: "Product 6",
              caption: "$249",
            },
          ],
          layout: "grid",
        }),
        // Promo + Categories (300px each)
        createCell("promo", 10, 3, 5, 1, "stats-widget", {
          title: "Flash Sale",
          value: "50% OFF",
          description: "Ends in 24 hours",
          trend: "up",
        }),
        createCell("categories", 15, 3, 5, 1, "feature", {
          title: "Categories",
          description: "Browse all products",
          iconType: "grid",
        }),
        // Footer
        createCell("footer", 20, 0, 4, 4, "footer-section", {
          companyName: "ShopName",
          tagline: "Quality products, great prices",
          links: [
            { label: "Home", href: "#" },
            { label: "Products", href: "#" },
            { label: "About", href: "#" },
            { label: "Contact", href: "#" },
          ],
          socialLinks: [
            { platform: "twitter", href: "#" },
            { platform: "instagram", href: "#" },
            { platform: "facebook", href: "#" },
          ],
        }),
      ],
    },
  },
  {
    id: "saas-pricing",
    name: "SaaS Pricing",
    description: "Pricing page with plans and FAQ",
    icon: <CreditCard className="w-5 h-5" />,
    category: "marketing",
    preview: "",
    layout: {
      id: "saas-pricing",
      name: "SaaS Pricing",
      rows: 24,
      cols: 4,
      gap: 16,
      cells: [
        // Navigation Header
        createCell("nav", 0, 0, 2, 4, "nav-bar", {
          logo: "SaaSName",
          links: [
            { label: "Features", href: "#" },
            { label: "Pricing", href: "#", active: true },
            { label: "Docs", href: "#" },
            { label: "Contact", href: "#" },
          ],
          showSearch: false,
          showNotifications: false,
        }),
        // Hero (480px + plans)
        createCell("hero", 2, 0, 8, 4, "hero-section", {
          title: "Simple, Transparent Pricing",
          subtitle:
            "Choose the plan that's right for you. All plans include a 14-day free trial.",
        }),
        // Pricing Cards (600px tall)
        createCell("basic", 10, 0, 10, 1, "pricing", {
          title: "Starter",
          price: "$9",
          period: "/month",
          description: "Perfect for individuals",
          features: [
            "5 Projects",
            "Basic Analytics",
            "Email Support",
            "1GB Storage",
          ],
          cta: "Start Free Trial",
          highlighted: false,
        }),
        createCell("pro", 10, 1, 10, 1, "pricing", {
          title: "Professional",
          price: "$29",
          period: "/month",
          description: "Best for growing teams",
          features: [
            "Unlimited Projects",
            "Advanced Analytics",
            "Priority Support",
            "10GB Storage",
            "API Access",
          ],
          cta: "Start Free Trial",
          highlighted: true,
          badge: "Most Popular",
        }),
        createCell("enterprise", 10, 2, 10, 1, "pricing", {
          title: "Enterprise",
          price: "$99",
          period: "/month",
          description: "For large organizations",
          features: [
            "Everything in Pro",
            "Custom Integrations",
            "Dedicated Support",
            "Unlimited Storage",
            "SLA",
          ],
          cta: "Contact Sales",
          highlighted: false,
        }),
        // FAQ (Sidebar style - 600px matched with pricing cards)
        createCell("faq", 10, 3, 10, 1, "accordion", {
          title: "FAQ",
          items: [
            { title: "Can I cancel?", content: "Yes, anytime." },
            { title: "Is there a trial?", content: "14 days free." },
            {
              title: "Do you offer refunds?",
              content: "Yes, 30-day guarantee.",
            },
            {
              title: "Support hours?",
              content: "24/7 for Pro and Enterprise.",
            },
          ],
        }),
        // Testimonial + Trust (Below)
        createCell("testimonial", 20, 0, 4, 2, "testimonial", {
          quote:
            "Switching to this platform increased our productivity by 40%. The ROI was immediate.",
          author: "Michael Chen",
          role: "CTO, StartupXYZ",
          avatar: "https://i.pravatar.cc/150?img=11",
          rating: 5,
        }),
        createCell("stats", 20, 2, 4, 2, "stats-widget", {
          title: "Trusted By",
          value: "10,000+",
          description: "Companies worldwide",
          trend: "up",
          change: 25,
        }),
        // Footer (240px)
        createCell("footer", 24, 0, 4, 4, "footer-section", {
          companyName: "SaaSName",
          tagline: "Empowering teams everywhere",
          links: [
            { label: "Features", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "Docs", href: "#" },
            { label: "Contact", href: "#" },
          ],
          socialLinks: [
            { platform: "twitter", href: "#" },
            { platform: "github", href: "#" },
            { platform: "linkedin", href: "#" },
          ],
        }),
      ],
    },
  },
];

interface TemplatesGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (layout: GridLayout) => void;
}

export function TemplatesGallery({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplatesGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "marketing", name: "Marketing" },
    { id: "app", name: "Applications" },
    { id: "portfolio", name: "Portfolio" },
    { id: "content", name: "Content" },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? pageTemplates
      : pageTemplates.filter((t) => t.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Templates Gallery
            </h2>
            <p className="text-white/50 text-sm mt-1">
              Start with a pre-built layout
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 border-b border-zinc-800 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                selectedCategory === cat.id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-white/60 hover:text-white hover:bg-white/5",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template.layout);
                  onClose();
                }}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className={cn(
                  "group relative p-4 rounded-xl border transition-all text-left",
                  hoveredTemplate === template.id
                    ? "bg-cyan-500/10 border-cyan-500/50 scale-[1.02]"
                    : "bg-white/5 border-white/10 hover:border-white/20",
                )}
              >
                {/* Preview */}
                <div className="aspect-video rounded-lg bg-gradient-to-br from-purple-600/30 via-pink-500/30 to-orange-400/30 mb-4 flex items-center justify-center relative overflow-hidden">
                  {/* Mini grid preview */}
                  <div
                    className="absolute inset-2 grid gap-1"
                    style={{
                      gridTemplateRows: `repeat(${template.layout.rows}, 1fr)`,
                      gridTemplateColumns: `repeat(${template.layout.cols}, 1fr)`,
                    }}
                  >
                    {template.layout.cells.map((cell) => (
                      <div
                        key={cell.id}
                        className="bg-white/30 rounded border border-white/20"
                        style={{
                          gridRow: `${cell.row + 1} / span ${cell.rowSpan}`,
                          gridColumn: `${cell.col + 1} / span ${cell.colSpan}`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10 text-cyan-400">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-white/50 mt-0.5 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                {/* Hover overlay */}
                {hoveredTemplate === template.id && (
                  <div className="absolute inset-0 rounded-xl bg-cyan-500/5 pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex justify-between items-center">
          <span className="text-white/40 text-sm">
            {filteredTemplates.length} templates available
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
