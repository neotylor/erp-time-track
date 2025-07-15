
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Note, CreateNoteData, UpdateNoteData } from '@/types/note';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('all');

  // Fetch notes from Supabase
  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Note type
      const transformedNotes: Note[] = (data || []).map(note => ({
        ...note,
        color_label: (note.color_label as Note['color_label']) || 'default'
      }));
      
      setNotes(transformedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  // Create a new note
  const createNote = async (noteData: CreateNoteData = {}) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          title: noteData.title || 'Untitled Note',
          content: noteData.content || '',
          color_label: noteData.color_label || 'default',
          is_favorited: noteData.is_favorited || false
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Transform the data to match our Note type
      const transformedNote: Note = {
        ...data,
        color_label: (data.color_label as Note['color_label']) || 'default'
      };
      
      setNotes(prev => [transformedNote, ...prev]);
      toast.success('Note created successfully');
      return transformedNote;
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
      return null;
    }
  };

  // Update a note
  const updateNote = async (id: string, updates: UpdateNoteData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform the data to match our Note type
      const transformedNote: Note = {
        ...data,
        color_label: (data.color_label as Note['color_label']) || 'default'
      };

      setNotes(prev => prev.map(note => 
        note.id === id ? transformedNote : note
      ));
      
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
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

  useEffect(() => {
    fetchNotes();
  }, [user]);

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
    refetch: fetchNotes
  };
};
