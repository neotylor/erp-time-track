
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Clock, TrendingUp, Smartphone, Upload, BarChart3 } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Powerful Tools',
      description: 'Access a comprehensive suite of calculators and productivity tools'
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'Track time, manage habits, and boost your productivity'
    },
    {
      icon: BarChart3,
      title: 'Data Analytics',
      description: 'Visualize your progress with charts and detailed insights'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your goals and see your improvement over time'
    },
    {
      icon: Upload,
      title: 'Easy Import',
      description: 'Import data seamlessly with CSV support and direct input'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Responsive design that works perfectly on all devices'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-16 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Calculator className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Tools Hub
              <span className="text-primary"> Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your all-in-one productivity companion. Streamline your workflow and boost efficiency with smart tools designed for modern professionals.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link to="/tools">Explore Tools</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">100%</h3>
              <p className="text-muted-foreground">Free to Use</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">PWA</h3>
              <p className="text-muted-foreground">Works Offline</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">Mobile</h3>
              <p className="text-muted-foreground">Optimized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Productivity Tools at Your <span className="text-primary">Fingertips</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our curated collection of productivity tools designed to help you work smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their workflow with Tools Hub Pro. Start your journey to peak productivity today.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link to="/tools">Start Your First Tool</Link>
          </Button>
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
