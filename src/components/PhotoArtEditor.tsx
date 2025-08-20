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

const PhotoArtEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle">("select");
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize drawing mode and brush for Fabric.js v6
    canvas.isDrawingMode = false;
    
    // Create and configure the brush
    try {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = activeColor;
        canvas.freeDrawingBrush.width = brushSize;
      }
    } catch (error) {
      console.log("Brush initialization:", error);
    }

    setFabricCanvas(canvas);
    toast.success("Photo Art Editor ready!");

    return () => {
      canvas.dispose();
    };
  }, [activeColor, brushSize]);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    // Safe brush configuration
    try {
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.color = activeColor;
        fabricCanvas.freeDrawingBrush.width = brushSize;
      }
    } catch (error) {
      console.log("Brush configuration error:", error);
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

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
    link.download = 'photo-art.png';
    link.href = dataURL;
    link.click();
    toast.success("Image downloaded!");
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
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

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Toolbar */}
      <Card className="lg:w-80 m-4 lg:h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Photo Art Editor
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

          {/* Color and Brush */}
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

          <div className="space-y-2">
            <Label>Brush Size: {brushSize}px</Label>
            <Input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

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
          </div>
        </CardContent>
      </Card>

      {/* Canvas Area */}
      <div className="flex-1 p-4">
        <Card className="h-full">
          <CardContent className="p-4 h-full flex items-center justify-center">
            <div className="border border-border rounded-lg shadow-lg overflow-hidden bg-white">
              <canvas ref={canvasRef} className="max-w-full max-h-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhotoArtEditor;