
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Heart, Users, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <Calculator className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">About Our App</h1>
          <p className="text-lg text-muted-foreground">
            Learn more about the ERP Timesheet Calculator and our mission
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                We believe that tracking work hours should be simple, accurate, and insightful. 
                Our goal is to help professionals and businesses manage their time more effectively 
                with easy-to-use tools and clear visualizations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                • Time format support (HH:MM)<br/>
                • Holiday and weekend detection<br/>
                • Visual progress tracking<br/>
                • Mobile-optimized design<br/>
                • Offline PWA support<br/>
                • CSV data import
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Who Uses It</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Perfect for freelancers, consultants, employees, and small businesses 
                who need to track their working hours and monitor progress against 
                expected daily targets.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calculator className="h-8 w-8 text-primary mb-2" />
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Simply input your attendance data, set your expected daily hours, 
                and let our calculator do the rest. View your progress in table or 
                calendar format and get instant feedback on your performance.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
