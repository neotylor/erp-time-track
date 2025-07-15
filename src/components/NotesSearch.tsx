
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotes } from '@/hooks/useNotes';
import { Search } from 'lucide-react';

const colorLabels = [
  { value: 'all', label: 'All Colors' },
  { value: 'default', label: 'Default' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'red', label: 'Red' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' }
];

const NotesSearch = () => {
  const { searchQuery, setSearchQuery, selectedColor, setSelectedColor } = useNotes();

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/80"
        />
      </div>
      
      <Select value={selectedColor} onValueChange={setSelectedColor}>
        <SelectTrigger className="bg-white/80">
          <SelectValue placeholder="Filter by color" />
        </SelectTrigger>
        <SelectContent>
          {colorLabels.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              {color.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NotesSearch;
