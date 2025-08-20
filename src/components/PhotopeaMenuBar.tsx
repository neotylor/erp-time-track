import React, { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
}) => {
  return (
    <Menubar className="rounded-none border-b bg-background">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onNewProject}>New...</MenubarItem>
          <MenubarItem onClick={onOpenFile}>Open</MenubarItem>
          <MenubarItem>Open recent</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onShowTemplates}>Templates</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onSave}>Save</MenubarItem>
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
          <MenubarItem onClick={onUndo}>Undo</MenubarItem>
          <MenubarItem onClick={onRedo}>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
          <MenubarItem>Paste Special</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onClear}>Clear</MenubarItem>
          <MenubarItem>Fill</MenubarItem>
          <MenubarItem>Stroke</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Transform</MenubarItem>
          <MenubarItem>Free Transform</MenubarItem>
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
          <MenubarItem>All</MenubarItem>
          <MenubarItem>Deselect</MenubarItem>
          <MenubarItem>Reselect</MenubarItem>
          <MenubarItem>Inverse</MenubarItem>
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
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
          <MenubarItem>Fit on Screen</MenubarItem>
          <MenubarItem>Actual Pixels</MenubarItem>
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
  );
};

export default PhotopeaMenuBar;