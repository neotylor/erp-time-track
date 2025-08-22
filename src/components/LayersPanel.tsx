import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Eye, EyeOff, Lock, Unlock, Trash2 } from "lucide-react";
import { FabricObject } from "fabric";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  type: string;
}

interface LayersPanelProps {
  layers: Layer[];
  selectedLayer: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerLockToggle: (layerId: string) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerRename: (layerId: string, newName: string) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayer,
  onLayerSelect,
  onLayerVisibilityToggle,
  onLayerLockToggle,
  onLayerDelete,
  onLayerRename,
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Layers className="h-4 w-4" />
          Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`flex items-center gap-2 p-2 mx-2 rounded cursor-pointer hover:bg-muted/50 ${
                selectedLayer === layer.id ? "bg-muted" : ""
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              {/* Layer thumbnail/icon */}
              <div className="w-8 h-8 bg-muted rounded border flex items-center justify-center">
                <span className="text-xs font-mono">{layer.type.charAt(0).toUpperCase()}</span>
              </div>
              
              {/* Layer info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm truncate">{layer.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(layer.opacity * 100)}%
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {layer.type}
                </div>
              </div>
              
              {/* Layer controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerVisibilityToggle(layer.id);
                  }}
                >
                  {layer.visible ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerLockToggle(layer.id);
                  }}
                >
                  {layer.locked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Unlock className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerDelete(layer.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {layers.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No layers yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LayersPanel;