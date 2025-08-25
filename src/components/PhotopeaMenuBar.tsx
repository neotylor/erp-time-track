import React, { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { ProjectConfig } from "./NewProjectDialog";

interface PhotopeaMenuBarProps {
  onNewProject: () => void;
  onOpenFile: () => void;
  onSave: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onShowTemplates: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomToFit?: () => void;
  onZoomActualSize?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  zoom?: number;
}

const PhotopeaMenuBar: React.FC<PhotopeaMenuBarProps> = ({
  onNewProject,
  onOpenFile,
  onSave,
  onExport,
  onUndo,
  onRedo,
  onClear,
  onShowTemplates,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onZoomActualSize,
  onBack,
  onClose,
  zoom = 1,
}) => {
  return (
    <div className="flex items-center border-b bg-background">
      {/* Back and Close buttons */}
      <div className="flex items-center gap-2 px-4">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 px-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 px-2"
          >
            <X className="w-4 h-4 mr-1" />
            Close
          </Button>
        )}
      </div>
      
      <Menubar className="rounded-none border-0 bg-transparent flex-1">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onNewProject}>New...<span className="ml-auto text-xs opacity-60">Ctrl+N</span></MenubarItem>
          <MenubarItem onClick={onOpenFile}>Open<span className="ml-auto text-xs opacity-60">Ctrl+O</span></MenubarItem>
          <MenubarItem>Open recent</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onShowTemplates}>Templates</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onSave}>Save<span className="ml-auto text-xs opacity-60">Ctrl+S</span></MenubarItem>
          <MenubarItem>Save as...</MenubarItem>
          <MenubarItem onClick={onExport}>Export as...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Close</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onUndo}>Undo<span className="ml-auto text-xs opacity-60">Ctrl+Z</span></MenubarItem>
          <MenubarItem onClick={onRedo}>Redo<span className="ml-auto text-xs opacity-60">Ctrl+Shift+Z</span></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Step Forward<span className="ml-auto text-xs opacity-60">Shift+Ctrl+Z</span></MenubarItem>
          <MenubarItem>Step Backward<span className="ml-auto text-xs opacity-60">Ctrl+Z</span></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Fade...<span className="ml-auto text-xs opacity-60">Shift+Ctrl+F</span></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut<span className="ml-auto text-xs opacity-60">Ctrl+X</span></MenubarItem>
          <MenubarItem>Copy<span className="ml-auto text-xs opacity-60">Ctrl+C</span></MenubarItem>
          <MenubarItem>Copy Merged<span className="ml-auto text-xs opacity-60">Shift+Ctrl+C</span></MenubarItem>
          <MenubarItem>Paste<span className="ml-auto text-xs opacity-60">Ctrl+V</span></MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onClear}>Clear<span className="ml-auto text-xs opacity-60">Delete</span></MenubarItem>
          <MenubarItem>Fill...<span className="ml-auto text-xs opacity-60">Shift+F5</span></MenubarItem>
          <MenubarItem>Stroke...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Content-Aware Scale</MenubarItem>
          <MenubarItem>Puppet Warp</MenubarItem>
          <MenubarItem>Perspective Warp</MenubarItem>
          <MenubarItem>Free Transform<span className="ml-auto text-xs opacity-60">Alt+Ctrl+T</span></MenubarItem>
          <MenubarItem>Transform</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Auto-Align</MenubarItem>
          <MenubarItem>Auto-Blend</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Assign Profile</MenubarItem>
          <MenubarItem>Convert to Profile</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Define New</MenubarItem>
          <MenubarItem>Preset Manager...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Preferences...<span className="ml-auto text-xs opacity-60">Ctrl+K</span></MenubarItem>
          <MenubarItem>Local Storage...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Image</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Mode</MenubarItem>
          <MenubarItem>Adjustments</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Image Size...</MenubarItem>
          <MenubarItem>Canvas Size...</MenubarItem>
          <MenubarItem>Image Rotation</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Crop</MenubarItem>
          <MenubarItem>Trim</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Duplicate</MenubarItem>
          <MenubarItem>Apply Image...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Layer</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Duplicate Layer</MenubarItem>
          <MenubarItem>Delete Layer</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Layer Properties...</MenubarItem>
          <MenubarItem>Layer Style</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Add Layer Mask</MenubarItem>
          <MenubarItem>Delete Layer Mask</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Group Layers</MenubarItem>
          <MenubarItem>Ungroup Layers</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Arrange</MenubarItem>
          <MenubarItem>Align</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Select</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>All<span className="ml-auto text-xs opacity-60">Ctrl+A</span></MenubarItem>
          <MenubarItem>Deselect<span className="ml-auto text-xs opacity-60">Ctrl+D</span></MenubarItem>
          <MenubarItem>Reselect<span className="ml-auto text-xs opacity-60">Shift+Ctrl+D</span></MenubarItem>
          <MenubarItem>Inverse<span className="ml-auto text-xs opacity-60">Shift+Ctrl+I</span></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Color Range...</MenubarItem>
          <MenubarItem>Refine Edge...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Modify</MenubarItem>
          <MenubarItem>Grow</MenubarItem>
          <MenubarItem>Similar</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Save Selection...</MenubarItem>
          <MenubarItem>Load Selection...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Filter</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Last Filter</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Blur</MenubarItem>
          <MenubarItem>Distort</MenubarItem>
          <MenubarItem>Noise</MenubarItem>
          <MenubarItem>Pixelate</MenubarItem>
          <MenubarItem>Render</MenubarItem>
          <MenubarItem>Sharpen</MenubarItem>
          <MenubarItem>Stylize</MenubarItem>
          <MenubarItem>Other</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Proof Setup</MenubarItem>
          <MenubarItem>Proof Colors</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onZoomIn}>Zoom In<span className="ml-auto text-xs opacity-60">Ctrl+=</span></MenubarItem>
          <MenubarItem onClick={onZoomOut}>Zoom Out<span className="ml-auto text-xs opacity-60">Ctrl+-</span></MenubarItem>
          <MenubarItem onClick={onZoomToFit}>Fit on Screen<span className="ml-auto text-xs opacity-60">Ctrl+0</span></MenubarItem>
          <MenubarItem onClick={onZoomActualSize}>Actual Pixels<span className="ml-auto text-xs opacity-60">Ctrl+1</span></MenubarItem>
          <MenubarItem>Zoom: {Math.round(zoom * 100)}%</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Show</MenubarItem>
          <MenubarItem>Snap</MenubarItem>
          <MenubarItem>Lock Guides</MenubarItem>
          <MenubarItem>Clear Guides</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>New Guide...</MenubarItem>
          <MenubarItem>Lock Slices</MenubarItem>
          <MenubarItem>Clear Slices</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Window</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Minimize</MenubarItem>
          <MenubarItem>Zoom</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Actions</MenubarItem>
          <MenubarItem>Brushes</MenubarItem>
          <MenubarItem>Channels</MenubarItem>
          <MenubarItem>Character</MenubarItem>
          <MenubarItem>Color</MenubarItem>
          <MenubarItem>History</MenubarItem>
          <MenubarItem>Info</MenubarItem>
          <MenubarItem>Layers</MenubarItem>
          <MenubarItem>Navigator</MenubarItem>
          <MenubarItem>Options</MenubarItem>
          <MenubarItem>Paragraph</MenubarItem>
          <MenubarItem>Paths</MenubarItem>
          <MenubarItem>Swatches</MenubarItem>
          <MenubarItem>Tool Presets</MenubarItem>
          <MenubarItem>Tools</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>More</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Generate with AI</MenubarItem>
          <MenubarItem>Photopea Premium</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Keyboard Shortcuts</MenubarItem>
          <MenubarItem>Extensions</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About Photopea</MenubarItem>
          <MenubarItem>Help</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    
    {/* Zoom indicator */}
    <div className="px-4 text-sm text-muted-foreground">
      {Math.round(zoom * 100)}%
    </div>
  </div>
  );
};

export default PhotopeaMenuBar;