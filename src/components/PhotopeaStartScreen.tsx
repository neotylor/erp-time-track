import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  FolderOpen, 
  FileImage, 
  Sparkles,
  Palette
} from "lucide-react";

interface PhotopeaStartScreenProps {
  onNewProject: () => void;
  onOpenFile: () => void;
  onTemplates: () => void;
  onGenerateAI?: () => void;
}

const PhotopeaStartScreen: React.FC<PhotopeaStartScreenProps> = ({
  onNewProject,
  onOpenFile,
  onTemplates,
  onGenerateAI,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mr-4">
            <Palette className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Photo Art Editor</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Professional photo editing and design tool
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Button
          variant="outline"
          size="lg"
          onClick={onNewProject}
          className="h-16 w-48 flex flex-col items-center gap-2"
        >
          <FileImage className="h-6 w-6" />
          New Project
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onOpenFile}
          className="h-16 w-48 flex flex-col items-center gap-2"
        >
          <Upload className="h-6 w-6" />
          Open From Computer
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Button
          variant="outline"
          size="lg"
          onClick={onTemplates}
          className="h-16 w-48 flex flex-col items-center gap-2"
        >
          <FolderOpen className="h-6 w-6" />
          Templates
        </Button>
        
        {onGenerateAI && (
          <Button
            variant="outline"
            size="lg"
            onClick={onGenerateAI}
            className="h-16 w-48 flex flex-col items-center gap-2"
          >
            <Sparkles className="h-6 w-6" />
            Generate with AI
          </Button>
        )}
      </div>

      {/* Drop zone */}
      <Card className="w-full max-w-2xl mt-12 border-2 border-dashed border-muted-foreground/25">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Drop any files here</p>
        </CardContent>
      </Card>

      {/* File format indicators */}
      <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
            PSD
          </div>
          <span>PSD</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
            AI
          </div>
          <span>AI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-pink-500 rounded text-white text-xs flex items-center justify-center font-bold">
            XD
          </div>
          <span>XD</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
            FIG
          </div>
          <span>FIG</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-yellow-600 rounded text-white text-xs flex items-center justify-center font-bold">
            PDF
          </div>
          <span>PDF</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-gray-600 rounded text-white text-xs flex items-center justify-center font-bold">
            RAW
          </div>
          <span>RAW</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-gray-800 rounded text-white text-xs flex items-center justify-center font-bold">
            ANY
          </div>
          <span>JPG PNG TIFF SVG DDS</span>
        </div>
      </div>
    </div>
  );
};

export default PhotopeaStartScreen;