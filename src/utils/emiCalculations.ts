export interface EMICalculation {
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
  principalAmount: number;
}

export const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureYears: number
): EMICalculation => {
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
    return {
      monthlyEMI: 0,
      totalAmount: 0,
      totalInterest: 0,
      principalAmount: 0,
    };
  }

  const monthlyRate = annualRate / (12 * 100);
  const totalMonths = tenureYears * 12;

  // EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
  const emi = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalAmount = emi * totalMonths;
  const totalInterest = totalAmount - principal;

  return {
    monthlyEMI: Math.round(emi),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    principalAmount: principal,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-IN').format(number);
};