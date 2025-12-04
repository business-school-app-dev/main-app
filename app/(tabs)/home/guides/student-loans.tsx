import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Sparkles, DollarSign } from "lucide-react-native";
import TextInputField from "@/components/inputs/text-input-field";
import PageLayout from "@/components/layouts/page-layout";
import LabeledSlider from "@/components/inputs/labeled-slider";
import HelpButton from "@/components/inputs/help-button";
import {
  calculateLoanDetails,
  formatCurrency,
  formatLargeCurrency,
  formatPercentage,
} from "@/api/student-loans";

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

  const {
    monthlyPayment,
    totalInterest,
    debtToIncome,
    availableDiscretionaryIncome,
    effectiveDiscretionaryIncome,
    extraLoanPayment,
    retirementSavingsAllocation,
    yearsSaved,
    retirementProjection,
  } = useMemo(() => {
    return calculateLoanDetails({
      totalLoan,
      interestRate,
      loanTerm,
      monthlyIncome,
      loanAllocationPercentage,
    });
  }, [totalLoan, interestRate, loanTerm, monthlyIncome, loanAllocationPercentage]);

  return (
    <PageLayout
      title="Student Loans"
      canGoBack
      rightView={
        <HelpButton
          title="Your Path to Financial Freedom"
          content="Enter your student loan details to receive personalized advice on balancing loan repayment with retirement savings. This calculator helps you understand your monthly payments, debt-to-income ratio, and how to optimize your financial future."
          variant="link"
          color="white"
        />
      }
    >
      {/* Section Title */}
      <Text className="text-xl font-bold text-gray-900">
        Loan Details
      </Text>
      {/* Loan Inputs Section */}
      <VStack space="xl" className="my-6">
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
      <Card className="rounded-xl mb-8 bg-white border border-gray-200">
        <VStack space="md" className="p-4">
          <Text className="text-lg font-semibold text-gray-900">
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
      <Card className="rounded-xl mb-8 bg-secondary-0 border border-secondary-300">
        <VStack space="sm" className="p-4">
          <HStack space="xs" className="items-center">
            <Icon as={Sparkles} size="md" className="text-secondary-600" />
            <Text className="text-lg font-semibold text-gray-900">
              AI Generated Recommendation
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
      <Card className="rounded-xl mb-8 bg-white border border-gray-200">
        <VStack space="sm" className="p-4">
          <HStack space="xs" className="items-center">
            <Icon as={DollarSign} size="md" className="text-primary-500" />
            <Text className="text-lg font-semibold text-gray-900">
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
      <VStack space="md" className="mt-6 mb-8">
        <Text className="text-xl font-bold text-gray-900">
          Adjust Your Allocation
        </Text>

        {effectiveDiscretionaryIncome <= 0 ? (
          <Card className="rounded-xl p-4 bg-primary-0 border border-primary-200">
            <Text size="sm" className="text-primary-800">
              Warning: Your expenses ({formatCurrency(monthlyPayment)}/mo) exceed
              your income. No discretionary income available.
            </Text>
          </Card>
        ) : (
          <Card className="rounded-xl p-6 bg-white border border-gray-200">
            <VStack space="lg">
              <Text size="sm" className="text-gray-700">
                Based on your available discretionary income of{" "}
                <Text size="sm" className="text-primary-500 font-semibold">
                  {formatCurrency(effectiveDiscretionaryIncome)}/month
                </Text>
                , decide how to split between extra loan payments and retirement savings.
              </Text>

              <LabeledSlider
                label="Loan vs Retirement Split"
                value={loanAllocationPercentage}
                minValue={0}
                maxValue={100}
                step={1}
                onChange={setLoanAllocationPercentage}
                suffix="%"
              />

              <HStack space="md" className="justify-between mt-2">
                <Card className="rounded-xl flex-1 bg-white border border-gray-200">
                  <VStack space="xs" className="p-4 items-center">
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
                </Card>

                <Card className="rounded-xl flex-1 bg-white border border-gray-200">
                  <VStack space="xs" className="p-4 items-center">
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
                </Card>
              </HStack>
            </VStack>
          </Card>
        )}
      </VStack>

      {/* Impact Projections Section */}
      <Card className="rounded-xl mb-8 bg-white border border-gray-200">
        <VStack space="md" className="p-4">
          <Text className="text-lg font-semibold text-gray-900">
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
    </PageLayout>
  );
};

export default LoanCalculatorContent;
