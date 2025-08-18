
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  CheckSquare, 
  StickyNote, 
  Home, 
  Timer, 
  Target, 
  Wallet, 
  Shield,
  Clock,
  Key
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AllToolsPage = () => {
  const tools = [
    {
      title: 'Timesheet Calculator',
      description: 'Calculate attendance and working hours',
      icon: Calculator,
      path: '/calculator',
      color: 'bg-blue-500'
    },
    {
      title: 'Todo List',
      description: 'Manage your tasks and stay organized',
      icon: CheckSquare,
      path: '/todo',
      color: 'bg-green-500'
    },
    {
      title: 'Notes',
      description: 'Create and organize your notes',
      icon: StickyNote,
      path: '/notes',
      color: 'bg-yellow-500'
    },
    {
      title: 'EMI Calculator',
      description: 'Calculate loan EMI with visual breakdown',
      icon: Home,
      path: '/emi',
      color: 'bg-purple-500'
    },
    {
      title: 'Pomodoro Timer',
      description: 'Focus timer with customizable intervals',
      icon: Timer,
      path: '/pomodoro',
      color: 'bg-red-500'
    },
    {
      title: 'Habit Tracker',
      description: 'Track daily habits and build streaks',
      icon: Target,
      path: '/habits',
      color: 'bg-indigo-500'
    },
    {
      title: 'Budget Planner',
      description: 'Manage your income and expenses',
      icon: Wallet,
      path: '/budget',
      color: 'bg-emerald-500'
    },
    {
      title: 'Secure Vault',
      description: 'Store passwords and sensitive data',
      icon: Shield,
      path: '/vault',
      color: 'bg-gray-500'
    },
    {
      title: 'Time Tracker',
      description: 'Track work sessions with break detection',
      icon: Clock,
      path: '/timetracker',
      color: 'bg-orange-500'
    },
    {
      title: 'Password Generator',
      description: 'Generate secure passwords with customization',
      icon: Key,
      path: '/password',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">All Productivity Tools</h1>
        <p className="text-muted-foreground">Explore all available tools to boost your productivity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.path} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-3`}>
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">{tool.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">{tool.description}</p>
              <Link to={tool.path}>
                <Button className="w-full">
                  Open Tool
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="/">
          <Button variant="outline">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AllToolsPage;
