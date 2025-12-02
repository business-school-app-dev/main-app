export interface LoanCalculationInputs {
  totalLoan: number;
  interestRate: number;
  loanTerm: number;
  monthlyIncome: number;
  loanAllocationPercentage: number;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  debtToIncome: number;
  availableDiscretionaryIncome: number;
  effectiveDiscretionaryIncome: number;
  extraLoanPayment: number;
  retirementSavingsAllocation: number;
  monthsToPayoff: number;
  yearsSaved: number;
  retirementProjection: number;
}

export const calculateLoanDetails = (
  inputs: LoanCalculationInputs
): LoanCalculationResult => {
  const {
    totalLoan,
    interestRate,
    loanTerm,
    monthlyIncome,
    loanAllocationPercentage,
  } = inputs;

  const principal = totalLoan;
  const rate = interestRate / 100 / 12;
  const termMonths = loanTerm * 12;

  let calculatedPayment = 0;
  if (rate > 0 && termMonths > 0 && principal > 0) {
    calculatedPayment =
      (principal * rate) / (1 - Math.pow(1 + rate, -termMonths));
  } else if (termMonths > 0 && principal > 0) {
    calculatedPayment = principal / termMonths;
  }

  const totalInterestPaid = calculatedPayment * termMonths - principal;
  const dti = monthlyIncome > 0 ? (calculatedPayment / monthlyIncome) * 100 : 0;
  const discretionary = monthlyIncome - calculatedPayment;

  const monthlyPayment = calculatedPayment;
  const totalInterest = Math.max(0, totalInterestPaid);
  const debtToIncome = dti;
  const availableDiscretionaryIncome = discretionary;

  const effectiveDiscretionaryIncome = Math.max(
    0,
    availableDiscretionaryIncome
  );
  const extraLoanPayment =
    (effectiveDiscretionaryIncome * loanAllocationPercentage) / 100;
  const retirementSavingsAllocation =
    effectiveDiscretionaryIncome - extraLoanPayment;

  // Calculate loan payoff time with extra payments
  let monthsToPayoff = 0;
  let yearsSaved = 0;
  if (totalLoan > 0 && monthlyPayment > 0) {
    const totalPayment = monthlyPayment + extraLoanPayment;
    if (totalPayment > 0) {
      let balance = totalLoan;
      let months = 0;
      const monthlyRate = interestRate / 100 / 12;

      while (balance > 0 && months < 360) {
        // Max 30 years
        const interestCharge = balance * monthlyRate;
        const principalPayment = totalPayment - interestCharge;
        balance -= principalPayment;
        months++;
      }
      monthsToPayoff = months;
      const originalTermMonths = loanTerm * 12;
      const monthsSaved = originalTermMonths - months;
      yearsSaved = Math.max(0, monthsSaved / 12);
    }
  }

  // Calculate retirement savings projection (30 years with 7% average return)
  let retirementProjection = 0;
  if (retirementSavingsAllocation > 0) {
    const monthlyContribution = retirementSavingsAllocation;
    const annualReturn = 0.07; // 7% average annual return
    const monthlyReturn = annualReturn / 12;
    const numMonths = 30 * 12; // 30 years

    retirementProjection =
      monthlyContribution *
      ((Math.pow(1 + monthlyReturn, numMonths) - 1) / monthlyReturn);
  }

  return {
    monthlyPayment,
    totalInterest,
    debtToIncome,
    availableDiscretionaryIncome,
    effectiveDiscretionaryIncome,
    extraLoanPayment,
    retirementSavingsAllocation,
    monthsToPayoff,
    yearsSaved,
    retirementProjection,
  };
};

// --- Formatting Functions ---
export const formatCurrency = (amount: number) => {
  const value = Math.max(0, amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatLargeCurrency = (amount: number) => {
  const value = Math.max(0, amount);
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return formatCurrency(value);
};

export const formatPercentage = (value: number) => value.toFixed(0) + "%";
