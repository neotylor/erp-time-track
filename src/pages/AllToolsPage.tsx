
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, 
  Calculator, 
  Clock, 
  StickyNote, 
  PieChart, 
  Target, 
  Zap,
  Timer,
  DollarSign,
  Shield
} from 'lucide-react';

const AllToolsPage: React.FC = () => {
  const allTools = [
    {
      icon: CheckSquare,
      title: 'Smart To-Do',
      description: 'Organize tasks with priority levels and due dates',
      href: '/todo',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      status: 'Available'
    },
    {
      icon: Calculator,
      title: 'Timesheet Calculator',
      description: 'Track attendance and calculate working hours',
      href: '/calculator',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      status: 'Available'
    },
    {
      icon: PieChart,
      title: 'EMI Calculator',
      description: 'Calculate loan EMIs with visual breakdowns',
      href: '/emi',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      status: 'Available'
    },
    {
      icon: StickyNote,
      title: 'Quick Notes',
      description: 'Capture and organize your thoughts instantly',
      href: '/notes',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      status: 'Available'
    },
    {
      icon: Clock,
      title: 'Pomodoro Timer',
      description: 'Focus better with time-blocked work sessions',
      href: '/pomodoro',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      status: 'Available'
    },
    {
      icon: Target,
      title: 'Habit Tracker',
      description: 'Build and track your daily habits',
      href: '/habits',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      status: 'Available'
    },
    {
      icon: DollarSign,
      title: 'Budget Planner',
      description: 'Manage your finances and track expenses',
      href: '/budget',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      status: 'Available'
    },
    {
      icon: Shield,
      title: 'Secure Vault',
      description: 'Store passwords and sensitive information securely',
      href: '/vault',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50 dark:bg-slate-900/20',
      status: 'Available'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-20 md:pb-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            All Productivity Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover all the powerful tools available in TaskFlow Pro to boost your productivity and streamline your workflow.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-primary">{allTools.length}</h3>
            <p className="text-muted-foreground">Tools Available</p>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-primary">100%</h3>
            <p className="text-muted-foreground">Free to Use</p>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            <Timer className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-primary">24/7</h3>
            <p className="text-muted-foreground">Available</p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allTools.map((tool, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`h-6 w-6 ${tool.color}`} />
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {tool.status}
                  </span>
                </div>
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  <Link to={tool.href}>Launch Tool</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Choose any tool above to begin your productivity journey. Each tool is designed to help you work smarter and achieve your goals.
          </p>
          <Button asChild size="lg">
            <Link to="/todo">Start with To-Do</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllToolsPage;
