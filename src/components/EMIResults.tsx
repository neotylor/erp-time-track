import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, PiggyBank, CreditCard } from 'lucide-react';
import { EMICalculation, formatCurrency } from '@/utils/emiCalculations';

interface EMIResultsProps {
  calculation: EMICalculation;
}

const EMIResults: React.FC<EMIResultsProps> = ({ calculation }) => {
  const { monthlyEMI, totalAmount, totalInterest, principalAmount } = calculation;

  const results = [
    {
      title: 'Monthly EMI',
      value: formatCurrency(monthlyEMI),
      icon: Calculator,
      description: 'Amount to pay monthly',
      color: 'text-primary',
    },
    {
      title: 'Total Interest',
      value: formatCurrency(totalInterest),
      icon: TrendingUp,
      description: 'Total interest payable',
      color: 'text-orange-600',
    },
    {
      title: 'Total Amount',
      value: formatCurrency(totalAmount),
      icon: CreditCard,
      description: 'Principal + Interest',
      color: 'text-purple-600',
    },
    {
      title: 'Principal Amount',
      value: formatCurrency(principalAmount),
      icon: PiggyBank,
      description: 'Loan amount',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {results.map((result) => (
        <Card key={result.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {result.title}
            </CardTitle>
            <result.icon className={`h-4 w-4 ${result.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${result.color}`}>
              {result.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {result.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EMIResults;