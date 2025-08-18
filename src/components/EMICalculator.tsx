import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCcw } from 'lucide-react';
import { calculateEMI } from '@/utils/emiCalculations';
import EMIResults from '@/components/EMIResults';
import EMIChart from '@/components/EMIChart';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>('500000');
  const [interestRate, setInterestRate] = useState<string>('10.5');
  const [tenure, setTenure] = useState<string>('20');

  const calculation = useMemo(() => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(tenure) || 0;
    
    return calculateEMI(principal, rate, years);
  }, [loanAmount, interestRate, tenure]);

  const handleReset = () => {
    setLoanAmount('500000');
    setInterestRate('10.5');
    setTenure('20');
  };

  const handleInputChange = (setter: (value: string) => void) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            EMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your Equated Monthly Installment with visual breakdown
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Input Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Loan Details
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                <Input
                  id="loanAmount"
                  type="text"
                  value={loanAmount}
                  onChange={handleInputChange(setLoanAmount)}
                  placeholder="Enter loan amount"
                  className="text-lg"
                />
                <Slider
                  value={[parseFloat(loanAmount) || 100000]}
                  onValueChange={([value]) => setLoanAmount(value.toString())}
                  max={10000000}
                  min={100000}
                  step={10000}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground">
                  Range: ₹1,00,000 - ₹1,00,00,000
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="text"
                  value={interestRate}
                  onChange={handleInputChange(setInterestRate)}
                  placeholder="Enter interest rate"
                  className="text-lg"
                />
                <Slider
                  value={[parseFloat(interestRate) || 8]}
                  onValueChange={([value]) => setInterestRate(value.toString())}
                  max={25}
                  min={6}
                  step={0.1}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground">
                  Range: 6% - 25%
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                <Input
                  id="tenure"
                  type="text"
                  value={tenure}
                  onChange={handleInputChange(setTenure)}
                  placeholder="Enter tenure in years"
                  className="text-lg"
                />
                <Slider
                  value={[parseFloat(tenure) || 5]}
                  onValueChange={([value]) => setTenure(value.toString())}
                  max={30}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground">
                  Range: 1 - 30 years
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• EMI is calculated using reducing balance method</p>
                  <p>• Results are approximate and for illustration only</p>
                  <p>• Actual rates may vary based on bank policies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Section */}
          <div className="lg:col-span-2">
            <EMIChart calculation={calculation} />
          </div>
        </div>

        {/* Results Section */}
        <EMIResults calculation={calculation} />

        {/* Additional Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How EMI is Calculated?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">EMI Formula</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• P = Principal loan amount</li>
                  <li>• r = Monthly interest rate</li>
                  <li>• n = Total number of months</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tips to Reduce EMI</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Make a larger down payment</li>
                  <li>• Choose longer tenure (increases total interest)</li>
                  <li>• Compare rates from different lenders</li>
                  <li>• Consider prepayment to reduce tenure</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EMICalculator;