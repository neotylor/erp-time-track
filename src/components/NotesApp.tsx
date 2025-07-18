
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import NoteEditor from './NoteEditor';
import NotesList from './NotesList';
import NotesSearch from './NotesSearch';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NotesApp = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { createNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleCreateNote = async () => {
    const note = await createNote();
    if (note) {
      setSelectedNoteId(note.id);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setSelectedNoteId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            <Button onClick={handleCreateNote} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">
                    {user?.user_metadata?.full_name || user?.email}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="text-sm text-gray-600">
                Notes saved locally - Sign in to sync across devices
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <NotesSearch />
          </div>
          <div className="flex-1 overflow-hidden">
            <NotesList 
              selectedNoteId={selectedNoteId}
              onSelectNote={setSelectedNoteId}
            />
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 bg-white">
          {selectedNoteId ? (
            <NoteEditor 
              noteId={selectedNoteId}
              onClose={() => setSelectedNoteId(null)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-xl font-medium mb-2">Select a note to start writing</h2>
                <p className="text-sm">Create a new note or choose from your existing notes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
