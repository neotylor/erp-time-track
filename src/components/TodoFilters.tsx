
import React from 'react';
import { TodoFilter } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, SortAsc, Eye, EyeOff } from 'lucide-react';

interface TodoFiltersProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  activeTodosCount: number;
  completedTodosCount: number;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ 
  filter, 
  onFilterChange, 
  activeTodosCount, 
  completedTodosCount 
}) => {
  const handleSortChange = (sortBy: 'date' | 'priority' | 'created') => {
    onFilterChange({ ...filter, sortBy });
  };

  const handlePriorityFilter = (priority?: 'high' | 'medium' | 'low') => {
    onFilterChange({ ...filter, priority });
  };

  const toggleShowCompleted = () => {
    onFilterChange({ ...filter, showCompleted: !filter.showCompleted });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters & Sort</span>
          </div>
          
          <div className="flex flex-wrap gap-2 flex-1">
            <Select value={filter.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[140px]">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="created">Created</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant={filter.priority === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => handlePriorityFilter(undefined)}
              >
                All
              </Button>
              <Button
                variant={filter.priority === 'high' ? "destructive" : "outline"}
                size="sm"
                onClick={() => handlePriorityFilter('high')}
              >
                High
              </Button>
              <Button
                variant={filter.priority === 'medium' ? "default" : "outline"}
                size="sm"
                onClick={() => handlePriorityFilter('medium')}
                className={filter.priority === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                Medium
              </Button>
              <Button
                variant={filter.priority === 'low' ? "default" : "outline"}
                size="sm"
                onClick={() => handlePriorityFilter('low')}
                className={filter.priority === 'low' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                Low
              </Button>
            </div>

            <Button
              variant={filter.showCompleted ? "default" : "outline"}
              size="sm"
              onClick={toggleShowCompleted}
            >
              {filter.showCompleted ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              Completed
            </Button>
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary">
              {activeTodosCount} Active
            </Badge>
            <Badge variant="outline">
              {completedTodosCount} Done
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoFilters;
