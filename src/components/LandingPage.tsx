
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Clock, TrendingUp, Smartphone, Upload, BarChart3, CheckSquare, StickyNote, Zap, Shield, Palette } from 'lucide-react';

const LandingPage: React.FC = () => {
  const tools = [
    {
      icon: CheckSquare,
      title: 'Smart To-Do Lists',
      description: 'Organize tasks with priority levels, due dates, and smart filtering',
      href: '/todo',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Calculator,
      title: 'Advanced Calculators',
      description: 'EMI calculator, timesheet calculator, and basic calculator tools',
      href: '/emi',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: StickyNote,
      title: 'Smart Notes',
      description: 'Color-coded notes with search, favorites, and instant sync',
      href: '/notes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Pomodoro timer, habit tracker, and time management tools',
      href: '/pomodoro',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: BarChart3,
      title: 'Budget Planner',
      description: 'Track expenses, set budgets, and visualize your financial health',
      href: '/budget',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      icon: Shield,
      title: 'Password Tools',
      description: 'Generate secure passwords and manage sensitive data',
      href: '/password',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant loading with offline support for uninterrupted productivity'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Responsive design that works perfectly on all devices and screen sizes'
    },
    {
      icon: Palette,
      title: 'Beautiful Design',
      description: 'Modern, clean interface with dark mode and customizable themes'
    },
    {
      icon: TrendingUp,
      title: 'Data Insights',
      description: 'Visualize your progress with charts and detailed analytics'
    },
    {
      icon: Upload,
      title: 'Easy Import',
      description: 'Import data seamlessly with CSV support and direct input'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays local unless you choose to sync with an account'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-20 text-center bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-5xl mx-auto relative">
          <div className="mb-12">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Calculator className="h-12 w-12 text-primary" />
              </div>
              <div className="text-4xl font-bold">×</div>
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Zap className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                Tools Hub
              </span>
              <span className="text-foreground"> Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Your all-in-one productivity companion. Streamline your workflow and boost efficiency with 
              <span className="font-semibold text-primary"> smart tools</span> designed for modern professionals.
            </p>
            <p className="text-lg font-medium text-primary/80 mb-8">
              "Where productivity meets simplicity"
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all">
              <Link to="/tools">🚀 Explore All Tools</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2">
              <Link to="/about">📖 Learn More</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <h3 className="text-3xl font-bold text-primary mb-2">100%</h3>
              <p className="text-muted-foreground font-medium">Free to Use</p>
              <p className="text-sm text-muted-foreground/70 mt-1">No hidden costs</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <h3 className="text-3xl font-bold text-primary mb-2">PWA</h3>
              <p className="text-muted-foreground font-medium">Works Offline</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Install as app</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <h3 className="text-3xl font-bold text-primary mb-2">6+</h3>
              <p className="text-muted-foreground font-medium">Powerful Tools</p>
              <p className="text-sm text-muted-foreground/70 mt-1">More coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Showcase */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Productivity Tools at Your <span className="text-primary">Fingertips</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Choose from our curated collection of productivity tools designed to help you work smarter, not harder.
              Each tool is crafted with attention to detail and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 ${tool.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className={`h-7 w-7 ${tool.color}`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                    <Link to={tool.href}>Get Started →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-primary">Tools Hub Pro</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Built with modern web technologies and user-centric design principles to deliver 
              the best productivity experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Boost Your Productivity?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who have transformed their workflow with Tools Hub Pro. 
              Start your journey to peak productivity today - no signup required!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-10 py-4 h-auto shadow-lg hover:shadow-xl">
              <Link to="/tools">🎯 Start Your First Tool</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-4 h-auto border-2">
              <Link to="/todo">📝 Try To-Do Manager</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t bg-background">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Tools Hub Pro. Built with ❤️ for productivity.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
