import React from 'react';
import { Card } from '@/components/ui/card';

export const CheerUpAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <Card className="p-8 max-w-md text-center animate-scale-in">
        <div className="space-y-4">
          <div className="text-6xl animate-bounce">💪</div>
          <h2 className="text-2xl font-bold text-primary">Keep Going!</h2>
          <p className="text-muted-foreground">
            You're behind on some hours, but don't worry! Every step forward counts. 
            You've got this! 🌟
          </p>
          <div className="flex justify-center space-x-2 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🚀</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>💫</span>
          </div>
        </div>
      </Card>
    </div>
  );
};