import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@/components/ui/slider";
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
    <VStack space="xs" className="mb-4">
      <HStack className="justify-between items-center mb-2">
        <Text size="sm" className="text-gray-900 font-medium">
          {label}
        </Text>
        <Text size="md" className="text-primary-500 font-semibold">
          {displayValue}
        </Text>
      </HStack>
      <Slider
        defaultValue={initialValue}
        minValue={min}
        maxValue={max}
        step={step}
        onChange={handleChange}
        size="md"
      >
        <SliderTrack>
          <SliderFilledTrack className="bg-primary-500" />
        </SliderTrack>
        <SliderThumb className="bg-primary-500" />
      </Slider>
      <HStack className="justify-between items-center mt-1">
        <Text size="xs" className="text-gray-500">
          {unit === "%" ? `${min}%` : formatter(min)}
        </Text>
        <Text size="xs" className="text-gray-500">
          {unit === "%" ? `${max}%` : formatter(max)}
        </Text>
      </HStack>
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
    <PageLayout title="Student Loan Guide" backButtonHidden>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          {/* Header Section */}
          <VStack space="md" className="mb-6">
            <Heading size="xl" className="text-gray-900">
              Calculate Your Path to Financial Freedom
            </Heading>
            <Text size="sm" className="text-gray-600">
              Enter your student loan details to receive personalized advice on
              balancing loan repayment with retirement savings.
            </Text>
          </VStack>

          {/* Loan Inputs Section */}
          <VStack space="md" className="mb-6">
            <InputSlider
              label="Total Loan Amount"
              min={5000}
              max={150000}
              step={1000}
              initialValue={totalLoan}
              unit=""
              formatter={formatCurrency}
              onValueChange={setTotalLoan}
            />

            <InputSlider
              label="Interest Rate"
              min={2}
              max={12}
              step={0.5}
              initialValue={interestRate}
              unit="%"
              formatter={(val) => val.toFixed(1)}
              onValueChange={setInterestRate}
            />

            <InputSlider
              label="Loan Term"
              min={5}
              max={30}
              step={1}
              initialValue={loanTerm}
              unit=" years"
              formatter={(val) => val.toFixed(0)}
              onValueChange={setLoanTerm}
            />

            <InputSlider
              label="Monthly Income"
              min={2000}
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
              max={25}
              step={1}
              initialValue={retirementContribution}
              unit="%"
              formatter={(val) => val.toFixed(0)}
              onValueChange={setRetirementContribution}
            />
          </VStack>

          {/* Loan Summary Section */}
          <Card className="mb-6 bg-white border border-gray-200">
            <VStack space="md" className="p-4">
              <Text className="text-base font-semibold text-gray-900">
                Your Loan Summary
              </Text>

              <HStack className="justify-between items-center">
                <Text size="sm" className="text-gray-600">
                  Monthly Payment
                </Text>
                <Text size="sm" className="text-primary-500 font-semibold">
                  {formatCurrency(monthlyPayment)}
                </Text>
              </HStack>

              <HStack className="justify-between items-center">
                <Text size="sm" className="text-gray-600">
                  Total Interest
                </Text>
                <Text size="sm" className="text-gray-900 font-medium">
                  {formatCurrency(totalInterest)}
                </Text>
              </HStack>

              <HStack className="justify-between items-center">
                <Text size="sm" className="text-gray-600">
                  Debt-to-Income Ratio
                </Text>
                <Text size="sm" className={`font-semibold ${debtToIncome > 36 ? "text-red-600" : "text-gray-900"}`}>
                  {formatPercentage(debtToIncome)}
                </Text>
              </HStack>
            </VStack>
          </Card>

          {/* AI Recommendation Section */}
          <Card className="mb-6 bg-red-50 border border-red-100">
            <VStack space="sm" className="p-4">
              <HStack space="xs" className="items-center">
                <Text size="lg">📈</Text>
                <Text className="text-sm font-bold text-gray-900">
                  AI Generated Recommendation: Balance Both
                </Text>
              </HStack>
              <Text size="sm" className="text-gray-700 leading-5">
                Your debt-to-income ratio of {formatPercentage(debtToIncome)} is{" "}
                {debtToIncome > 36 ? "high" : "manageable"}. Consider balancing loan
                payments with retirement contributions to take advantage of compound
                interest and employer matching (if available).
              </Text>
            </VStack>
          </Card>

          {/* Why This Matters Section */}
          <Card className="mb-6 bg-white border border-gray-200">
            <VStack space="sm" className="p-4">
              <HStack space="xs" className="items-center">
                <Text size="lg">💰</Text>
                <Text className="text-sm font-bold text-gray-900">
                  Why This Matters
                </Text>
              </HStack>
              <Text size="sm" className="text-gray-700 leading-5">
                Paying off high-interest student loans early can save you thousands
                in interest. However, don&apos;t completely neglect retirement savings,
                especially if your employer offers matching contributions. Use the
                slider below to find the right balance for your situation.
              </Text>
            </VStack>
          </Card>

          {/* Allocation Section */}
          <VStack space="md" className="mb-6">
            <Text className="text-base font-semibold text-gray-900">
              Adjust Your Allocation
            </Text>

            {effectiveDiscretionaryIncome <= 0 ? (
              <Card className="p-4 bg-red-50 border border-red-200">
                <Text size="sm" className="text-red-800">
                  Warning: Your expenses ({formatCurrency(monthlyPayment)}/mo) exceed
                  your income. No discretionary income available.
                </Text>
              </Card>
            ) : (
              <VStack space="md">
                <Text size="sm" className="text-gray-700">
                  Based on your available discretionary income of{" "}
                  {formatCurrency(effectiveDiscretionaryIncome)}/month, decide how to
                  split between extra loan payments and retirement savings.
                </Text>

                <VStack space="xs" className="mb-4">
                  <Text size="sm" className="font-medium text-gray-900 mb-2">
                    Loan vs Retirement Split
                  </Text>
                  <Slider
                    defaultValue={loanAllocationPercentage}
                    minValue={0}
                    maxValue={100}
                    step={1}
                    onChange={setLoanAllocationPercentage}
                    size="md"
                  >
                    <SliderTrack>
                      <SliderFilledTrack className="bg-primary-500" />
                    </SliderTrack>
                    <SliderThumb className="bg-primary-500" />
                  </Slider>
                </VStack>

                <HStack space="md" className="justify-between">
                  <VStack space="xs" className="flex-1 items-center">
                    <Text size="xs" className="text-gray-600">
                      Extra Loan Payment
                    </Text>
                    <Text size="xl" className="text-primary-500 font-bold">
                      {formatPercentage(loanAllocationPercentage)}
                    </Text>
                    <Text size="sm" className="text-gray-900 font-semibold">
                      {formatCurrency(extraLoanPayment)}/mo
                    </Text>
                  </VStack>

                  <VStack space="xs" className="flex-1 items-center">
                    <Text size="xs" className="text-gray-600">
                      Retirement Savings
                    </Text>
                    <Text size="xl" className="text-primary-500 font-bold">
                      {formatPercentage(100 - loanAllocationPercentage)}
                    </Text>
                    <Text size="sm" className="text-gray-900 font-semibold">
                      {formatCurrency(retirementSavingsAllocation)}/mo
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            )}
          </VStack>

          {/* Impact Projections Section */}
          <Card className="mb-6 bg-white border border-gray-200">
            <VStack space="md" className="p-4">
              <Text className="text-base font-semibold text-gray-900">
                Impact Projections
              </Text>

              <HStack className="justify-between items-center">
                <Text size="sm" className="text-gray-600 flex-1">
                  Loan payoff with extra {formatCurrency(extraLoanPayment)}/mo:
                </Text>
                <Text size="sm" className="text-gray-900 font-medium">
                  ~2-4 years faster
                </Text>
              </HStack>

              <HStack className="justify-between items-center">
                <Text size="sm" className="text-gray-600 flex-1">
                  Retirement in 30 years at {formatCurrency(retirementSavingsAllocation)}/mo:
                </Text>
                <Text size="sm" className="text-gray-900 font-medium">
                  ~$328K
                </Text>
              </HStack>
            </VStack>
          </Card>

          {/* Action Buttons Section */}
          <VStack space="md" className="mb-8">
            <TextButton
              label="Save This Plan"
              variant="primary"
              size="lg"
              onPress={() => console.log("Save plan pressed")}
            />
            <HStack space="md" className="w-full">
              <View className="flex-1">
                <TextButton
                  label="Export Report"
                  variant="outline"
                  size="md"
                  onPress={() => console.log("Export pressed")}
                  className="w-full"
                />
              </View>
              <View className="flex-1">
                <TextButton
                  label="Share Plan"
                  variant="secondary"
                  size="md"
                  onPress={() => console.log("Share pressed")}
                  className="w-full"
                />
              </View>
            </HStack>
          </VStack>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

export default LoanCalculatorContent;

