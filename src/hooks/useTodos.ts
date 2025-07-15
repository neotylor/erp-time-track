
import { useState, useEffect } from 'react';
import { TodoItem, TodoFilter } from '@/types/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<TodoFilter>({
    sortBy: 'date',
    showCompleted: false
  });

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('taskflow-todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Error parsing saved todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('taskflow-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, description?: string, priority: 'high' | 'medium' | 'low' = 'medium', dueDate?: Date) => {
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date() }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter.priority && todo.priority !== filter.priority) return false;
    if (!filter.showCompleted && todo.completed) return false;
    return true;
  });

  const sortedTodos = filteredTodos.sort((a, b) => {
    switch (filter.sortBy) {
      case 'date':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'created':
        return b.createdAt.getTime() - a.createdAt.getTime();
      default:
        return 0;
    }
  });

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return {
    todos: sortedTodos,
    completedTodos,
    activeTodos,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete
  };
};
