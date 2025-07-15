import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EMICalculation, formatCurrency } from '@/utils/emiCalculations';

interface EMIChartProps {
  calculation: EMICalculation;
}

const EMIChart: React.FC<EMIChartProps> = ({ calculation }) => {
  const { principalAmount, totalInterest } = calculation;

  const data = [
    {
      name: 'Principal Amount',
      value: principalAmount,
      color: 'hsl(var(--primary))',
      percentage: ((principalAmount / (principalAmount + totalInterest)) * 100).toFixed(1),
    },
    {
      name: 'Total Interest',
      value: totalInterest,
      color: 'hsl(24, 95%, 60%)', // Orange color
      percentage: ((totalInterest / (principalAmount + totalInterest)) * 100).toFixed(1),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">{entry.value}</span>
            <span className="text-sm text-muted-foreground">
              ({data[index]?.percentage}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (principalAmount === 0 && totalInterest === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Loan Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Enter loan details to see breakdown</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Loan Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-sm text-muted-foreground">Principal</div>
            <div className="text-lg font-semibold text-primary">
              {formatCurrency(principalAmount)}
            </div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <div className="text-sm text-muted-foreground">Interest</div>
            <div className="text-lg font-semibold text-orange-600">
              {formatCurrency(totalInterest)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EMIChart;