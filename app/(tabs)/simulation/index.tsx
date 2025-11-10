import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@/components/ui/slider';
import { Pressable } from '@/components/ui/pressable';
import PageLayout from '@/components/layouts/page-layout';
import TextButton from '@/components/inputs/text-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-gifted-charts';

// Types
interface Question {
  id: string;
  question: string;
  options: { label: string; value: string | number }[];
}

interface UserResponses {
  career: string;
  location: string;
  children: number;
}

// Questions data
const QUESTIONS: Question[] = [
  {
    id: 'career',
    question: 'What is your career field?',
    options: [
      { label: 'Technology', value: 'tech' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Finance', value: 'finance' },
      { label: 'Education', value: 'education' },
      { label: 'Business', value: 'business' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    id: 'location',
    question: 'Where do you plan to live?',
    options: [
      { label: 'Major City (High Cost)', value: 'high_cost' },
      { label: 'Suburban Area (Medium Cost)', value: 'medium_cost' },
      { label: 'Small Town (Low Cost)', value: 'low_cost' },
      { label: 'Rural Area (Very Low Cost)', value: 'very_low_cost' },
    ],
  },
  {
    id: 'children',
    question: 'How many children do you plan to have?',
    options: [
      { label: 'None', value: 0 },
      { label: '1 child', value: 1 },
      { label: '2 children', value: 2 },
      { label: '3 children', value: 3 },
      { label: '4+ children', value: 4 },
    ],
  },
];

// Questions Component
const SimulationQuestions: React.FC<{
  onComplete: (responses: UserResponses) => void;
}> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Partial<UserResponses>>({});
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const handleOptionSelect = (value: string | number) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const newResponses = {
        ...responses,
        [currentQuestion.id]: selectedOption,
      };
      setResponses(newResponses);

      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        // All questions answered
        onComplete(newResponses as UserResponses);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestionId = QUESTIONS[currentQuestionIndex - 1].id;
      setSelectedOption(responses[prevQuestionId as keyof UserResponses] ?? null);
    }
  };

  return (
    <PageLayout title="Life Simulation Setup" backButtonHidden>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Progress Bar */}
          <VStack space="md" className="mb-8">
            <HStack className="justify-between items-center">
              <Text size="sm" className="text-gray-600">
                Question {currentQuestionIndex + 1} of {QUESTIONS.length}
              </Text>
              <Text size="sm" className="text-primary-500 font-semibold">
                {Math.round(progress)}%
              </Text>
            </HStack>
            <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </VStack>

          {/* Question */}
          <VStack space="lg" className="mb-8">
            <Text className="text-2xl font-bold text-gray-900">
              {currentQuestion.question}
            </Text>
            <Text size="sm" className="text-gray-600">
              Select one option to continue
            </Text>
          </VStack>

          {/* Options */}
          <VStack space="md" className="mb-8">
            {currentQuestion.options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => handleOptionSelect(option.value)}
              >
                <Card
                  className={`p-4 border-2 ${
                    selectedOption === option.value
                      ? 'border-primary-500 bg-red-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <HStack className="justify-between items-center">
                    <Text
                      className={`text-base font-medium ${
                        selectedOption === option.value
                          ? 'text-primary-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {option.label}
                    </Text>
                    {selectedOption === option.value && (
                      <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
                        <Text className="text-white text-sm">✓</Text>
                      </View>
                    )}
                  </HStack>
                </Card>
              </Pressable>
            ))}
          </VStack>

          {/* Navigation Buttons */}
          <VStack space="md">
            <TextButton
              label={
                currentQuestionIndex === QUESTIONS.length - 1
                  ? 'See My Simulation'
                  : 'Next'
              }
              variant="primary"
              size="lg"
              onPress={handleNext}
              disabled={selectedOption === null}
            />
            {currentQuestionIndex > 0 && (
              <TextButton
                label="Back"
                variant="outline"
                size="md"
                onPress={handleBack}
              />
            )}
          </VStack>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

// Monte Carlo Simulation Graph Component
const MonteCarloSimulation: React.FC<{
  userResponses: UserResponses;
  onReset: () => void;
}> = ({ userResponses, onReset }) => {
  // Simulation parameters (adjustable with sliders)
  const [savingsRate, setSavingsRate] = useState(15);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [retirementAge, setRetirementAge] = useState(65);

  const screenWidth = Dimensions.get('window').width;

  // Generate Monte Carlo simulation data
  const { chartData, stats } = useMemo(() => {
    const years = 40;
    const simulations = 5; // Number of Monte Carlo paths
    const allPaths: number[][] = [];

    for (let sim = 0; sim < simulations; sim++) {
      const path: number[] = [];
      let netWorth = 0;

      for (let year = 0; year <= years; year++) {
        if (year === 0) {
          path.push(0);
        } else {
          // Random return variation (mean: investmentReturn, volatility: 15%)
          const randomReturn = investmentReturn + (Math.random() - 0.5) * 15;

          // Annual contribution based on savings rate
          const annualSavings = 50000 * (savingsRate / 100);

          // Compound growth
          netWorth = (netWorth + annualSavings) * (1 + randomReturn / 100);
          path.push(Math.round(netWorth));
        }
      }
      allPaths.push(path);
    }

    // Calculate statistics
    const finalValues = allPaths.map((path) => path[path.length - 1]);
    finalValues.sort((a, b) => a - b);

    const median = finalValues[Math.floor(finalValues.length / 2)];
    const percentile25 = finalValues[Math.floor(finalValues.length * 0.25)];
    const percentile75 = finalValues[Math.floor(finalValues.length * 0.75)];

    // Prepare chart data (show all paths)
    const chartDatasets: any[] = [];
    const colors = ['#E11D48', '#F43F5E', '#FB7185', '#FDA4AF', '#FECDD3'];

    allPaths.forEach((path, simIndex) => {
      path.forEach((value, year) => {
        if (!chartDatasets[year]) {
          chartDatasets[year] = {
            value: value,
            label: year === 0 || year % 10 === 0 ? `${year}` : '',
            dataPointText: '',
          };
        }
        // Average the values for display
        if (simIndex === 0) {
          chartDatasets[year].value = value;
        } else {
          chartDatasets[year].value = (chartDatasets[year].value + value) / 2;
        }
      });
    });

    return {
      chartData: chartDatasets,
      stats: { median, percentile25, percentile75 },
    };
  }, [savingsRate, investmentReturn, retirementAge]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <PageLayout title="Life Simulation" backButtonHidden>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* User Profile Summary */}
          <Card className="mb-6 p-4 bg-primary-50 border border-primary-100">
            <VStack space="sm">
              <Text className="text-sm font-bold text-gray-900">
                Your Profile
              </Text>
              <HStack className="flex-wrap gap-2">
                <View className="bg-white px-3 py-1 rounded-full">
                  <Text size="xs" className="text-gray-700">
                    Career: {userResponses.career}
                  </Text>
                </View>
                <View className="bg-white px-3 py-1 rounded-full">
                  <Text size="xs" className="text-gray-700">
                    Location: {userResponses.location}
                  </Text>
                </View>
                <View className="bg-white px-3 py-1 rounded-full">
                  <Text size="xs" className="text-gray-700">
                    Children: {userResponses.children}
                  </Text>
                </View>
              </HStack>
              <Pressable onPress={onReset}>
                <Text size="xs" className="text-primary-500 underline mt-2">
                  Reset Profile
                </Text>
              </Pressable>
            </VStack>
          </Card>

          {/* Net Worth Projection */}
          <VStack space="md" className="mb-6">
            <Text className="text-xl font-bold text-gray-900">
              Net Worth Projection (40 Years)
            </Text>
            <Text size="sm" className="text-gray-600">
              Monte Carlo simulation showing possible outcomes
            </Text>
          </VStack>

          {/* Chart */}
          <Card className="mb-6 p-4 bg-white border border-gray-200">
            <LineChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              color="#E11D48"
              thickness={3}
              startFillColor="rgba(225, 29, 72, 0.3)"
              endFillColor="rgba(225, 29, 72, 0.01)"
              startOpacity={0.9}
              endOpacity={0.2}
              initialSpacing={0}
              noOfSections={4}
              yAxisColor="#E5E7EB"
              xAxisColor="#E5E7EB"
              yAxisTextStyle={{ color: '#6B7280', fontSize: 10 }}
              xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 10 }}
              areaChart
              curved
              hideDataPoints
              yAxisLabelPrefix="$"
              formatYLabel={(value) => {
                const num = parseInt(value);
                if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
                if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
                return value;
              }}
            />
          </Card>

          {/* Statistics */}
          <Card className="mb-6 p-4 bg-white border border-gray-200">
            <VStack space="md">
              <Text className="text-base font-semibold text-gray-900">
                Projected Net Worth in 40 Years
              </Text>

              <VStack space="sm">
                <HStack className="justify-between items-center">
                  <Text size="sm" className="text-gray-600">
                    Best Case (75th percentile)
                  </Text>
                  <Text className="text-base font-bold text-green-600">
                    {formatCurrency(stats.percentile75)}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text size="sm" className="text-gray-600">
                    Median Case (50th percentile)
                  </Text>
                  <Text className="text-base font-bold text-primary-500">
                    {formatCurrency(stats.median)}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text size="sm" className="text-gray-600">
                    Worst Case (25th percentile)
                  </Text>
                  <Text className="text-base font-bold text-orange-600">
                    {formatCurrency(stats.percentile25)}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Card>

          {/* Adjustable Parameters */}
          <VStack space="md" className="mb-6">
            <Text className="text-lg font-bold text-gray-900">
              Adjust Your Assumptions
            </Text>

            {/* Savings Rate Slider */}
            <VStack space="xs">
              <HStack className="justify-between items-center mb-2">
                <Text size="sm" className="text-gray-900 font-medium">
                  Savings Rate
                </Text>
                <Text size="md" className="text-primary-500 font-semibold">
                  {savingsRate}%
                </Text>
              </HStack>
              <Slider
                value={savingsRate}
                minValue={5}
                maxValue={50}
                step={5}
                onChange={setSavingsRate}
                size="md"
              >
                <SliderTrack>
                  <SliderFilledTrack className="bg-primary-500" />
                </SliderTrack>
                <SliderThumb className="bg-primary-500" />
              </Slider>
              <HStack className="justify-between items-center mt-1">
                <Text size="xs" className="text-gray-500">
                  5%
                </Text>
                <Text size="xs" className="text-gray-500">
                  50%
                </Text>
              </HStack>
            </VStack>

            {/* Investment Return Slider */}
            <VStack space="xs">
              <HStack className="justify-between items-center mb-2">
                <Text size="sm" className="text-gray-900 font-medium">
                  Expected Annual Return
                </Text>
                <Text size="md" className="text-primary-500 font-semibold">
                  {investmentReturn}%
                </Text>
              </HStack>
              <Slider
                value={investmentReturn}
                minValue={3}
                maxValue={12}
                step={0.5}
                onChange={setInvestmentReturn}
                size="md"
              >
                <SliderTrack>
                  <SliderFilledTrack className="bg-primary-500" />
                </SliderTrack>
                <SliderThumb className="bg-primary-500" />
              </Slider>
              <HStack className="justify-between items-center mt-1">
                <Text size="xs" className="text-gray-500">
                  3%
                </Text>
                <Text size="xs" className="text-gray-500">
                  12%
                </Text>
              </HStack>
            </VStack>

            {/* Retirement Age Slider */}
            <VStack space="xs">
              <HStack className="justify-between items-center mb-2">
                <Text size="sm" className="text-gray-900 font-medium">
                  Target Retirement Age
                </Text>
                <Text size="md" className="text-primary-500 font-semibold">
                  {retirementAge}
                </Text>
              </HStack>
              <Slider
                value={retirementAge}
                minValue={55}
                maxValue={75}
                step={1}
                onChange={setRetirementAge}
                size="md"
              >
                <SliderTrack>
                  <SliderFilledTrack className="bg-primary-500" />
                </SliderTrack>
                <SliderThumb className="bg-primary-500" />
              </Slider>
              <HStack className="justify-between items-center mt-1">
                <Text size="xs" className="text-gray-500">
                  55
                </Text>
                <Text size="xs" className="text-gray-500">
                  75
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Info Card */}
          <Card className="mb-6 p-4 bg-blue-50 border border-blue-100">
            <VStack space="sm">
              <HStack space="xs" className="items-center">
                <Text size="lg">💡</Text>
                <Text className="text-sm font-bold text-gray-900">
                  What is Monte Carlo Simulation?
                </Text>
              </HStack>
              <Text size="sm" className="text-gray-700 leading-5">
                Monte Carlo simulation runs thousands of scenarios with random market
                returns to show the range of possible outcomes for your financial future.
                This helps you understand both the best and worst-case scenarios.
              </Text>
            </VStack>
          </Card>
        </View>
      </ScrollView>
    </PageLayout>
  );
};

// Main Component
export default function SimulationScreen() {
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userResponses, setUserResponses] = useState<UserResponses | null>(null);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const setupData = await AsyncStorage.getItem('@simulation_setup');
      if (setupData) {
        const data = JSON.parse(setupData);
        setUserResponses(data);
        setHasCompletedSetup(true);
      }
    } catch (error) {
      console.error('Error loading setup data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionComplete = async (responses: UserResponses) => {
    try {
      await AsyncStorage.setItem('@simulation_setup', JSON.stringify(responses));
      setUserResponses(responses);
      setHasCompletedSetup(true);
    } catch (error) {
      console.error('Error saving setup data:', error);
    }
  };

  const handleReset = async () => {
    try {
      await AsyncStorage.removeItem('@simulation_setup');
      setUserResponses(null);
      setHasCompletedSetup(false);
    } catch (error) {
      console.error('Error resetting setup data:', error);
    }
  };

  if (isLoading) {
    return (
      <PageLayout title="Simulation" backButtonHidden>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      </PageLayout>
    );
  }

  if (!hasCompletedSetup || !userResponses) {
    return <SimulationQuestions onComplete={handleQuestionComplete} />;
  }

  return (
    <MonteCarloSimulation userResponses={userResponses} onReset={handleReset} />
  );
}
