"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { exportGlass, exportFormats } from "@/lib/exporters";
import type {
  GlassSettings,
  ColorSettings,
  GradientSettings,
  ExportFormat,
} from "@/types/glassmorphic";
import {
  Code,
  Copy,
  Download,
  FileCode,
  Wind,
  Braces,
  Hash,
  Check,
} from "lucide-react";

interface ExportModalProps {
  settings: GlassSettings;
  colorSettings: ColorSettings;
  gradientSettings: GradientSettings;
  inputColor: string;
}

const formatIcons: Record<string, React.ReactNode> = {
  css: <FileCode className="w-4 h-4" />,
  tailwind: <Wind className="w-4 h-4" />,
  "css-in-js": <Braces className="w-4 h-4" />,
  scss: <Hash className="w-4 h-4" />,
};

export function ExportModal({
  settings,
  colorSettings,
  gradientSettings,
  inputColor,
}: ExportModalProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("css");
  const [includeComments, setIncludeComments] = useState(true);
  const [componentName, setComponentName] = useState("glass-card");
  const [copied, setCopied] = useState(false);

  const generatedCode = exportGlass(
    activeFormat,
    settings,
    colorSettings,
    gradientSettings,
    inputColor,
    {
      includeComments,
      componentName,
    },
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${exportFormats.find((f) => f.id === activeFormat)?.name} code copied to clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const format = exportFormats.find((f) => f.id === activeFormat);
    const filename = `${componentName}${format?.extension || ".txt"}`;
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: `File saved as ${filename}`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Code className="w-4 h-4" />
          Export Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Export Glass Styles
          </DialogTitle>
          <DialogDescription>
            Export your glassmorphism styles in multiple formats
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeFormat}
          onValueChange={(v) => setActiveFormat(v as ExportFormat)}
        >
          {/* Format Selection */}
          <TabsList className="grid grid-cols-4 mb-4">
            {exportFormats.map((format) => (
              <TabsTrigger
                key={format.id}
                value={format.id}
                className="flex items-center gap-2 text-sm"
              >
                {formatIcons[format.id]}
                <span className="hidden sm:inline">{format.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Options */}
          <div className="flex flex-wrap items-center gap-4 mb-4 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Switch
                id="comments"
                checked={includeComments}
                onCheckedChange={setIncludeComments}
              />
              <Label htmlFor="comments" className="text-sm">
                Include comments
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="component-name"
                className="text-sm whitespace-nowrap"
              >
                Class/Component name:
              </Label>
              <Input
                id="component-name"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="w-32 h-8 text-sm"
              />
            </div>
          </div>

          {/* Code Preview */}
          {exportFormats.map((format) => (
            <TabsContent key={format.id} value={format.id} className="mt-0">
              <div className="relative rounded-lg border bg-zinc-950 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b bg-zinc-900/50">
                  <span className="text-xs text-zinc-400 font-mono">
                    {componentName}
                    {format.extension}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1.5 text-zinc-400 hover:text-white"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1.5 text-zinc-400 hover:text-white"
                      onClick={handleDownload}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Code */}
                <ScrollArea className="h-[350px]">
                  <pre className="p-4 text-sm font-mono text-zinc-300 whitespace-pre-wrap">
                    <code>{generatedCode}</code>
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Format Info */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          {activeFormat === "css" && (
            <p>
              Plain CSS that works in any project. Just copy and paste into your
              stylesheet.
            </p>
          )}
          {activeFormat === "tailwind" && (
            <p>
              Tailwind classes and config extensions for utility-first styling.
            </p>
          )}
          {activeFormat === "css-in-js" && (
            <p>
              styled-components syntax for React applications using CSS-in-JS.
            </p>
          )}
          {activeFormat === "scss" && (
            <p>SCSS with variables and mixins for maintainable stylesheets.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
