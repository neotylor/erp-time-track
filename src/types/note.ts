
export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  color_label: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink';
  is_favorited: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteData {
  title?: string;
  content?: string;
  color_label?: Note['color_label'];
  is_favorited?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  color_label?: Note['color_label'];
  is_favorited?: boolean;
}
