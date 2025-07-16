
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Note, CreateNoteData, UpdateNoteData } from '@/types/note';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useNotes = () => {
  const { user, isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('all');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('taskflow-notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          created_at: note.created_at || new Date().toISOString(),
          updated_at: note.updated_at || new Date().toISOString(),
          color_label: (note.color_label as Note['color_label']) || 'default'
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing saved notes:', error);
      }
    }
  }, []);

  // Fetch notes from Supabase when authenticated
  const fetchNotesFromServer = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const transformedNotes: Note[] = (data || []).map(note => ({
        ...note,
        color_label: (note.color_label as Note['color_label']) || 'default'
      })) as Note[];
      
      // Merge server notes with local notes, server takes precedence
      const localNotes = JSON.parse(localStorage.getItem('taskflow-notes') || '[]');
      const mergedNotes = [...transformedNotes];
      
      // Add local-only notes that don't exist on server
      localNotes.forEach((localNote: Note) => {
        if (!transformedNotes.find(serverNote => serverNote.id === localNote.id)) {
          mergedNotes.push(localNote);
        }
      });
      
      setNotes(mergedNotes);
      localStorage.setItem('taskflow-notes', JSON.stringify(mergedNotes));
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to sync notes from server');
    } finally {
      setLoading(false);
    }
  };

  // Sync with server when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotesFromServer();
    }
  }, [isAuthenticated]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('taskflow-notes', JSON.stringify(notes));
  }, [notes]);

  // Create a new note
  const createNote = async (noteData: CreateNoteData = {}) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      user_id: user?.id || 'local-user',
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      color_label: noteData.color_label || 'default',
      is_favorited: noteData.is_favorited || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to local state first
    setNotes(prev => [newNote, ...prev]);
    
    // Sync to server if authenticated
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('notes')
          .insert([{
            id: newNote.id,
            user_id: user!.id,
            title: newNote.title,
            content: newNote.content,
            color_label: newNote.color_label,
            is_favorited: newNote.is_favorited
          }]);

        if (error) throw error;
        toast.success('Note created and synced');
      } catch (error) {
        console.error('Error syncing note to server:', error);
        toast.success('Note created locally (will sync when online)');
      }
    } else {
      toast.success('Note created locally');
    }
    
    return newNote;
  };

  // Update a note
  const updateNote = async (id: string, updates: UpdateNoteData) => {
    const updatedNote = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Update local state first
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updatedNote } : note
    ));

    // Sync to server if authenticated
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('notes')
          .update(updatedNote)
          .eq('id', id);

        if (error) throw error;
        toast.success('Note updated and synced');
      } catch (error) {
        console.error('Error syncing note update to server:', error);
        toast.success('Note updated locally (will sync when online)');
      }
    } else {
      toast.success('Note updated locally');
    }
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    // Remove from local state first
    setNotes(prev => prev.filter(note => note.id !== id));

    // Remove from server if authenticated
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Note deleted and synced');
      } catch (error) {
        console.error('Error syncing note deletion to server:', error);
        toast.success('Note deleted locally (will sync when online)');
      }
    } else {
      toast.success('Note deleted locally');
    }
  };

  // Filter notes based on search and color
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesColor = selectedColor === 'all' || note.color_label === selectedColor;
    
    return matchesSearch && matchesColor;
  });

  return {
    notes: filteredNotes,
    loading,
    searchQuery,
    setSearchQuery,
    selectedColor,
    setSelectedColor,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotesFromServer,
    isAuthenticated
  };
};
