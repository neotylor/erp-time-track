import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";

interface PropertiesPanelProps {
  selectedObject: any;
  onPropertyChange: (property: string, value: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedObject,
  onPropertyChange,
}) => {
  if (!selectedObject) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground text-sm py-8">
            Select an object to view properties
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4" />
          Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Transform */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Transform</Label>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.left || 0)}
                onChange={(e) => onPropertyChange('left', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                value={Math.round(selectedObject.top || 0)}
                onChange={(e) => onPropertyChange('top', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <Input
                type="number"
                value={Math.round((selectedObject.width * selectedObject.scaleX) || 0)}
                onChange={(e) => onPropertyChange('width', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                value={Math.round((selectedObject.height * selectedObject.scaleY) || 0)}
                onChange={(e) => onPropertyChange('height', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">Rotation: {Math.round(selectedObject.angle || 0)}°</Label>
            <Slider
              value={[selectedObject.angle || 0]}
              onValueChange={([value]) => onPropertyChange('angle', value)}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Appearance */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Appearance</Label>
          
          <div className="space-y-1">
            <Label className="text-xs">Opacity: {Math.round((selectedObject.opacity || 1) * 100)}%</Label>
            <Slider
              value={[(selectedObject.opacity || 1) * 100]}
              onValueChange={([value]) => onPropertyChange('opacity', value / 100)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          {selectedObject.fill && (
            <div className="space-y-1">
              <Label className="text-xs">Fill Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  value={selectedObject.fill}
                  onChange={(e) => onPropertyChange('fill', e.target.value)}
                  className="w-12 h-8 p-1 border rounded"
                />
                <Input
                  value={selectedObject.fill}
                  onChange={(e) => onPropertyChange('fill', e.target.value)}
                  className="flex-1 h-8"
                />
              </div>
            </div>
          )}
          
          {selectedObject.stroke && (
            <>
              <div className="space-y-1">
                <Label className="text-xs">Stroke Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={selectedObject.stroke}
                    onChange={(e) => onPropertyChange('stroke', e.target.value)}
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    value={selectedObject.stroke}
                    onChange={(e) => onPropertyChange('stroke', e.target.value)}
                    className="flex-1 h-8"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Stroke Width</Label>
                <Input
                  type="number"
                  value={selectedObject.strokeWidth || 0}
                  onChange={(e) => onPropertyChange('strokeWidth', parseInt(e.target.value))}
                  className="h-8"
                />
              </div>
            </>
          )}
        </div>
        
        <Separator />
        
        {/* Blend Mode */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Blend Mode</Label>
          <Select 
            value={selectedObject.globalCompositeOperation || "source-over"} 
            onValueChange={(value) => onPropertyChange('globalCompositeOperation', value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="source-over">Normal</SelectItem>
              <SelectItem value="multiply">Multiply</SelectItem>
              <SelectItem value="screen">Screen</SelectItem>
              <SelectItem value="overlay">Overlay</SelectItem>
              <SelectItem value="soft-light">Soft Light</SelectItem>
              <SelectItem value="hard-light">Hard Light</SelectItem>
              <SelectItem value="color-dodge">Color Dodge</SelectItem>
              <SelectItem value="color-burn">Color Burn</SelectItem>
              <SelectItem value="darken">Darken</SelectItem>
              <SelectItem value="lighten">Lighten</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;