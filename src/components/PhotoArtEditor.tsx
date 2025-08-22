import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Upload,
  Download,
  Square,
  Circle as CircleIcon,
  Brush,
  MousePointer,
  Trash2,
  Undo,
  Redo,
  Palette
} from "lucide-react";
import PhotopeaStartScreen from "./PhotopeaStartScreen";
import PhotopeaMenuBar from "./PhotopeaMenuBar";
import NewProjectDialog, { ProjectConfig } from "./NewProjectDialog";
import BrushSettings, { BrushConfig } from "./BrushSettings";

const PhotoArtEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle">("select");
  const [brushConfig, setBrushConfig] = useState<BrushConfig>({
    size: 10,
    opacity: 1,
    hardness: 1,
    flow: 1,
    type: "round",
    blendMode: "normal"
  });
  
  // New state for project workflow
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectConfig | null>(null);

  // New workflow handlers
  const handleNewProject = () => {
    setShowNewProjectDialog(true);
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleCreateProject = (config: ProjectConfig) => {
    setCurrentProject(config);
    setShowStartScreen(false);
    toast.success(`Project "${config.name}" created!`);
  };

  const handleShowTemplates = () => {
    setShowNewProjectDialog(true);
  };

  const handleBackToStart = () => {
    setShowStartScreen(true);
    setCurrentProject(null);
    if (fabricCanvas) {
      fabricCanvas.dispose();
      setFabricCanvas(null);
    }
  };

  // Initialize canvas only when project is created
  useEffect(() => {
    if (!canvasRef.current || !currentProject || showStartScreen) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: currentProject.width,
      height: currentProject.height,
      backgroundColor: currentProject.background === "transparent" ? "transparent" : currentProject.background,
    });

    // Initialize drawing mode and brush for Fabric.js v6
    canvas.isDrawingMode = false;
    
     // Create and configure the brush
    try {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = activeColor;
        canvas.freeDrawingBrush.width = brushConfig.size;
      }
    } catch (error) {
      console.log("Brush initialization:", error);
    }

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [currentProject, showStartScreen, activeColor, brushConfig]);

   // Update brush settings when they change
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    // Configure advanced brush settings
    try {
      if (fabricCanvas.freeDrawingBrush) {
        // Basic properties
        fabricCanvas.freeDrawingBrush.width = brushConfig.size;
        
        // Apply opacity to color
        const hexColor = activeColor;
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${brushConfig.opacity})`;
        fabricCanvas.freeDrawingBrush.color = rgbaColor;

        // Apply brush type specific settings (simplified for Fabric.js compatibility)
        // Note: Advanced features like shadows are limited by Fabric.js v6 API
        if (brushConfig.type === "soft") {
          // For soft brushes, we could implement custom brush patterns in future
          console.log("Soft brush selected - advanced features coming soon");
        }
      }
    } catch (error) {
      console.log("Advanced brush configuration error:", error);
    }
  }, [activeTool, activeColor, brushConfig, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 100,
      });
      fabricCanvas?.add(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 50,
      });
      fabricCanvas?.add(circle);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target?.result as string;
      FabricImage.fromURL(imgSrc).then((img) => {
        // Scale image to fit canvas
        const canvasWidth = fabricCanvas.width!;
        const canvasHeight = fabricCanvas.height!;
        const imgWidth = img.width!;
        const imgHeight = img.height!;
        
        const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight, 1);
        img.scale(scale);
        
        // Center the image
        img.set({
          left: (canvasWidth - imgWidth * scale) / 2,
          top: (canvasHeight - imgHeight * scale) / 2,
        });
        
        fabricCanvas.add(img);
        fabricCanvas.renderAll();
        toast.success("Image uploaded successfully!");
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    
    const link = document.createElement('a');
    link.download = `${currentProject?.name || 'photo-art'}.png`;
    link.href = dataURL;
    link.click();
    toast.success("Image downloaded!");
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = currentProject?.background === "transparent" ? "transparent" : currentProject?.background || "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const handleUndo = () => {
    // Basic undo - remove last object
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
    }
  };

  const handleDeleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
      toast.success("Object deleted!");
    }
  };

  // Show start screen initially
  if (showStartScreen) {
    return (
      <>
        <PhotopeaStartScreen
          onNewProject={handleNewProject}
          onOpenFile={handleOpenFile}
          onTemplates={handleShowTemplates}
        />
        <NewProjectDialog
          open={showNewProjectDialog}
          onOpenChange={setShowNewProjectDialog}
          onCreateProject={handleCreateProject}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Menu Bar */}
      <PhotopeaMenuBar
        onNewProject={handleNewProject}
        onOpenFile={handleOpenFile}
        onSave={handleDownload}
        onExport={handleDownload}
        onUndo={handleUndo}
        onRedo={() => {}} // TODO: implement redo
        onClear={handleClear}
        onShowTemplates={handleShowTemplates}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="w-80 m-4 space-y-4">
          <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {currentProject?.name || "Photo Art Editor"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Operations */}
            <div className="space-y-2">
              <Label>File</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <Separator />

            {/* Tools */}
            <div className="space-y-2">
              <Label>Tools</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={activeTool === "select" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolClick("select")}
                >
                  <MousePointer className="h-4 w-4 mr-2" />
                  Select
                </Button>
                <Button
                  variant={activeTool === "draw" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolClick("draw")}
                >
                  <Brush className="h-4 w-4 mr-2" />
                  Draw
                </Button>
                <Button
                  variant={activeTool === "rectangle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolClick("rectangle")}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Rectangle
                </Button>
                <Button
                  variant={activeTool === "circle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolClick("circle")}
                >
                  <CircleIcon className="h-4 w-4 mr-2" />
                  Circle
                </Button>
              </div>
            </div>

            <Separator />

            {/* Brush Settings - Only show when draw tool is active */}
            {activeTool === "draw" && (
              <BrushSettings
                config={brushConfig}
                onChange={setBrushConfig}
                color={activeColor}
                onColorChange={setActiveColor}
              />
            )}

            {/* Basic Color picker for other tools */}
            {activeTool !== "draw" && (
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={activeColor}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={activeColor}
                    onChange={(e) => setActiveColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                >
                  <Undo className="h-4 w-4 mr-2" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClear}
                className="w-full"
              >
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToStart}
                className="w-full"
              >
                Back to Start
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardContent className="p-4 h-full flex items-center justify-center">
              <div 
                className="border border-border rounded-lg shadow-lg overflow-hidden" 
                style={{ 
                  backgroundColor: currentProject?.background === "transparent" 
                    ? "transparent" 
                    : currentProject?.background || "white",
                  backgroundImage: currentProject?.background === "transparent" 
                    ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                    : "none",
                  backgroundSize: currentProject?.background === "transparent" ? "20px 20px" : "auto",
                  backgroundPosition: currentProject?.background === "transparent" ? "0 0, 0 10px, 10px -10px, -10px 0px" : "0 0"
                }}
              >
                <canvas ref={canvasRef} className="max-w-full max-h-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default PhotoArtEditor;