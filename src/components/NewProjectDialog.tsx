import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (config: ProjectConfig) => void;
}

export interface ProjectConfig {
  name: string;
  width: number;
  height: number;
  dpi: number;
  background: string;
  colorProfile: string;
  unit: "px" | "inches" | "cm";
}

const templates = [
  { name: "FB Page Cover", width: 1640, height: 664, category: "Social" },
  { name: "FB Event Image", width: 1920, height: 1080, category: "Social" },
  { name: "FB Group Header", width: 1640, height: 856, category: "Social" },
  { name: "Instagram", width: 1080, height: 1080, category: "Social" },
  { name: "Insta Story", width: 1080, height: 1920, category: "Social" },
  { name: "Insta Portrait", width: 1080, height: 1350, category: "Social" },
  { name: "Youtube Thumbnail", width: 1280, height: 720, category: "Social" },
  { name: "Youtube Profile", width: 800, height: 800, category: "Social" },
  { name: "Youtube Cover", width: 2560, height: 1440, category: "Social" },
  { name: "Twitter Profile", width: 400, height: 400, category: "Social" },
  { name: "Twitter Header", width: 1500, height: 500, category: "Social" },
  { name: "A4 Print", width: 2480, height: 3508, category: "Print" },
  { name: "US Letter", width: 2550, height: 3300, category: "Print" },
  { name: "Business Card", width: 1050, height: 600, category: "Print" },
  { name: "HD Screen", width: 1920, height: 1080, category: "Screen" },
  { name: "4K Screen", width: 3840, height: 2160, category: "Screen" },
  { name: "Mobile Screen", width: 375, height: 812, category: "Mobile" },
];

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  open,
  onOpenChange,
  onCreateProject,
}) => {
  const [config, setConfig] = useState<ProjectConfig>({
    name: "New Project",
    width: 1596,
    height: 918,
    dpi: 72,
    background: "#ffffff",
    colorProfile: "sRGB",
    unit: "px",
  });

  const [selectedCategory, setSelectedCategory] = useState("Social");

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setConfig(prev => ({
      ...prev,
      width: template.width,
      height: template.height,
      name: template.name,
    }));
  };

  const handleCreate = () => {
    onCreateProject(config);
    onOpenChange(false);
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));
  const filteredTemplates = templates.filter(t => t.category === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-6">
          {/* Templates Section */}
          <div className="flex-1">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-4 w-full mb-4">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {filteredTemplates.map(template => (
                      <Card
                        key={template.name}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="w-full h-24 bg-muted rounded-md mb-2 flex items-center justify-center">
                            <div className="text-xs text-muted-foreground">
                              {template.width} × {template.height}
                            </div>
                          </div>
                          <div className="text-sm font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {template.width} × {template.height} px
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <Separator orientation="vertical" className="h-auto" />

          {/* Configuration Section */}
          <div className="w-80 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={config.width}
                  onChange={(e) => setConfig(prev => ({ ...prev, width: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={config.height}
                  onChange={(e) => setConfig(prev => ({ ...prev, height: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={config.unit}
                onValueChange={(value: ProjectConfig["unit"]) => 
                  setConfig(prev => ({ ...prev, unit: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="px">Pixels</SelectItem>
                  <SelectItem value="inches">Inches</SelectItem>
                  <SelectItem value="cm">Centimeters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dpi">DPI</Label>
              <Input
                id="dpi"
                type="number"
                value={config.dpi}
                onChange={(e) => setConfig(prev => ({ ...prev, dpi: Number(e.target.value) }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="background">Background</Label>
              <div className="flex gap-2 items-center flex-1">
                <Input
                  type="color"
                  value={config.background}
                  onChange={(e) => setConfig(prev => ({ ...prev, background: e.target.value }))}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Select
                  value={config.background === "#ffffff" ? "White" : config.background === "transparent" ? "Transparent" : "Custom"}
                  onValueChange={(value) => {
                    if (value === "White") setConfig(prev => ({ ...prev, background: "#ffffff" }));
                    else if (value === "Transparent") setConfig(prev => ({ ...prev, background: "transparent" }));
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="White">White</SelectItem>
                    <SelectItem value="Transparent">Transparent</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="profile">Profile</Label>
              <Select
                value={config.colorProfile}
                onValueChange={(value) => setConfig(prev => ({ ...prev, colorProfile: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sRGB">sRGB</SelectItem>
                  <SelectItem value="Adobe RGB">Adobe RGB</SelectItem>
                  <SelectItem value="ProPhoto RGB">ProPhoto RGB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreate} className="w-full" size="lg">
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;