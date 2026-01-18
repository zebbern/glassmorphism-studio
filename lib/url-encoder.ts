import type {
  GlassSettings,
  ColorSettings,
  GradientSettings,
  EncodedSettings,
} from "@/types/glassmorphic";

// Encode settings to a URL-safe string
export function encodeSettingsToURL(
  settings: GlassSettings,
  colorSettings: ColorSettings,
  gradientSettings: GradientSettings,
  inputColor: string,
): string {
  const data: EncodedSettings = {
    s: settings,
    c: colorSettings,
    g: gradientSettings,
    i: inputColor,
  };

  try {
    const jsonString = JSON.stringify(data);
    const base64 = btoa(encodeURIComponent(jsonString));
    return base64;
  } catch (error) {
    console.error("Error encoding settings:", error);
    return "";
  }
}

// Decode settings from a URL-safe string
export function decodeSettingsFromURL(encoded: string): EncodedSettings | null {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    const data = JSON.parse(jsonString) as EncodedSettings;

    // Validate the decoded data has required properties
    if (!data.s || !data.c || !data.g || !data.i) {
      throw new Error("Invalid encoded data structure");
    }

    return data;
  } catch (error) {
    console.error("Error decoding settings:", error);
    return null;
  }
}

// Generate a full shareable URL
export function generateShareableURL(
  settings: GlassSettings,
  colorSettings: ColorSettings,
  gradientSettings: GradientSettings,
  inputColor: string,
): string {
  const encoded = encodeSettingsToURL(
    settings,
    colorSettings,
    gradientSettings,
    inputColor,
  );

  if (typeof window === "undefined") {
    return `?config=${encoded}`;
  }

  const baseURL = window.location.origin + window.location.pathname;
  return `${baseURL}?config=${encoded}`;
}

// Extract encoded settings from URL
export function getSettingsFromURL(): EncodedSettings | null {
  if (typeof window === "undefined") {
    return null;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const configParam = urlParams.get("config");

  if (!configParam) {
    return null;
  }

  return decodeSettingsFromURL(configParam);
}

// Copy URL to clipboard
export async function copyShareableURL(
  settings: GlassSettings,
  colorSettings: ColorSettings,
  gradientSettings: GradientSettings,
  inputColor: string,
): Promise<boolean> {
  const url = generateShareableURL(
    settings,
    colorSettings,
    gradientSettings,
    inputColor,
  );

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
}

// Export settings as JSON
export function exportSettingsAsJSON(
  settings: GlassSettings,
  colorSettings: ColorSettings,
  gradientSettings: GradientSettings,
  inputColor: string,
  name?: string,
): string {
  const data = {
    name: name || "Glass Configuration",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    settings,
    colorSettings,
    gradientSettings,
    inputColor,
  };

  return JSON.stringify(data, null, 2);
}

// Import settings from JSON
export function importSettingsFromJSON(jsonString: string): {
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
  name?: string;
} | null {
  try {
    const data = JSON.parse(jsonString);

    // Validate structure
    if (
      !data.settings ||
      !data.colorSettings ||
      !data.gradientSettings ||
      !data.inputColor
    ) {
      throw new Error("Invalid JSON structure");
    }

    return {
      settings: data.settings,
      colorSettings: data.colorSettings,
      gradientSettings: data.gradientSettings,
      inputColor: data.inputColor,
      name: data.name,
    };
  } catch (error) {
    console.error("Error importing JSON:", error);
    return null;
  }
}

// Download JSON file
export function downloadJSON(
  settings: GlassSettings,
  colorSettings: ColorSettings,
  gradientSettings: GradientSettings,
  inputColor: string,
  filename: string = "glass-config.json",
): void {
  const json = exportSettingsAsJSON(
    settings,
    colorSettings,
    gradientSettings,
    inputColor,
  );
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
