
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import NoteEditor from './NoteEditor';
import NotesList from './NotesList';
import NotesSearch from './NotesSearch';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, User, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NotesApp = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { createNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleCreateNote = async () => {
    const note = await createNote();
    if (note) {
      setSelectedNoteId(note.id);
      // Close sidebar on mobile after creating note
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setSelectedNoteId(null);
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    // Close sidebar on mobile after selecting note
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Notes</h1>
            
            <Button onClick={handleCreateNote} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Note</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="hidden md:flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600 hidden lg:inline">
                    {user?.user_metadata?.full_name || user?.email}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="text-xs lg:text-sm text-gray-600 max-w-48 lg:max-w-none">
                Notes saved locally - Sign in to sync
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative z-50 lg:z-auto
          w-80 lg:w-80 h-full
          bg-white/90 lg:bg-white/60 backdrop-blur-sm 
          border-r border-gray-200 
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${!sidebarOpen && 'lg:w-16'}
        `}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen && <NotesSearch />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex ml-auto"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Notes List */}
          <div className="flex-1 overflow-hidden">
            <NotesList 
              selectedNoteId={selectedNoteId}
              onSelectNote={handleSelectNote}
              collapsed={!sidebarOpen}
            />
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 bg-white overflow-hidden">
          {selectedNoteId ? (
            <NoteEditor 
              noteId={selectedNoteId}
              onClose={() => setSelectedNoteId(null)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 p-4">
              <div className="text-center">
                <div className="text-4xl lg:text-6xl mb-4">📝</div>
                <h2 className="text-lg lg:text-xl font-medium mb-2">Select a note to start writing</h2>
                <p className="text-sm text-center">Create a new note or choose from your existing notes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
