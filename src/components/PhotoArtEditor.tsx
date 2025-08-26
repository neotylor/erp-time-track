import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Circle, Rect, FabricImage, PencilBrush, FabricObject, Point, IText } from "fabric";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import PhotopeaStartScreen from "./PhotopeaStartScreen";
import PhotopeaMenuBar from "./PhotopeaMenuBar";
import NewProjectDialog, { ProjectConfig } from "./NewProjectDialog";
import BrushSettings, { BrushConfig } from "./BrushSettings";
import ToolsPanel from "./ToolsPanel";
import LayersPanel from "./LayersPanel";
import PropertiesPanel from "./PropertiesPanel";
import RulerComponent from "./RulerComponent";

// Extend FabricObject to include custom properties
interface ExtendedFabricObject extends FabricObject {
  id?: string;
  name?: string;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  type: string;
}

const PhotoArtEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<string>("select");
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushConfig, setBrushConfig] = useState<BrushConfig>({
    size: 10,
    opacity: 1,
    hardness: 1,
    flow: 1,
    type: "round",
    blendMode: "normal"
  });
  
  // Project workflow state
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectConfig | null>(null);
  
  // Layer management state
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  
  // UI state
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  // History management for undo/redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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

  const handleClose = () => {
    // Navigate back to main page
    window.location.href = '/';
  };

  // Initialize canvas only when project is created
  useEffect(() => {
    if (!canvasRef.current || !currentProject || showStartScreen) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: currentProject.width,
      height: currentProject.height,
      backgroundColor: currentProject.background === "transparent" ? "transparent" : currentProject.background,
    });

    // Initialize brush
    const brush = new PencilBrush(canvas);
    brush.width = brushConfig.size;
    brush.color = activeColor;
    canvas.freeDrawingBrush = brush;
    canvas.isDrawingMode = false;
    
    // Add event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObject((e as any).selected?.[0]);
    });
    
    canvas.on('selection:updated', (e) => {
      setSelectedObject((e as any).selected?.[0]);
    });
    
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    
    canvas.on('object:added', (e) => {
      const obj = e.target as ExtendedFabricObject;
      if (obj && !obj.id) {
        obj.id = `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        updateLayers(canvas);
        saveCanvasState(canvas);
      }
    });
    
    canvas.on('object:removed', () => {
      updateLayers(canvas);
      saveCanvasState(canvas);
    });
    
    canvas.on('object:modified', () => {
      saveCanvasState(canvas);
    });
    
    canvas.on('path:created', () => {
      saveCanvasState(canvas);
    });

    setFabricCanvas(canvas);
    
    // Initialize background layer
    setLayers([{
      id: 'background',
      name: 'Background',
      visible: true,
      locked: false,
      opacity: 1,
      type: 'background'
    }]);

    // Initialize history
    saveCanvasState(canvas);

    return () => {
      canvas.dispose();
    };
  }, [currentProject, showStartScreen]);

  // Update tool behavior
  useEffect(() => {
    if (!fabricCanvas) return;

    // Reset canvas interaction modes
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;
    fabricCanvas.defaultCursor = 'default';
    
    switch (activeTool) {
      case "draw":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.selection = false;
        if (fabricCanvas.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.width = brushConfig.size;
          const hexColor = activeColor;
          const r = parseInt(hexColor.slice(1, 3), 16);
          const g = parseInt(hexColor.slice(3, 5), 16);
          const b = parseInt(hexColor.slice(5, 7), 16);
          const rgbaColor = `rgba(${r}, ${g}, ${b}, ${brushConfig.opacity})`;
          fabricCanvas.freeDrawingBrush.color = rgbaColor;
        }
        break;
      case "select":
        fabricCanvas.defaultCursor = 'default';
        break;
      case "move":
        fabricCanvas.defaultCursor = 'move';
        break;
      case "hand":
        fabricCanvas.defaultCursor = 'grab';
        fabricCanvas.selection = false;
        break;
      case "rectangle":
      case "circle":
      case "text":
        fabricCanvas.selection = false;
        fabricCanvas.defaultCursor = 'crosshair';
        break;
      default:
        break;
    }
  }, [activeTool, activeColor, brushConfig, fabricCanvas]);
  
  // Update layers when canvas objects change
  const updateLayers = useCallback((canvas: FabricCanvas) => {
    const objects = canvas.getObjects() as ExtendedFabricObject[];
    const newLayers: Layer[] = [
      {
        id: 'background',
        name: 'Background',
        visible: true,
        locked: false,
        opacity: 1,
        type: 'background'
      },
      ...objects.map((obj, index) => ({
        id: obj.id || `layer_${index}`,
        name: obj.name || `${obj.type} ${index + 1}`,
        visible: obj.visible !== false,
        locked: obj.selectable === false,
        opacity: obj.opacity || 1,
        type: obj.type || 'object'
      }))
    ];
    setLayers(newLayers);
  }, []);

  // Handle shape drawing and text creation
  const handleCanvasMouseDown = useCallback((e: any) => {
    if (!fabricCanvas || activeTool === "select" || activeTool === "draw" || activeTool === "move" || activeTool === "hand") return;
    
    const pointer = fabricCanvas.getPointer(e.e);
    setIsDrawing(true);
    
    let shape: any = null;
    
    switch (activeTool) {
      case "rectangle":
        shape = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: 'transparent',
          stroke: activeColor,
          strokeWidth: 2,
        });
        break;
      case "circle":
        shape = new Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          fill: 'transparent',
          stroke: activeColor,
          strokeWidth: 2,
        });
        break;
      case "text":
        const text = new IText('Type here...', {
          left: pointer.x,
          top: pointer.y,
          fill: activeColor,
          fontSize: 20,
          fontFamily: 'Arial',
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        text.enterEditing();
        // Don't switch back to select tool for text
        return;
    }
    
    if (shape) {
      fabricCanvas.add(shape);
      fabricCanvas.setActiveObject(shape);
    }
  }, [fabricCanvas, activeTool, activeColor]);

  const handleCanvasMouseMove = useCallback((e: any) => {
    if (!fabricCanvas || !isDrawing || activeTool === "select" || activeTool === "draw" || activeTool === "move" || activeTool === "hand") return;
    
    const pointer = fabricCanvas.getPointer(e.e);
    const activeObject = fabricCanvas.getActiveObject();
    
    if (activeObject && activeTool === "rectangle") {
      const rect = activeObject as Rect;
      const startX = rect.left!;
      const startY = rect.top!;
      
      rect.set({
        width: Math.abs(pointer.x - startX),
        height: Math.abs(pointer.y - startY),
        left: Math.min(startX, pointer.x),
        top: Math.min(startY, pointer.y),
      });
    } else if (activeObject && activeTool === "circle") {
      const circle = activeObject as Circle;
      const startX = circle.left!;
      const startY = circle.top!;
      
      const radius = Math.sqrt(Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2));
      circle.set({ radius });
    }
    
    fabricCanvas.renderAll();
  }, [fabricCanvas, isDrawing, activeTool]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isDrawing && (activeTool === "rectangle" || activeTool === "circle")) {
      // Keep the shape tool active after drawing, don't switch to select
      setIsDrawing(false);
    } else {
      setIsDrawing(false);
    }
  }, [isDrawing, activeTool]);

  // Add canvas event listeners
  useEffect(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.on('mouse:down', handleCanvasMouseDown);
    fabricCanvas.on('mouse:move', handleCanvasMouseMove);
    fabricCanvas.on('mouse:up', handleCanvasMouseUp);
    
    return () => {
      fabricCanvas.off('mouse:down', handleCanvasMouseDown);
      fabricCanvas.off('mouse:move', handleCanvasMouseMove);
      fabricCanvas.off('mouse:up', handleCanvasMouseUp);
    };
  }, [fabricCanvas, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 's':
            e.preventDefault();
            handleDownload();
            break;
          case 'n':
            e.preventDefault();
            handleNewProject();
            break;
          case 'o':
            e.preventDefault();
            handleOpenFile();
            break;
          case 'a':
            e.preventDefault();
            if (fabricCanvas) {
              fabricCanvas.discardActiveObject();
              const selection = new (FabricCanvas as any).ActiveSelection(fabricCanvas.getObjects(), {
                canvas: fabricCanvas,
              });
              fabricCanvas.setActiveObject(selection);
              fabricCanvas.renderAll();
            }
            break;
          case 'd':
            e.preventDefault();
            if (fabricCanvas) {
              fabricCanvas.discardActiveObject();
              fabricCanvas.renderAll();
            }
            break;
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleZoomToFit();
            break;
          case '1':
            e.preventDefault();
            handleZoomActualSize();
            break;
          case 'delete':
          case 'backspace':
            e.preventDefault();
            handleDeleteSelected();
            break;
        }
      }
      
      // Space bar for hand tool
      if (e.code === 'Space' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveTool('hand');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setActiveTool('select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [fabricCanvas]);
  
  // History management
  const saveCanvasState = useCallback((canvas: FabricCanvas) => {
    const state = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);
  
  const loadCanvasState = useCallback((canvas: FabricCanvas, state: string) => {
    canvas.loadFromJSON(state).then(() => {
      canvas.renderAll();
      updateLayers(canvas);
    });
  }, [updateLayers]);

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
    if (!fabricCanvas || historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    loadCanvasState(fabricCanvas, history[newIndex]);
    toast.success("Undone!");
  };
  
  const handleRedo = () => {
    if (!fabricCanvas || historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    loadCanvasState(fabricCanvas, history[newIndex]);
    toast.success("Redone!");
  };

  const handleDeleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
      updateLayers(fabricCanvas);
      toast.success("Object deleted!");
    }
  };

  // Zoom and pan handlers
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 10);
    setZoom(newZoom);
    if (fabricCanvas) {
      fabricCanvas.setZoom(newZoom);
      fabricCanvas.renderAll();
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    setZoom(newZoom);
    if (fabricCanvas) {
      fabricCanvas.setZoom(newZoom);
      fabricCanvas.renderAll();
    }
  };

  const handleZoomToFit = () => {
    if (!fabricCanvas || !currentProject) return;
    
    const containerWidth = 800; // Approximate canvas container width
    const containerHeight = 600; // Approximate canvas container height
    const scaleX = containerWidth / currentProject.width;
    const scaleY = containerHeight / currentProject.height;
    const newZoom = Math.min(scaleX, scaleY, 1);
    
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const handleZoomActualSize = () => {
    setZoom(1);
    if (fabricCanvas) {
      fabricCanvas.setZoom(1);
      fabricCanvas.renderAll();
    }
  };

  const handlePanStart = (e: any) => {
    if (activeTool === 'hand' || activeTool === 'pan' || e.e.button === 1) { // Hand tool or middle mouse button
      setIsPanning(true);
      const pointer = fabricCanvas?.getPointer(e.e);
      if (pointer) {
        setLastPanPoint({ x: pointer.x, y: pointer.y });
      }
      if (activeTool === 'hand') {
        fabricCanvas!.defaultCursor = 'grabbing';
      }
    }
  };

  const handlePanMove = (e: any) => {
    if (!isPanning || !fabricCanvas) return;
    
    const pointer = fabricCanvas.getPointer(e.e);
    const deltaX = pointer.x - lastPanPoint.x;
    const deltaY = pointer.y - lastPanPoint.y;
    
    const newPanX = panX + deltaX;
    const newPanY = panY + deltaY;
    
    setPanX(newPanX);
    setPanY(newPanY);
    
    fabricCanvas.relativePan(new Point(deltaX, deltaY));
    setLastPanPoint({ x: pointer.x, y: pointer.y });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
    if (activeTool === 'hand' && fabricCanvas) {
      fabricCanvas.defaultCursor = 'grab';
    }
  };

  // Add pan event listeners
  useEffect(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.on('mouse:down', handlePanStart);
    fabricCanvas.on('mouse:move', handlePanMove);
    fabricCanvas.on('mouse:up', handlePanEnd);
    
    return () => {
      fabricCanvas.off('mouse:down', handlePanStart);
      fabricCanvas.off('mouse:move', handlePanMove);
      fabricCanvas.off('mouse:up', handlePanEnd);
    };
  }, [fabricCanvas, activeTool, isPanning, lastPanPoint, panX, panY]);
  
  // Layer management handlers
  const handleLayerSelect = (layerId: string) => {
    if (!fabricCanvas || layerId === 'background') return;
    
    const objects = fabricCanvas.getObjects() as ExtendedFabricObject[];
    const targetObject = objects.find(obj => obj.id === layerId);
    
    if (targetObject) {
      fabricCanvas.setActiveObject(targetObject);
      fabricCanvas.renderAll();
    }
    setSelectedLayer(layerId);
  };

  const handleLayerVisibilityToggle = (layerId: string) => {
    if (!fabricCanvas || layerId === 'background') return;
    
    const objects = fabricCanvas.getObjects() as ExtendedFabricObject[];
    const targetObject = objects.find(obj => obj.id === layerId);
    
    if (targetObject) {
      targetObject.visible = !targetObject.visible;
      fabricCanvas.renderAll();
      updateLayers(fabricCanvas);
    }
  };

  const handleLayerLockToggle = (layerId: string) => {
    if (!fabricCanvas || layerId === 'background') return;
    
    const objects = fabricCanvas.getObjects() as ExtendedFabricObject[];
    const targetObject = objects.find(obj => obj.id === layerId);
    
    if (targetObject) {
      targetObject.selectable = !targetObject.selectable;
      targetObject.evented = !targetObject.evented;
      fabricCanvas.renderAll();
      updateLayers(fabricCanvas);
    }
  };

  const handleLayerDelete = (layerId: string) => {
    if (!fabricCanvas || layerId === 'background') return;
    
    const objects = fabricCanvas.getObjects() as ExtendedFabricObject[];
    const targetObject = objects.find(obj => obj.id === layerId);
    
    if (targetObject) {
      fabricCanvas.remove(targetObject);
      fabricCanvas.renderAll();
      updateLayers(fabricCanvas);
      toast.success("Layer deleted!");
    }
  };

  const handleLayerRename = (layerId: string, newName: string) => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects() as ExtendedFabricObject[];
    const targetObject = objects.find(obj => obj.id === layerId);
    
    if (targetObject) {
      targetObject.name = newName;
      updateLayers(fabricCanvas);
    }
  };
  
  // Properties panel handlers
  const handlePropertyChange = (property: string, value: any) => {
    if (!fabricCanvas || !selectedObject) return;
    
    selectedObject.set(property, value);
    fabricCanvas.renderAll();
    updateLayers(fabricCanvas);
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
        onRedo={handleRedo}
        onClear={handleClear}
        onShowTemplates={handleShowTemplates}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomToFit={handleZoomToFit}
        onZoomActualSize={handleZoomActualSize}
        onBack={handleBackToStart}
        onClose={handleClose}
        zoom={zoom}
      />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Tools Panel */}
        <ToolsPanel
          activeTool={activeTool}
          activeColor={activeColor}
          brushConfig={brushConfig}
          onToolChange={setActiveTool}
          onColorChange={setActiveColor}
          onBrushConfigChange={setBrushConfig}
          onUpload={() => fileInputRef.current?.click()}
          onDownload={handleDownload}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onDeleteSelected={handleDeleteSelected}
        />
        
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-muted/20 min-w-0">
          <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full">
              <CardContent className="p-4 h-full overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Rulers */}
                  <div className="flex">
                    {/* Corner space */}
                    <div className="w-5 h-5 bg-muted border-b border-r border-border" />
                     {/* Horizontal ruler */}
                      <div className="flex-1 min-w-0 flex justify-center">
                        <RulerComponent
                          orientation="horizontal"
                          length={currentProject?.width || 800}
                          zoom={zoom}
                        />
                      </div>
                  </div>
                  
                  <div className="flex flex-1 min-h-0">
                     {/* Vertical ruler */}
                      <div className="flex-shrink-0 flex items-center">
                        <RulerComponent
                          orientation="vertical"
                          length={currentProject?.height || 600}
                          zoom={zoom}
                        />
                      </div>
                    
                    {/* Canvas container with proper aspect ratio */}
                    <div className="flex-1 flex items-center justify-center bg-muted/10 min-w-0 min-h-0">
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
                          backgroundPosition: currentProject?.background === "transparent" ? "0 0, 0 10px, 10px -10px, -10px 0px" : "0 0",
                          aspectRatio: currentProject ? `${currentProject.width} / ${currentProject.height}` : "16 / 9",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          width: "fit-content",
                          height: "fit-content"
                        }}
                      >
                        <canvas 
                          ref={canvasRef} 
                          className="block"
                          style={{ 
                            width: "100%",
                            height: "100%",
                            maxWidth: "100%",
                            maxHeight: "100%"
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Right Panels */}
        <div className={`${rightPanelCollapsed ? 'w-8' : 'w-80'} bg-background border-l flex flex-col transition-all duration-200`}>
          {/* Collapse Toggle */}
          <div className="flex justify-end p-2 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
              className="w-6 h-6 p-0"
            >
              {rightPanelCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
          
          {!rightPanelCollapsed && (
            <>
              {/* Brush Settings - Only show when draw tool is active */}
              {activeTool === "draw" && (
                <div className="border-b">
                  <BrushSettings
                    config={brushConfig}
                    onChange={setBrushConfig}
                    color={activeColor}
                    onColorChange={setActiveColor}
                  />
                </div>
              )}
              
              {/* Properties Panel */}
              <div className="flex-1 border-b">
                <PropertiesPanel
                  selectedObject={selectedObject}
                  onPropertyChange={handlePropertyChange}
                />
              </div>
              
              {/* Layers Panel */}
              <div className="flex-1">
                <LayersPanel
                  layers={layers}
                  selectedLayer={selectedLayer}
                  onLayerSelect={handleLayerSelect}
                  onLayerVisibilityToggle={handleLayerVisibilityToggle}
                  onLayerLockToggle={handleLayerLockToggle}
                  onLayerDelete={handleLayerDelete}
                  onLayerRename={handleLayerRename}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

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