
import React, { useState } from 'react';
import { TodoItem as TodoItemType } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit2, Trash2, Calendar as CalendarIcon, Clock, Save, X } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TodoItemType>) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(todo.dueDate);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority,
        dueDate: editDueDate
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate);
    setIsEditing(false);
  };

  const priorityColors = {
    high: 'bg-red-500 text-red-50',
    medium: 'bg-yellow-500 text-yellow-50',
    low: 'bg-green-500 text-green-50'
  };

  const getDueDateDisplay = () => {
    if (!todo.dueDate) return null;
    
    if (isToday(todo.dueDate)) {
      return <Badge variant="outline" className="text-blue-600">Today</Badge>;
    }
    if (isTomorrow(todo.dueDate)) {
      return <Badge variant="outline" className="text-green-600">Tomorrow</Badge>;
    }
    if (isPast(todo.dueDate)) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    return <Badge variant="outline">{format(todo.dueDate, 'MMM d')}</Badge>;
  };

  if (isEditing) {
    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title"
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
              className="min-h-[60px]"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={editPriority} onValueChange={(value: 'high' | 'medium' | 'low') => setEditPriority(value)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-[150px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editDueDate ? format(editDueDate, "MMM d") : "Due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editDueDate}
                    onSelect={setEditDueDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "mb-3 transition-all duration-200",
      todo.completed ? "opacity-60" : "hover:shadow-md"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className={cn(
                  "font-medium",
                  todo.completed && "line-through text-muted-foreground"
                )}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={cn(
                    "text-sm text-muted-foreground mt-1",
                    todo.completed && "line-through"
                  )}>
                    {todo.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={priorityColors[todo.priority]} variant="secondary">
                  {todo.priority}
                </Badge>
                {getDueDateDisplay()}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Created {format(todo.createdAt, 'MMM d, yyyy')}</span>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(todo.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
