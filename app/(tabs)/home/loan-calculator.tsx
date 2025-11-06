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
import TextInputField from "@/components/inputs/text-input-field";
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

const formatLargeCurrency = (amount: number) => {
  const value = Math.max(0, amount);
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return formatCurrency(value);
};

const formatPercentage = (value: number) => value.toFixed(0) + "%";

// --- Main Calculator Content ---
const LoanCalculatorContent = () => {
  // State for text inputs (as strings)
  const [totalLoanText, setTotalLoanText] = useState("50000");
  const [interestRateText, setInterestRateText] = useState("5.5");
  const [loanTermText, setLoanTermText] = useState("10");
  const [monthlyIncomeText, setMonthlyIncomeText] = useState("4000");
  const [retirementContributionText, setRetirementContributionText] = useState("5");
  const [loanAllocationPercentage, setLoanAllocationPercentage] = useState(60);

  // Parse string values to numbers for calculations
  const totalLoan = useMemo(() => {
    const parsed = parseFloat(totalLoanText);
    return isNaN(parsed) ? 0 : parsed;
  }, [totalLoanText]);

  const interestRate = useMemo(() => {
    const parsed = parseFloat(interestRateText);
    return isNaN(parsed) ? 0 : parsed;
  }, [interestRateText]);

  const loanTerm = useMemo(() => {
    const parsed = parseFloat(loanTermText);
    return isNaN(parsed) ? 0 : parsed;
  }, [loanTermText]);

  const monthlyIncome = useMemo(() => {
    const parsed = parseFloat(monthlyIncomeText);
    return isNaN(parsed) ? 0 : parsed;
  }, [monthlyIncomeText]);

  const retirementContribution = useMemo(() => {
    const parsed = parseFloat(retirementContributionText);
    return isNaN(parsed) ? 0 : parsed;
  }, [retirementContributionText]);

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
    if (rate > 0 && termMonths > 0 && principal > 0) {
      calculatedPayment =
        (principal * rate) / (1 - Math.pow(1 + rate, -termMonths));
    } else if (termMonths > 0 && principal > 0) {
      calculatedPayment = principal / termMonths;
    }

    const totalInterestPaid = calculatedPayment * termMonths - principal;
    const dti = monthlyIncome > 0 ? (calculatedPayment / monthlyIncome) * 100 : 0;
    const discretionary = monthlyIncome - calculatedPayment;

    return {
      monthlyPayment: calculatedPayment,
      totalInterest: Math.max(0, totalInterestPaid),
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

  // Calculate loan payoff time with extra payments
  const { monthsToPayoff, yearsSaved } = useMemo(() => {
    if (totalLoan <= 0 || monthlyPayment <= 0) {
      return { monthsToPayoff: 0, yearsSaved: 0 };
    }

    const rate = interestRate / 100 / 12;
    const totalPayment = monthlyPayment + extraLoanPayment;

    if (totalPayment <= 0) {
      return { monthsToPayoff: 0, yearsSaved: 0 };
    }

    let balance = totalLoan;
    let months = 0;

    // Calculate months to pay off with extra payment
    while (balance > 0 && months < 360) { // Max 30 years
      const interestCharge = balance * rate;
      const principalPayment = totalPayment - interestCharge;
      balance -= principalPayment;
      months++;
    }

    const originalTermMonths = loanTerm * 12;
    const monthsSaved = originalTermMonths - months;
    const yearsSaved = monthsSaved / 12;

    return { monthsToPayoff: months, yearsSaved: Math.max(0, yearsSaved) };
  }, [totalLoan, monthlyPayment, extraLoanPayment, interestRate, loanTerm]);

  // Calculate retirement savings projection (30 years with 7% average return)
  const retirementProjection = useMemo(() => {
    if (retirementSavingsAllocation <= 0) return 0;

    const monthlyContribution = retirementSavingsAllocation;
    const annualReturn = 0.07; // 7% average annual return
    const monthlyReturn = annualReturn / 12;
    const months = 30 * 12; // 30 years

    // Future value of annuity formula: FV = PMT × [(1 + r)^n - 1] / r
    const futureValue =
      monthlyContribution *
      ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);

    return futureValue;
  }, [retirementSavingsAllocation]);

  return (
    <PageLayout title="Student Loan Guide" profileButtonHidden>
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
            <TextInputField
              label="Total Loan Amount"
              value={totalLoanText}
              onChangeText={setTotalLoanText}
              placeholder="50000"
              keyboardType="numeric"
              prefix="$"
            />

            <TextInputField
              label="Interest Rate"
              value={interestRateText}
              onChangeText={setInterestRateText}
              placeholder="5.5"
              keyboardType="decimal-pad"
              suffix="%"
            />

            <TextInputField
              label="Loan Term (Years)"
              value={loanTermText}
              onChangeText={setLoanTermText}
              placeholder="10"
              keyboardType="numeric"
            />

            <TextInputField
              label="Monthly Income"
              value={monthlyIncomeText}
              onChangeText={setMonthlyIncomeText}
              placeholder="4000"
              keyboardType="numeric"
              prefix="$"
            />

            <TextInputField
              label="Current Retirement Contribution (%)"
              value={retirementContributionText}
              onChangeText={setRetirementContributionText}
              placeholder="5"
              keyboardType="decimal-pad"
              suffix="%"
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
                in interest. However, don't completely neglect retirement savings,
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
                  {yearsSaved > 0
                    ? `~${yearsSaved.toFixed(1)} years faster`
                    : extraLoanPayment === 0
                      ? "No extra payment"
                      : "Same timeframe"}
                </Text>
              </HStack>

              <HStack className="justify-between items-center">
                <Text size="sm" className="text-gray-600 flex-1">
                  Retirement in 30 years at {formatCurrency(retirementSavingsAllocation)}/mo:
                </Text>
                <Text size="sm" className="text-gray-900 font-medium">
                  {retirementProjection > 0
                    ? `~${formatLargeCurrency(retirementProjection)}`
                    : "$0"}
                </Text>
              </HStack>
            </VStack>
          </Card>

          {/* Action Buttons Section */}
          <HStack space="md" className="w-full mb-8">
            <View className="flex-1">
              <TextButton
                label="Export"
                variant="primary"
                size="md"
                onPress={() => console.log("Export pressed")}
              />
            </View>
            <View className="flex-1">
              <TextButton
                label="Share"
                variant="primary"
                size="md"
                onPress={() => console.log("Share pressed")}
              />
            </View>
          </HStack>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

export default LoanCalculatorContent;

