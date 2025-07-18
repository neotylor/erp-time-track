
import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/note';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Heart, Palette, Save } from 'lucide-react';

interface NoteEditorProps {
  noteId: string;
  onClose: () => void;
}

const colorOptions = [
  { value: 'default', label: 'Default', class: 'bg-gray-100' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-100' },
  { value: 'green', label: 'Green', class: 'bg-green-100' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-100' },
  { value: 'red', label: 'Red', class: 'bg-red-100' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-100' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-100' }
];

const NoteEditor = ({ noteId, onClose }: NoteEditorProps) => {
  const { notes, updateNote } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [colorLabel, setColorLabel] = useState<Note['color_label']>('default');
  const [isFavorited, setIsFavorited] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize note data when noteId changes
  useEffect(() => {
    const foundNote = notes.find(n => n.id === noteId);
    if (foundNote) {
      setNote(foundNote);
      setTitle(foundNote.title);
      setContent(foundNote.content);
      setColorLabel(foundNote.color_label);
      setIsFavorited(foundNote.is_favorited);
      setHasUnsavedChanges(false);
    }
  }, [noteId, notes]);

  // Track changes
  useEffect(() => {
    if (!note) return;
    
    const hasChanges = 
      title !== note.title ||
      content !== note.content ||
      colorLabel !== note.color_label ||
      isFavorited !== note.is_favorited;

    setHasUnsavedChanges(hasChanges);
  }, [title, content, colorLabel, isFavorited, note]);

  const handleSave = async () => {
    if (!note || !hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await updateNote(note.id, {
        title: title || 'Untitled Note',
        content,
        color_label: colorLabel,
        is_favorited: isFavorited
      }, true); // Show toast on manual save
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="animate-pulse">Loading note...</div>
      </div>
    );
  }

  const selectedColorOption = colorOptions.find(option => option.value === colorLabel);

  return (
    <div className={`h-full flex flex-col ${selectedColorOption?.class || 'bg-white'}`} onKeyDown={handleKeyDown}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 lg:p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2 lg:space-x-4 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className="gap-2"
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            <span className="hidden sm:inline">{isFavorited ? 'Favorited' : 'Favorite'}</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-500" />
            <Select value={colorLabel} onValueChange={(value: Note['color_label']) => setColorLabel(value)}>
              <SelectTrigger className="w-24 lg:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${option.class} border`} />
                      <span className="hidden lg:inline">{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            size="sm"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save' : 'Saved'}
            </span>
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col p-4 lg:p-6 space-y-4 overflow-hidden">
        <Input
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg lg:text-xl font-semibold bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Textarea
          placeholder="Start writing your note... You can use markdown formatting like **bold**, *italic*, and # headings"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 resize-none bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm lg:text-base leading-relaxed min-h-0"
        />
      </div>

      {/* Footer */}
      <div className="p-3 lg:p-4 bg-white/60 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p>💡 <strong>Markdown supported:</strong> Use **bold**, *italic*, # headings, - lists</p>
          <p className="text-right">Ctrl+S to save</p>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
