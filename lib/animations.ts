// Animation utilities and CSS keyframe generators
import {
  AnimationSettings,
  AnimationType,
  EasingType,
} from "@/types/glassmorphic";

// Easing function CSS values
export const easingFunctions: Record<EasingType, string> = {
  ease: "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  linear: "linear",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
};

// Generate keyframes for different animation types
export const animationKeyframes: Record<
  AnimationType,
  (intensity: number) => string
> = {
  none: () => "",

  "hover-glow": (intensity: number) => {
    const glowSize = Math.round((intensity / 100) * 30);
    const glowOpacity = (intensity / 100) * 0.6;
    return `
@keyframes hoverGlow {
  0%, 100% {
    box-shadow: 0 0 ${glowSize}px rgba(255, 255, 255, ${glowOpacity * 0.3});
  }
  50% {
    box-shadow: 0 0 ${glowSize * 2}px rgba(255, 255, 255, ${glowOpacity});
  }
}`;
  },

  pulse: (intensity: number) => {
    const scale = 1 + (intensity / 100) * 0.1;
    return `
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(${scale});
    opacity: ${0.8 + (intensity / 100) * 0.2};
  }
}`;
  },

  shimmer: (intensity: number) => {
    const shimmerOpacity = (intensity / 100) * 0.5;
    return `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}`;
  },

  float: (intensity: number) => {
    const distance = Math.round((intensity / 100) * 20);
    return `
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-${distance}px);
  }
}`;
  },

  breathe: (intensity: number) => {
    const expandScale = 1 + (intensity / 100) * 0.05;
    const opacityMin = 0.7 + (intensity / 100) * 0.1;
    return `
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: ${opacityMin};
  }
  50% {
    transform: scale(${expandScale});
    opacity: 1;
  }
}`;
  },

  "rotate-border": (intensity: number) => {
    return `
@keyframes rotateBorder {
  0% {
    --border-angle: 0deg;
  }
  100% {
    --border-angle: 360deg;
  }
}`;
  },
};

// Animation name mapping
const animationNames: Record<AnimationType, string> = {
  none: "none",
  "hover-glow": "hoverGlow",
  pulse: "pulse",
  shimmer: "shimmer",
  float: "float",
  breathe: "breathe",
  "rotate-border": "rotateBorder",
};

// Generate CSS animation property
export function getAnimationCSS(settings: AnimationSettings): string {
  if (!settings.enabled || settings.type === "none") {
    return "";
  }

  const name = animationNames[settings.type];
  const duration = `${settings.duration}s`;
  const easing = easingFunctions[settings.easing];
  const delay = settings.delay > 0 ? `${settings.delay}s` : "0s";
  const iterations =
    settings.iterationCount === "infinite"
      ? "infinite"
      : settings.iterationCount;

  return `animation: ${name} ${duration} ${easing} ${delay} ${iterations}`;
}

// Generate complete animation styles including keyframes
export function generateAnimationStyles(settings: AnimationSettings): string {
  if (!settings.enabled || settings.type === "none") {
    return "";
  }

  const keyframes = animationKeyframes[settings.type](settings.intensity);
  const animationProp = getAnimationCSS(settings);

  // Special handling for shimmer - needs background gradient
  if (settings.type === "shimmer") {
    return `${keyframes}

.glass-element {
  ${animationProp};
  background-size: 200% 100%;
  background-image: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, ${(settings.intensity / 100) * 0.3}),
    transparent
  );
}`;
  }

  return `${keyframes}

.glass-element {
  ${animationProp};
}`;
}

// Generate inline style object for React
export function getAnimationStyleObject(
  settings: AnimationSettings,
): React.CSSProperties {
  if (!settings.enabled || settings.type === "none") {
    return {};
  }

  const name = animationNames[settings.type];
  const easing = easingFunctions[settings.easing];
  const iterations =
    settings.iterationCount === "infinite"
      ? "infinite"
      : settings.iterationCount;

  return {
    animation: `${name} ${settings.duration}s ${easing} ${settings.delay}s ${iterations}`,
  };
}

// Generate Tailwind animation class (custom)
export function getAnimationTailwind(settings: AnimationSettings): string {
  if (!settings.enabled || settings.type === "none") {
    return "";
  }

  // Return comment for tailwind config
  return `// Add to tailwind.config.ts:
// animation: {
//   '${settings.type}': '${animationNames[settings.type]} ${settings.duration}s ${easingFunctions[settings.easing]} ${settings.iterationCount}',
// }
// Then use: animate-${settings.type}`;
}

// Default animation settings
export const defaultAnimationSettings: AnimationSettings = {
  type: "none",
  duration: 1,
  easing: "ease-in-out",
  intensity: 50,
  enabled: false,
  delay: 0,
  iterationCount: "infinite",
};

// Animation presets
export const animationPresets: Record<string, Partial<AnimationSettings>> = {
  "subtle-pulse": {
    type: "pulse",
    duration: 2,
    easing: "ease-in-out",
    intensity: 30,
    enabled: true,
    iterationCount: "infinite",
  },
  "gentle-float": {
    type: "float",
    duration: 3,
    easing: "ease-in-out",
    intensity: 40,
    enabled: true,
    iterationCount: "infinite",
  },
  "soft-glow": {
    type: "hover-glow",
    duration: 1.5,
    easing: "ease",
    intensity: 50,
    enabled: true,
    iterationCount: "infinite",
  },
  "shimmer-effect": {
    type: "shimmer",
    duration: 2,
    easing: "linear",
    intensity: 60,
    enabled: true,
    iterationCount: "infinite",
  },
  "slow-breathe": {
    type: "breathe",
    duration: 4,
    easing: "ease-in-out",
    intensity: 40,
    enabled: true,
    iterationCount: "infinite",
  },
};
