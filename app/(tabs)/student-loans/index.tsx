import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Slider } from "@/components/ui/slider";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import "@/global.css";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

// Custom Components
import TextButton from "@/components/inputs/text-button";
import PageLayout from "@/components/layouts/page-layout";

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  const value = Math.max(0, amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value: number) => value.toFixed(0) + "%";

// --- Reusable Components ---
interface ValueDisplayProps {
  label: string;
  value: string;
  color?: string;
  isBold?: boolean;
}

const ValueDisplay: React.FC<ValueDisplayProps> = ({
  label,
  value,
  color,
  isBold,
}) => (
  <HStack className="justify-between items-center">
    <Text size="sm" className="text-gray-600">
      {label}
    </Text>
    <Text
      size="sm"
      className={`${isBold ? "font-semibold" : ""} ${
        color ? `text-[${color}]` : "text-gray-900"
      }`}
    >
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
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  const displayValue =
    unit === "%" ? `${formatter(value)}${unit}` : `${formatter(value)} ${unit}`;

  return (
    <VStack space="xs">
      <ValueDisplay label={label} value={displayValue} />
      <Slider
        defaultValue={initialValue}
        minValue={min}
        maxValue={max}
        step={step}
        onChange={handleChange}
        size="md"
      />
    </VStack>
  );
};

// --- Main Calculator Content ---
const LoanCalculatorContent = () => {
  const [totalLoan, setTotalLoan] = useState(35000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(10);
  const [monthlyIncome, setMonthlyIncome] = useState(4500);
  const [retirementContribution, setRetirementContribution] = useState(8);
  const [loanAllocationPercentage, setLoanAllocationPercentage] = useState(60);

  const {
    monthlyPayment,
    totalInterest,
    debtToIncome,
    availableDiscretionaryIncome,
  } = useMemo(() => {
    const principal = totalLoan;
    const rate = interestRate / 100 / 12;
    const termMonths = loanTerm * 12;

    let calculatedPayment = 0;
    if (rate > 0 && termMonths > 0) {
      calculatedPayment =
        (principal * rate) / (1 - Math.pow(1 + rate, -termMonths));
    } else if (termMonths > 0) {
      calculatedPayment = principal / termMonths;
    }

    const totalInterest = calculatedPayment * termMonths - principal;
    const dti = (calculatedPayment / monthlyIncome) * 100;
    const discretionary = monthlyIncome - calculatedPayment;

    return {
      monthlyPayment: calculatedPayment,
      totalInterest,
      debtToIncome: dti,
      availableDiscretionaryIncome: discretionary,
    };
  }, [totalLoan, interestRate, loanTerm, monthlyIncome]);

  const effectiveDiscretionaryIncome = Math.max(
    0,
    availableDiscretionaryIncome
  );
  const extraLoanPayment =
    (effectiveDiscretionaryIncome * loanAllocationPercentage) / 100;
  const retirementSavingsAllocation =
    effectiveDiscretionaryIncome - extraLoanPayment;

  return (
    <PageLayout title="Student Loan Calculator" backButtonHidden profileButtonHidden className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <VStack space="2xl" className="items-center mb-8">
            <Heading size="2xl" className="text-gray-900 text-center">
              Path to Financial Freedom
            </Heading>
            <Text size="lg" className="text-gray-600 text-center">
              Enter your current loan details to determine your optimal repayment
              schedule, balanced upon other important long-term retirement
              savings.
            </Text>
          </VStack>

          {/* Loan Inputs Section */}
          <VStack space="lg" className="mb-12">
            <Heading size="xl" className="text-gray-900 mb-4">Loan Details</Heading>
            
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Loan Parameters</Text>
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
              </VStack>
            </Card>

            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Income & Savings</Text>
              <VStack space="md">
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
            </Card>
          </VStack>

          {/* Loan Summary Section */}
          <VStack space="lg" className="mb-12">
            <Heading size="xl" className="text-gray-900 mb-4">Loan Summary</Heading>
            
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Payment Details</Text>
              <VStack space="md">
                <ValueDisplay
                  label="Monthly Payment"
                  value={formatCurrency(monthlyPayment)}
                  isBold
                />
                <ValueDisplay 
                  label="Total Interest" 
                  value={formatCurrency(totalInterest)} 
                />
                <ValueDisplay
                  label="Debt-to-Income Ratio"
                  value={formatPercentage(debtToIncome)}
                  color={debtToIncome > 36 ? "text-red-600" : "text-green-600"}
                  isBold
                />
                <Slider
                  defaultValue={debtToIncome}
                  minValue={0}
                  maxValue={50}
                  step={1}
                  isDisabled
                  size="sm"
                />
              </VStack>
            </Card>
          </VStack>

          {/* AI Recommendation Section */}
          <VStack space="lg" className="mb-12">
            <Heading size="xl" className="text-gray-900 mb-4">AI Recommendations</Heading>
            
            <Card className="p-6 bg-blue-50 border-blue-200">
              <HStack space="xs" className="mb-3">
                <Text size="lg">🧠</Text>
                <Heading size="md" className="text-blue-900">AI Summarized Recommendation</Heading>
              </HStack>
              <Text size="sm" className="text-blue-800">
                Based on the current settings, a longer term of{" "}
                <Text size="sm" className="font-semibold text-blue-900">
                  15 years
                </Text>{" "}
                at a slightly lower{" "}
                <Text size="sm" className="font-semibold text-blue-900">
                  4.5%
                </Text>{" "}
                interest rate would free up{" "}
                <Text size="sm" className="font-semibold text-blue-900">
                  $150/month
                </Text>
                , allowing for more retirement contributions.
              </Text>
            </Card>
          </VStack>

          {/* Allocation Section */}
          <VStack space="lg" className="mb-12">
            <Heading size="xl" className="text-gray-900 mb-4">Budget Allocation</Heading>
            
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Adjust Your Allocation</Text>
              {effectiveDiscretionaryIncome <= 0 ? (
                <View className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Text size="sm" className="text-red-800">
                    Warning: Your expenses ({formatCurrency(monthlyPayment)}/mo) are
                    higher than your income. No discretionary income available.
                  </Text>
                </View>
              ) : (
                <VStack space="md">
                  <Text size="sm" className="text-gray-700">
                    You have {formatCurrency(effectiveDiscretionaryIncome)} per
                    month to split between extra loan payments and retirement
                    savings.
                  </Text>
                  
                  <VStack space="xs">
                    <Text size="sm" className="font-medium text-gray-700">Loan vs Retirement Split</Text>
                    <Slider
                      defaultValue={loanAllocationPercentage}
                      minValue={0}
                      maxValue={100}
                      step={1}
                      onChange={setLoanAllocationPercentage}
                      size="md"
                    />
                  </VStack>

                  <HStack space="lg" className="justify-between">
                    <Card className="flex-1 p-4 bg-green-50 border-green-200">
                      <VStack space="xs" className="items-center">
                        <Text size="sm" className="text-green-800 font-medium">Extra Loan Payment</Text>
                        <Text size="lg" className="text-green-900 font-bold">
                          {formatPercentage(loanAllocationPercentage)}
                        </Text>
                        <Text size="md" className="text-green-800 font-semibold">
                          {formatCurrency(extraLoanPayment)}/mo
                        </Text>
                      </VStack>
                    </Card>
                    
                    <Card className="flex-1 p-4 bg-blue-50 border-blue-200">
                      <VStack space="xs" className="items-center">
                        <Text size="sm" className="text-blue-800 font-medium">Retirement Savings</Text>
                        <Text size="lg" className="text-blue-900 font-bold">
                          {formatPercentage(100 - loanAllocationPercentage)}
                        </Text>
                        <Text size="md" className="text-blue-800 font-semibold">
                          {formatCurrency(retirementSavingsAllocation)}/mo
                        </Text>
                      </VStack>
                    </Card>
                  </HStack>
                </VStack>
              )}
            </Card>
          </VStack>

          {/* Impact Projections Section */}
          <VStack space="lg" className="mb-12">
            <Heading size="xl" className="text-gray-900 mb-4">Impact Projections</Heading>
            
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Long-term Impact</Text>
              <VStack space="md">
                <ValueDisplay
                  label={`Loan payoff with extra ${formatCurrency(extraLoanPayment)}/mo:`}
                  value="~2–4 years faster"
                />
                <ValueDisplay
                  label={`Retirement in 30 years at ${formatCurrency(
                    retirementSavingsAllocation
                  )}/mo:`}
                  value="~$328K"
                />
              </VStack>
            </Card>
          </VStack>

          {/* Action Buttons Section */}
          <VStack space="md" className="mb-8">
            <TextButton
              label="Save This Plan"
              variant="primary"
              size="lg"
              onPress={() => console.log("Save plan pressed")}
            />
            <HStack space="md">
              <TextButton
                label="Export Report"
                variant="outline"
                size="md"
                onPress={() => console.log("Export pressed")}
              />
              <TextButton
                label="Share Plan"
                variant="secondary"
                size="md"
                onPress={() => console.log("Share pressed")}
              />
            </HStack>
          </VStack>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

export default LoanCalculatorContent;

