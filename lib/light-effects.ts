// Light effects utilities for glass refraction simulation
import { LightSource, LightPosition } from "@/types/glassmorphic";

// Default light source settings
export const defaultLightSource: LightSource = {
  position: { x: 50, y: 0 }, // Top center by default
  color: "#ffffff",
  intensity: 50,
  radius: 100,
  enabled: true,
};

// Convert light position to gradient angle
export function getLightAngle(position: LightPosition): number {
  // Calculate angle from center (50, 50) to light position
  const dx = position.x - 50;
  const dy = position.y - 50;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  // Convert to CSS gradient angle (0deg = top, 90deg = right)
  return (angle + 90 + 360) % 360;
}

// Calculate distance from center for intensity falloff
export function getLightDistance(position: LightPosition): number {
  const dx = position.x - 50;
  const dy = position.y - 50;
  return Math.sqrt(dx * dx + dy * dy);
}

// Generate radial gradient for light effect
export function generateLightGradient(light: LightSource): string {
  if (!light.enabled) {
    return "none";
  }

  const { position, color, intensity, radius } = light;
  const opacity = intensity / 100;

  // Position the gradient based on light position
  const posX = `${position.x}%`;
  const posY = `${position.y}%`;

  return `radial-gradient(
    circle at ${posX} ${posY},
    ${hexToRgba(color, opacity * 0.5)} 0%,
    ${hexToRgba(color, opacity * 0.2)} ${radius * 0.3}%,
    transparent ${radius}%
  )`;
}

// Generate highlight/reflection effect
export function generateReflectionGradient(light: LightSource): string {
  if (!light.enabled) {
    return "none";
  }

  const { position, color, intensity } = light;
  const opacity = (intensity / 100) * 0.3;

  // Create a subtle reflection opposite to light
  const reflectX = 100 - position.x;
  const reflectY = 100 - position.y;

  return `radial-gradient(
    ellipse 100% 50% at ${reflectX}% ${reflectY}%,
    ${hexToRgba(color, opacity)} 0%,
    transparent 50%
  )`;
}

// Generate border glow based on light position
export function generateBorderGlow(light: LightSource): string {
  if (!light.enabled) {
    return "none";
  }

  const { position, color, intensity } = light;
  const angle = getLightAngle(position);
  const opacity = intensity / 100;

  return `linear-gradient(
    ${angle}deg,
    ${hexToRgba(color, opacity * 0.6)} 0%,
    ${hexToRgba(color, opacity * 0.2)} 30%,
    transparent 70%
  )`;
}

// Calculate box shadow based on light position
export function generateLightShadow(
  light: LightSource,
  baseBlur: number = 20,
): string {
  if (!light.enabled) {
    return "none";
  }

  const { position, intensity } = light;

  // Shadow is cast opposite to light direction
  const shadowX = Math.round((50 - position.x) * 0.3);
  const shadowY = Math.round((50 - position.y) * 0.3);
  const blur = baseBlur * (intensity / 100);
  const spread = blur * 0.2;
  const opacity = (intensity / 100) * 0.3;

  return `${shadowX}px ${shadowY}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`;
}

// Generate complete light effect styles
export function generateLightEffectStyles(
  light: LightSource,
): React.CSSProperties {
  if (!light.enabled) {
    return {};
  }

  return {
    background: generateLightGradient(light),
    boxShadow: generateLightShadow(light),
  };
}

// Generate CSS code for light effects
export function generateLightEffectCSS(
  light: LightSource,
  selector: string = ".glass-element",
): string {
  if (!light.enabled) {
    return "";
  }

  const gradient = generateLightGradient(light);
  const reflection = generateReflectionGradient(light);
  const borderGlow = generateBorderGlow(light);
  const shadow = generateLightShadow(light);

  return `/* Light Effect - Position: ${light.position.x}%, ${light.position.y}% */
${selector}::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: ${gradient};
  pointer-events: none;
}

${selector}::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: ${reflection};
  pointer-events: none;
}

${selector} {
  box-shadow: ${shadow};
}`;
}

// Helper: Convert hex color to rgba
export function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return `rgba(255, 255, 255, ${alpha})`;
  }
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Light position presets
export const lightPositionPresets: { name: string; position: LightPosition }[] =
  [
    { name: "Top", position: { x: 50, y: 0 } },
    { name: "Top Left", position: { x: 0, y: 0 } },
    { name: "Top Right", position: { x: 100, y: 0 } },
    { name: "Left", position: { x: 0, y: 50 } },
    { name: "Right", position: { x: 100, y: 50 } },
    { name: "Center", position: { x: 50, y: 50 } },
    { name: "Bottom Left", position: { x: 0, y: 100 } },
    { name: "Bottom", position: { x: 50, y: 100 } },
    { name: "Bottom Right", position: { x: 100, y: 100 } },
  ];

// Light color presets
export const lightColorPresets: { name: string; color: string }[] = [
  { name: "White", color: "#ffffff" },
  { name: "Warm", color: "#fff4e0" },
  { name: "Cool", color: "#e0f0ff" },
  { name: "Golden", color: "#ffd700" },
  { name: "Purple", color: "#bf7fff" },
  { name: "Cyan", color: "#00ffff" },
  { name: "Pink", color: "#ff7fbf" },
  { name: "Green", color: "#7fff7f" },
];
