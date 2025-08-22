import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  MousePointer,
  Brush,
  Square,
  Circle as CircleIcon,
  Type,
  Move,
  ZoomIn,
  Palette,
  Upload,
  Download,
  Undo,
  Redo,
  Trash2,
} from "lucide-react";
import BrushSettings, { BrushConfig } from "./BrushSettings";

interface ToolsPanelProps {
  activeTool: string;
  activeColor: string;
  brushConfig: BrushConfig;
  onToolChange: (tool: string) => void;
  onColorChange: (color: string) => void;
  onBrushConfigChange: (config: BrushConfig) => void;
  onUpload: () => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDeleteSelected: () => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  activeTool,
  activeColor,
  brushConfig,
  onToolChange,
  onColorChange,
  onBrushConfigChange,
  onUpload,
  onDownload,
  onUndo,
  onRedo,
  onClear,
  onDeleteSelected,
}) => {
  const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "move", icon: Move, label: "Move" },
    { id: "draw", icon: Brush, label: "Brush" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: CircleIcon, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "zoom", icon: ZoomIn, label: "Zoom" },
  ];

  return (
    <div className="w-16 bg-muted/30 border-r flex flex-col">
      {/* Tools */}
      <div className="p-2 space-y-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "ghost"}
            size="sm"
            className="w-12 h-12 p-0"
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
          >
            <tool.icon className="h-5 w-5" />
          </Button>
        ))}
      </div>
      
      <Separator className="mx-2" />
      
      {/* Color Picker */}
      <div className="p-2">
        <div className="space-y-2">
          <div className="w-12 h-12 border rounded overflow-hidden">
            <Input
              type="color"
              value={activeColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full h-full p-0 border-0 cursor-pointer"
              title="Color"
            />
          </div>
        </div>
      </div>
      
      <Separator className="mx-2" />
      
      {/* Quick Actions */}
      <div className="p-2 space-y-1 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0"
          onClick={onUpload}
          title="Upload Image"
        >
          <Upload className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0"
          onClick={onDownload}
          title="Download"
        >
          <Download className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0"
          onClick={onUndo}
          title="Undo"
        >
          <Undo className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0"
          onClick={onDeleteSelected}
          title="Delete Selected"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ToolsPanel;