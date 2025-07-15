
import React, { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/note';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Heart, Palette } from 'lucide-react';

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

  useEffect(() => {
    const foundNote = notes.find(n => n.id === noteId);
    if (foundNote) {
      setNote(foundNote);
      setTitle(foundNote.title);
      setContent(foundNote.content);
      setColorLabel(foundNote.color_label);
      setIsFavorited(foundNote.is_favorited);
    }
  }, [noteId, notes]);

  useEffect(() => {
    if (!note) return;

    const timeoutId = setTimeout(() => {
      const hasChanges = 
        title !== note.title ||
        content !== note.content ||
        colorLabel !== note.color_label ||
        isFavorited !== note.is_favorited;

      if (hasChanges) {
        updateNote(note.id, {
          title: title || 'Untitled Note',
          content,
          color_label: colorLabel,
          is_favorited: isFavorited
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [title, content, colorLabel, isFavorited, note, updateNote]);

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Loading note...
      </div>
    );
  }

  const selectedColorOption = colorOptions.find(option => option.value === colorLabel);

  return (
    <div className={`h-full flex flex-col ${selectedColorOption?.class || 'bg-white'}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className="gap-2"
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            {isFavorited ? 'Favorited' : 'Add to Favorites'}
          </Button>

          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-500" />
            <Select value={colorLabel} onValueChange={(value: Note['color_label']) => setColorLabel(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${option.class} border`} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col p-6 space-y-4">
        <Input
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Textarea
          placeholder="Start writing your note... You can use markdown formatting like **bold**, *italic*, and # headings"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 resize-none bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base leading-relaxed"
        />
      </div>

      {/* Markdown Help */}
      <div className="p-4 bg-white/60 border-t border-gray-200 text-xs text-gray-500">
        <p>💡 <strong>Markdown supported:</strong> Use **bold**, *italic*, # headings, - lists, and more</p>
      </div>
    </div>
  );
};

export default NoteEditor;
