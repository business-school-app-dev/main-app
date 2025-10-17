import "@/global.css";
import React, { useState } from 'react';
import { ScrollView } from "react-native";
// import PageLayout from "@/components/layouts/page-layout";


import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
// Slider and its sub-components are usually separate:
import { Slider } from '@/components/ui/slider';


// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  // Ensure the amount is a number and non-negative for display logic
  const value = Math.max(0, amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2, // Allow cents for split amounts
  }).format(value);
};

const formatPercentage = (value: number) => {
  return value.toFixed(0) + '%';
};

// --- Custom Components for Reusability ---

interface ValueDisplayProps {
  label: string;
  value: string;
  color?: string;
  isBold?: boolean;
}

const ValueDisplay: React.FC<ValueDisplayProps> = ({ label, value, color, isBold }) => (
  <HStack justifyContent="space-between" alignItems="center" w="$full" mb="$2">
    <Text size="sm" fontWeight="$medium" color="$textDark700">
      {label}
    </Text>
    <Text size="sm" fontWeight={isBold ? '$bold' : '$medium'} color={color || '$error500'}>
      {value}
    </Text>
  </HStack>
);

interface InputSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
  unit: string;
  formatter: (value: number) => string;
  onValueChange: (value: number) => void;
  trackColor?: string; 
}

const InputSlider: React.FC<InputSliderProps> = ({
  label,
  min,
  max,
  step,
  initialValue,
  unit,
  formatter,
  onValueChange,
  // trackColor is now passed as a prop to the main Slider, assuming it handles it.
  trackColor, 
}) => {
  const [value, setValue] = useState(initialValue);
  
  const formattedValue = formatter(value);
  const displayValue = unit === '%' ? `${formattedValue}` : `${formattedValue} ${unit}`;

  const handleValueChange = (newValue: number) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <VStack space="xs" mb="$5">
      <ValueDisplay label={label} value={displayValue} />
      <Slider
        defaultValue={initialValue}
        minValue={min}
        maxValue={max}
        step={step}
        onChange={handleValueChange}
        accessibilityLabel={label}
        size="md"
        // Pass color props directly to the main Slider component
        trackColor={trackColor || "$error500"} 
      >
        {/* Sub-components (SliderTrack, SliderThumb) removed as per user request */}
      </Slider>
    </VStack>
  );
};

// --- Main Component ---
const LoanCalculator = () => {
  // Input States
  const [totalLoan, setTotalLoan] = useState(35000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(10);
  const [monthlyIncome, setMonthlyIncome] = useState(4500);
  const [retirementContribution, setRetirementContribution] = useState(8);

  // New state for Allocation Slider
  const [loanAllocationPercentage, setLoanAllocationPercentage] = useState(60);

  // Calculated Values (useMemo for performance)
  const { monthlyPayment, totalInterest, debtToIncome, availableDiscretionaryIncome } = useMemo(() => {
    const principal = totalLoan;
    const rate = interestRate / 100 / 12; // Monthly interest rate
    const termMonths = loanTerm * 12; // Total number of payments (months)
    
    let calculatedPayment = 0;
    if (rate > 0 && termMonths > 0) {
      calculatedPayment = (principal * rate) / (1 - Math.pow(1 + rate, -termMonths));
    } else if (termMonths > 0) {
      calculatedPayment = principal / termMonths;
    }

    const calculatedTotalInterest = (calculatedPayment * termMonths) - principal;
    const calculatedDebtToIncome = (calculatedPayment / monthlyIncome) * 100;
    
    // --- New Discretionary Income Calculation ---
    // Simplified: Monthly Income - Monthly Payment
    const calculatedAvailableIncome = monthlyIncome - calculatedPayment;

    return {
      monthlyPayment: calculatedPayment,
      totalInterest: calculatedTotalInterest,
      debtToIncome: calculatedDebtToIncome,
      availableDiscretionaryIncome: calculatedAvailableIncome,
    };
  }, [totalLoan, interestRate, loanTerm, monthlyIncome]);

  // --- New Calculations for Allocation Split ---
  // If available income is negative (payments > income), set discretionary income to 0
  const effectiveDiscretionaryIncome = Math.max(0, availableDiscretionaryIncome);
  
  // Use the dynamically calculated available income here
  const extraLoanPayment = (effectiveDiscretionaryIncome * loanAllocationPercentage) / 100;
  const retirementSavingsAllocation = effectiveDiscretionaryIncome - extraLoanPayment;

  // Helper component for Summary Rows
  const SummaryRow: React.FC<ValueDisplayProps> = ({ label, value, color, isBold }) => (
    <HStack justifyContent="space-between" alignItems="center" py="$2">
      <Text size="sm" color="$textDark600">
        {label}
      </Text>
      <Text size="sm" fontWeight={isBold ? '$bold' : '$medium'} color={color || '$textDark700'}>
        {value}
      </Text>
    </HStack>
  );

  return (
    // The wrapper styles are simple React Native styles
    <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }} 
        style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <VStack space="lg" p="$4">
        {/* Header Section */}
        <VStack space="xs" borderBottomWidth="$1" borderBottomColor="$trueGray100" pb="$4">
          <Heading size="xl" fontWeight="$bold" color="$textDark900">
            Calculate Your Path to Financial Freedom
          </Heading>
          <Text size="sm" color="$textDark600">
            Enter your current loan details to determine your optimal repayment schedule, balanced upon other important long-term retirement savings.
          </Text>
        </VStack>

        {/* Loan Input Section with Sliders */}
        <VStack space="md">
          <InputSlider
            label="Total Loan Amount"
            min={1000}
            max={100000}
            step={1000}
            initialValue={totalLoan}
            unit=""
            formatter={formatCurrency}
            onValueChange={setTotalLoan}
          />
          <InputSlider
            label="Interest Rate"
            min={1.0}
            max={15.0}
            step={0.1}
            initialValue={interestRate}
            unit="%"
            formatter={(val) => val.toFixed(2)}
            onValueChange={setInterestRate}
          />
          <InputSlider
            label="Loan Term"
            min={5}
            max={30}
            step={1}
            initialValue={loanTerm}
            unit="years"
            formatter={(val) => val.toFixed(0)}
            onValueChange={setLoanTerm}
          />
          <InputSlider
            label="Monthly Income"
            min={1000}
            max={15000}
            step={500}
            initialValue={monthlyIncome}
            unit=""
            formatter={formatCurrency}
            onValueChange={setMonthlyIncome}
          />
          <InputSlider
            label="Retirement Contribution"
            min={0}
            max={20}
            step={1}
            initialValue={retirementContribution}
            unit="%"
            formatter={(val) => val.toFixed(0)}
            onValueChange={setRetirementContribution}
          />
        </VStack>

        <Divider />

        {/* Summary Section */}
        <VStack space="sm" p="$3" borderRadius="$md" borderWidth="$1" borderColor="$trueGray200">
          <Heading size="md" fontWeight="$bold" color="$textDark900">
            Your Loan Summary
          </Heading>
          <SummaryRow
            label="Monthly Payment"
            value={formatCurrency(monthlyPayment)}
            isBold={true}
          />
          <SummaryRow
            label="Total Interest"
            value={formatCurrency(totalInterest)}
          />
          <SummaryRow
            label="Debt-to-Income Ratio"
            value={formatPercentage(debtToIncome)}
            color={debtToIncome > 36 ? '$error500' : '$success500'}
            isBold={true}
          />
          <Slider
            defaultValue={debtToIncome}
            minValue={0}
            maxValue={50}
            step={1}
            isDisabled={true}
            size="sm"
            // Use the trackColor prop to set the filled track color
            trackColor={debtToIncome > 36 ? '$error500' : '$success500'} 
            thumbProps={{ 
              bg: "$backgroundLight50", 
              borderColor: "$trueGray300", 
              borderWidth: "$1" 
            }}
          >
            {/* Sub-components removed */}
          </Slider>
        </VStack>

        {/* AI Recommendation Box */}
        <Box bg="$error50" p="$4" borderRadius="$md">
          <HStack space="xs" alignItems="center" mb="$2">
            <Text size="lg">🧠</Text>
            <Heading size="sm" fontWeight="$bold" color="$error600">
              AI Summarized Recommendation
            </Heading>
          </HStack>
          <Text size="xs" color="$textDark700" lineHeight="$sm">
            Based on the current settings, a longer term of **15 years** at a slightly lower **4.5%** interest rate would free up **$150/month**. This allows you to take advantage of compound interest and contribute more towards retirement savings.
          </Text>
        </Box>

        {/* Risk Factors */}
        <VStack space="sm" p="$4" borderRadius="$md" borderWidth="$1" borderColor="$trueGray200">
          <HStack space="xs" alignItems="center">
            <Text size="lg" color="$error500">❓</Text>
            <Heading size="sm" fontWeight="$bold" color="$textDark900">
              Why Risk Factors
            </Heading>
          </HStack>
          <Text size="xs" color="$textDark600" lineHeight="$sm">
            Focusing on high monthly payments means cutting back on other important savings, notably retirement. Don't underestimate the long-term compounding impact of your proposed effort. Including retirement contributions and other payments helps find the right balance for your situation.
          </Text>
        </VStack>

        {/* --- ADJUSTED ALLOCATION SECTION (Now dynamic) --- */}
        <VStack space="sm">
          <Heading size="lg" fontWeight="$bold">Adjust Your Allocation</Heading>
          
          {/* Handle negative discretionary income */}
          {effectiveDiscretionaryIncome <= 0 ? (
            <Box bg="$red50" p="$3" borderRadius="$md">
              <Text size="sm" fontWeight="$bold" color="$red700">
                Warning: Your expenses ({formatCurrency(monthlyPayment)}/mo) are higher than your current income. No discretionary income available for allocation.
              </Text>
            </Box>
          ) : (
            <>
              <Text size="sm" color="$textDark600">
                Based on your available discretionary income of <Text fontWeight="$bold">{formatCurrency(effectiveDiscretionaryIncome)}/month</Text>, decide how to split between extra loan payments and retirement savings.
              </Text>
              {/* Allocation Slider */}
              <VStack space="xs" my="$3">
                <Text size="sm" fontWeight="$medium" color="$textDark700" textAlign="center">
                  Loan vs Retirement Split
                </Text>
                <Slider
                  defaultValue={loanAllocationPercentage}
                  minValue={0}
                  maxValue={100}
                  step={1}
                  onChange={setLoanAllocationPercentage}
                  accessibilityLabel="Loan vs Retirement Split"
                  size="md"
                  // Use the trackColor prop for the filled track
                  trackColor="$error500" 
                >
                  {/* Sub-components removed */}
                </Slider>
              </VStack>

              {/* Allocation Display Cards */}
              <HStack
                w="$full"
                borderRadius="$md"
                overflow="hidden"
                borderWidth="$1"
                borderColor="$trueGray200"
                justifyContent="space-between"
              >
                {/* Extra Loan Payment Card */}
                <VStack
                  flex={1}
                  bg="$white"
                  p="$3"
                  alignItems="center"
                  justifyContent="center"
                  borderRightWidth="$1"
                  borderRightColor="$trueGray100"
                >
                  <Text size="sm" fontWeight="$semibold" color="$textDark700">Extra Loan Payment</Text>
                  <Text size="md" fontWeight="$bold" color="$textDark900">{formatPercentage(loanAllocationPercentage)}</Text>
                  <Text size="lg" fontWeight="$bold" color="$textDark900" mt="$1">{formatCurrency(extraLoanPayment)}/mo</Text>
                </VStack>
                
                {/* Retirement Savings Card */}
                <VStack
                  flex={1}
                  bg="$white"
                  p="$3"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text size="sm" fontWeight="$semibold" color="$textDark700">Retirement Savings</Text>
                  <Text size="md" fontWeight="$bold" color="$textDark900">{formatPercentage(100 - loanAllocationPercentage)}</Text>
                  <Text size="lg" fontWeight="$bold" color="$textDark900" mt="$1">{formatCurrency(retirementSavingsAllocation)}/mo</Text>
                </VStack>
              </HStack>
            </>
          )}
        </VStack>
        
        {/* --- UPDATED IMPACT PROJECTIONS --- */}
        <VStack space="sm" mt="$2">
          <Heading size="md" fontWeight="$bold">Impact Projections</Heading>
          <SummaryRow
            label={`Loan payoff with extra ${formatCurrency(extraLoanPayment)}/mo:`}
            value="~2-4 years faster" // Placeholder
            color="$textDark500"
          />
          <SummaryRow
            label={`Retirement in 30 years at ${formatCurrency(retirementSavingsAllocation)}/mo:`}
            value="~$328K" // Placeholder
            color="$textDark500"
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default LoanCalculator;