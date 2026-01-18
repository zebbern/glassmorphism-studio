"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import type {
  SavedConfiguration,
  GlassSettings,
  ColorSettings,
  GradientSettings,
} from "@/types/glassmorphic";
import {
  Save,
  FolderOpen,
  Download,
  Upload,
  Link,
  Copy,
  Trash2,
  MoreVertical,
  FileJson,
  Share2,
} from "lucide-react";
import {
  downloadJSON,
  importSettingsFromJSON,
  generateShareableURL,
} from "@/lib/url-encoder";

interface SavedConfigsProps {
  configs: SavedConfiguration[];
  currentSettings: GlassSettings;
  currentColorSettings: ColorSettings;
  currentGradientSettings: GradientSettings;
  currentInputColor: string;
  onSaveConfig: (config: SavedConfiguration) => void;
  onLoadConfig: (config: SavedConfiguration) => void;
  onDeleteConfig: (id: string) => void;
  onUpdateConfig: (id: string, updates: Partial<SavedConfiguration>) => void;
}

export function SavedConfigs({
  configs,
  currentSettings,
  currentColorSettings,
  currentGradientSettings,
  currentInputColor,
  onSaveConfig,
  onLoadConfig,
  onDeleteConfig,
  onUpdateConfig,
}: SavedConfigsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newConfigName, setNewConfigName] = useState("");
  const [newConfigDescription, setNewConfigDescription] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJson, setImportJson] = useState("");

  const handleSaveConfig = () => {
    if (!newConfigName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your configuration.",
        variant: "destructive",
      });
      return;
    }

    const newConfig: SavedConfiguration = {
      id: `config-${Date.now()}`,
      name: newConfigName.trim(),
      description: newConfigDescription.trim() || undefined,
      settings: currentSettings,
      colorSettings: currentColorSettings,
      gradientSettings: currentGradientSettings,
      inputColor: currentInputColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveConfig(newConfig);
    setNewConfigName("");
    setNewConfigDescription("");
    setSaveDialogOpen(false);

    toast({
      title: "Configuration saved!",
      description: `"${newConfig.name}" has been saved to your library.`,
    });
  };

  const handleExportJSON = () => {
    downloadJSON(
      currentSettings,
      currentColorSettings,
      currentGradientSettings,
      currentInputColor,
      `glass-config-${Date.now()}.json`,
    );

    toast({
      title: "Exported!",
      description: "Configuration exported as JSON file.",
    });
  };

  const handleImportJSON = () => {
    const imported = importSettingsFromJSON(importJson);

    if (!imported) {
      toast({
        title: "Import failed",
        description:
          "Invalid JSON format. Please check the file and try again.",
        variant: "destructive",
      });
      return;
    }

    const newConfig: SavedConfiguration = {
      id: `config-${Date.now()}`,
      name: imported.name || `Imported Config`,
      settings: imported.settings,
      colorSettings: imported.colorSettings,
      gradientSettings: imported.gradientSettings,
      inputColor: imported.inputColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveConfig(newConfig);
    setImportJson("");
    setImportDialogOpen(false);

    toast({
      title: "Imported!",
      description: `"${newConfig.name}" has been imported.`,
    });
  };

  const handleCopyShareURL = async () => {
    const url = generateShareableURL(
      currentSettings,
      currentColorSettings,
      currentGradientSettings,
      currentInputColor,
    );

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Shareable URL copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Save className="w-5 h-5 text-primary" />
            Saved Configurations
          </CardTitle>

          <div className="flex gap-2">
            {/* Save Dialog */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="default">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Configuration</DialogTitle>
                  <DialogDescription>
                    Save your current glass settings for later use.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="config-name">Name</Label>
                    <Input
                      id="config-name"
                      placeholder="My Glass Style"
                      value={newConfigName}
                      onChange={(e) => setNewConfigName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="config-description">
                      Description (optional)
                    </Label>
                    <Textarea
                      id="config-description"
                      placeholder="Describe this configuration..."
                      value={newConfigDescription}
                      onChange={(e) => setNewConfigDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSaveDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveConfig}>Save Configuration</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportJSON}>
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopyShareURL}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Copy Share Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {configs.length > 0 ? (
            <div className="space-y-2">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onLoadConfig(config)}
                  >
                    <h4 className="font-medium text-sm">{config.name}</h4>
                    {config.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {config.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(config.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => onLoadConfig(config)}
                    >
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onDeleteConfig(config.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No saved configurations</p>
              <p className="text-xs mt-1">
                Save your current settings to get started
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Configuration</DialogTitle>
            <DialogDescription>
              Paste the JSON configuration to import.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="import-json">JSON Configuration</Label>
              <Textarea
                id="import-json"
                placeholder='{"name": "My Config", "settings": {...}}'
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                rows={10}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleImportJSON}>
              <FileJson className="w-4 h-4 mr-2" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
