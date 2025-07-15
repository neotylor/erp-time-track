
import React from 'react';
import { useTodos } from '@/hooks/useTodos';
import TodoInput from '@/components/TodoInput';
import TodoItem from '@/components/TodoItem';
import TodoFilters from '@/components/TodoFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Star, Target } from 'lucide-react';

const TodoPage: React.FC = () => {
  const {
    todos,
    completedTodos,
    activeTodos,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete
  } = useTodos();

  const motivationalMessages = [
    "You're crushing it! 🚀",
    "Great job! Keep the momentum going! ⚡",
    "Task completed! You're on fire! 🔥",
    "Well done! Every task brings you closer to your goals! 🎯",
    "Awesome work! You're making progress! ✨"
  ];

  const getRandomMessage = () => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Smart To-Do
          </h1>
          <p className="text-muted-foreground text-lg">
            Organize your tasks with priority and stay motivated!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Circle className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{activeTodos.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{completedTodos.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-red-500" />
                <span className="text-2xl font-bold">
                  {activeTodos.filter(t => t.priority === 'high').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Todo Input */}
        <TodoInput onAddTodo={addTodo} />

        {/* Filters */}
        <TodoFilters
          filter={filter}
          onFilterChange={setFilter}
          activeTodosCount={activeTodos.length}
          completedTodosCount={completedTodos.length}
        />

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Your day, your tasks</h3>
                <p className="text-muted-foreground">
                  Add something to get started! Every great achievement begins with a single task.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {!filter.showCompleted && (
                <div className="space-y-3">
                  {todos.filter(todo => !todo.completed).map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleComplete}
                      onUpdate={updateTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </div>
              )}

              {filter.showCompleted && completedTodos.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h2 className="text-xl font-semibold">Well done! Here's what you've accomplished</h2>
                  </div>
                  {completedTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleComplete}
                      onUpdate={updateTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </div>
              )}

              {filter.showCompleted && todos.filter(todo => todo.completed).length > 0 && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4 text-center">
                    <p className="text-green-700 dark:text-green-300 font-medium">
                      {getRandomMessage()}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
