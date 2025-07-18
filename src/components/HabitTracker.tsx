import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Flame, Award, Calendar } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completions: Date[];
  created: Date;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      streak: 0,
      completions: [],
      created: new Date()
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabit = (habitId: string) => {
    const today = new Date().toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompletedToday = habit.completions.some(
          date => date.toDateString() === today
        );
        
        if (isCompletedToday) {
          // Remove today's completion
          return {
            ...habit,
            completions: habit.completions.filter(
              date => date.toDateString() !== today
            ),
            streak: Math.max(0, habit.streak - 1)
          };
        } else {
          // Add today's completion
          return {
            ...habit,
            completions: [...habit.completions, new Date()],
            streak: habit.streak + 1
          };
        }
      }
      return habit;
    }));
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toDateString();
    return habit.completions.some(date => date.toDateString() === today);
  };

  const getCalendarHeatmap = (habit: Habit) => {
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last30Days.push(date);
    }

    return last30Days.map((date, index) => {
      const isCompleted = habit.completions.some(
        completion => completion.toDateString() === date.toDateString()
      );
      
      return (
        <div
          key={index}
          className={`w-3 h-3 rounded-sm ${
            isCompleted 
              ? 'bg-primary' 
              : 'bg-muted'
          }`}
          title={`${date.toDateString()} - ${isCompleted ? 'Completed' : 'Not completed'}`}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <Target className="h-8 w-8 text-primary" />
      </div>

      {/* Add New Habit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Habit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter habit name (e.g., Drink 8 glasses of water)"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              className="flex-1"
            />
            <Button onClick={addHabit}>Add Habit</Button>
          </div>
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="grid gap-4">
        {habits.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No habits yet. Add your first habit to start tracking!</p>
            </CardContent>
          </Card>
        ) : (
          habits.map(habit => (
            <Card key={habit.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{habit.name}</h3>
                    {habit.streak >= 7 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Week Streak!
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => toggleHabit(habit.id)}
                    variant={isCompletedToday(habit) ? "default" : "outline"}
                    size="sm"
                  >
                    {isCompletedToday(habit) ? 'Completed Today' : 'Mark Complete'}
                  </Button>
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">{habit.streak} day streak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      {habit.completions.length} total completions
                    </span>
                  </div>
                </div>

                {/* Calendar Heatmap */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Last 30 days:</p>
                  <div className="flex gap-1 flex-wrap">
                    {getCalendarHeatmap(habit)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default HabitTracker;