import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import EMICalculator from '@/components/EMICalculator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EMIPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {!user && (
        <div className="container mx-auto px-4 pt-4">
          <Alert>
            <AlertDescription>
              You’re using the EMI Calculator as a guest. Sign in from the header any time to sync your data across devices.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <EMICalculator />
    </div>
  );
};

export default EMIPage;