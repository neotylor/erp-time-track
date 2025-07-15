
import React from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/note';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotesListProps {
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
}

const colorStyles = {
  default: 'border-l-gray-300 bg-white',
  blue: 'border-l-blue-400 bg-blue-50',
  green: 'border-l-green-400 bg-green-50',
  yellow: 'border-l-yellow-400 bg-yellow-50',
  red: 'border-l-red-400 bg-red-50',
  purple: 'border-l-purple-400 bg-purple-50',
  pink: 'border-l-pink-400 bg-pink-50'
};

const NoteCard = ({ 
  note, 
  isSelected, 
  onSelect, 
  onDelete, 
  onToggleFavorite 
}: { 
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}) => {
  const timeAgo = formatDistanceToNow(new Date(note.updated_at), { addSuffix: true });
  const preview = note.content.replace(/[#*`]/g, '').slice(0, 100);

  return (
    <div
      className={`
        p-4 border-l-4 cursor-pointer transition-all hover:shadow-sm
        ${colorStyles[note.color_label]}
        ${isSelected ? 'ring-2 ring-blue-200' : ''}
      `}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 truncate flex-1 mr-2">
          {note.title}
        </h3>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="h-6 w-6 p-0"
          >
            <Heart 
              className={`h-3 w-3 ${note.is_favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {preview && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {preview}...
        </p>
      )}
      
      <p className="text-xs text-gray-400">
        {timeAgo}
      </p>
    </div>
  );
};

const NotesList = ({ selectedNoteId, onSelectNote }: NotesListProps) => {
  const { notes, loading, updateNote, deleteNote } = useNotes();

  const handleToggleFavorite = async (note: Note) => {
    await updateNote(note.id, { is_favorited: !note.is_favorited });
  };

  const handleDelete = async (noteId: string) => {
    if (selectedNoteId === noteId) {
      onSelectNote('');
    }
    await deleteNote(noteId);
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading notes...
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="text-4xl mb-2">📝</div>
        <p>No notes yet</p>
        <p className="text-xs mt-1">Create your first note to get started</p>
      </div>
    );
  }

  // Sort notes: favorites first, then by updated_at
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_favorited !== b.is_favorited) {
      return a.is_favorited ? -1 : 1;
    }
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1">
        {sortedNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isSelected={selectedNoteId === note.id}
            onSelect={() => onSelectNote(note.id)}
            onDelete={() => handleDelete(note.id)}
            onToggleFavorite={() => handleToggleFavorite(note)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotesList;
