
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Clock, TrendingUp, Smartphone, Upload, BarChart3 } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy Data Import',
      description: 'Upload your attendance data via CSV files or paste directly into the app'
    },
    {
      icon: Calculator,
      title: 'Smart Calculations',
      description: 'Automatically calculate your progress against expected daily hours'
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'View your attendance in both table and calendar formats'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'See if you\'re ahead, behind, or on track with your working hours'
    },
    {
      icon: Clock,
      title: 'Time Format Support',
      description: 'Works with hours and minutes format for precise tracking'
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
              ERP Timesheet
              <span className="text-primary"> Calculator</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track your attendance data and monitor your progress against expected working hours with ease
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link to="/calculator">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
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
              Everything You Need for <span className="text-primary">Time Tracking</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive timesheet calculator provides all the tools you need to manage and analyze your working hours effectively.
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
            Ready to Start Tracking?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust our timesheet calculator for accurate attendance tracking and progress monitoring.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link to="/calculator">Start Calculating Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t bg-background">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 ERP Timesheet Calculator. Built with ❤️ for productivity.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
