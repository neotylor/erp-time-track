
export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoFilter {
  priority?: 'high' | 'medium' | 'low';
  sortBy: 'date' | 'priority' | 'created';
  showCompleted: boolean;
}
