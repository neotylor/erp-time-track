
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Target } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TodoInputProps {
  onAddTodo: (title: string, description?: string, priority?: 'high' | 'medium' | 'low', dueDate?: Date) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTodo(title.trim(), description.trim() || undefined, priority, dueDate);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(undefined);
      setIsExpanded(false);
    }
  };

  const priorityColors = {
    high: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    low: 'text-green-600 bg-green-50 dark:bg-green-900/20'
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          What's on your plate today?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a task to conquer..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
              onFocus={() => setIsExpanded(true)}
            />
            <Button type="submit" disabled={!title.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {isExpanded && (
            <div className="space-y-4 animate-fade-in">
              <Textarea
                placeholder="Add details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={priority} onValueChange={(value: 'high' | 'medium' | 'low') => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", priorityColors.high)} />
                          High Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", priorityColors.medium)} />
                          Medium Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", priorityColors.low)} />
                          Low Priority
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!title.trim()}>
                  Add Task
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TodoInput;
