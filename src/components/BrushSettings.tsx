import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Brush, Circle, Square, Paintbrush2 } from "lucide-react";

export interface BrushConfig {
  size: number;
  opacity: number;
  hardness: number;
  flow: number;
  type: "round" | "square" | "soft" | "calligraphy";
  blendMode: "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "hard-light";
}

interface BrushSettingsProps {
  config: BrushConfig;
  onChange: (config: BrushConfig) => void;
  color: string;
  onColorChange: (color: string) => void;
}

const BrushSettings: React.FC<BrushSettingsProps> = ({
  config,
  onChange,
  color,
  onColorChange,
}) => {
  const updateConfig = (updates: Partial<BrushConfig>) => {
    onChange({ ...config, ...updates });
  };

  const brushTypes = [
    { value: "round", label: "Round", icon: Circle },
    { value: "square", label: "Square", icon: Square },
    { value: "soft", label: "Soft Round", icon: Brush },
    { value: "calligraphy", label: "Calligraphy", icon: Paintbrush2 },
  ] as const;

  const blendModes = [
    { value: "normal", label: "Normal" },
    { value: "multiply", label: "Multiply" },
    { value: "screen", label: "Screen" },
    { value: "overlay", label: "Overlay" },
    { value: "soft-light", label: "Soft Light" },
    { value: "hard-light", label: "Hard Light" },
  ] as const;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brush className="h-4 w-4" />
          Brush Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color */}
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        <Separator />

        {/* Brush Type */}
        <div className="space-y-2">
          <Label>Brush Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {brushTypes.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={config.type === value ? "default" : "outline"}
                size="sm"
                onClick={() => updateConfig({ type: value })}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Size */}
        <div className="space-y-2">
          <Label>Size: {config.size}px</Label>
          <Slider
            value={[config.size]}
            onValueChange={([value]) => updateConfig({ size: value })}
            min={1}
            max={200}
            step={1}
            className="w-full"
          />
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <Label>Opacity: {Math.round(config.opacity * 100)}%</Label>
          <Slider
            value={[config.opacity * 100]}
            onValueChange={([value]) => updateConfig({ opacity: value / 100 })}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Hardness */}
        <div className="space-y-2">
          <Label>Hardness: {Math.round(config.hardness * 100)}%</Label>
          <Slider
            value={[config.hardness * 100]}
            onValueChange={([value]) => updateConfig({ hardness: value / 100 })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Flow */}
        <div className="space-y-2">
          <Label>Flow: {Math.round(config.flow * 100)}%</Label>
          <Slider
            value={[config.flow * 100]}
            onValueChange={([value]) => updateConfig({ flow: value / 100 })}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Blend Mode */}
        <div className="space-y-2">
          <Label>Blend Mode</Label>
          <Select value={config.blendMode} onValueChange={(value) => updateConfig({ blendMode: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {blendModes.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Brush Presets */}
        <div className="space-y-2">
          <Label>Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateConfig({
                size: 10,
                opacity: 1,
                hardness: 1,
                flow: 1,
                type: "round",
                blendMode: "normal"
              })}
            >
              Hard Round
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateConfig({
                size: 20,
                opacity: 0.8,
                hardness: 0.3,
                flow: 0.8,
                type: "soft",
                blendMode: "normal"
              })}
            >
              Soft Brush
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateConfig({
                size: 15,
                opacity: 0.6,
                hardness: 0.8,
                flow: 0.5,
                type: "round",
                blendMode: "multiply"
              })}
            >
              Pencil
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateConfig({
                size: 30,
                opacity: 0.3,
                hardness: 0.1,
                flow: 0.3,
                type: "soft",
                blendMode: "overlay"
              })}
            >
              Airbrush
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrushSettings;