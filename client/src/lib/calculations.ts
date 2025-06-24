export function calculateMonthlyPayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;
  
  if (monthlyInterestRate === 0) {
    return loanAmount / totalPayments;
  }
  
  const monthlyPayment = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
    (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
  
  return monthlyPayment;
}

export function calculateRentalYield(
  monthlyRent: number,
  propertyValue: number
): number {
  const annualRent = monthlyRent * 12;
  return (annualRent / propertyValue) * 100;
}

export function calculateROI(
  monthlyRent: number,
  propertyValue: number,
  monthlyExpenses: number = 0
): number {
  const annualRent = monthlyRent * 12;
  const annualExpenses = monthlyExpenses * 12;
  const netAnnualIncome = annualRent - annualExpenses;
  
  return (netAnnualIncome / propertyValue) * 100;
}
