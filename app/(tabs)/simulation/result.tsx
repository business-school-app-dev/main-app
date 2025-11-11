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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-gifted-charts';
import { router } from 'expo-router';
import { Lightbulb } from 'lucide-react-native';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@/components/ui/modal';
import IconButton from '@/components/inputs/icon-button';
import { Heading } from '@/components/ui/heading';

// Types
export interface UserResponses {
  career: string;
  location: string;
  children: number;
}

export default function SimulationResult() {
  const [userResponses, setUserResponses] = useState<UserResponses | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Simulation parameters (adjustable with sliders)
  const [savingsRate, setSavingsRate] = useState(15);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [retirementAge, setRetirementAge] = useState(65);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadUserResponses();
  }, []);

  const loadUserResponses = async () => {
    try {
      const setupData = await AsyncStorage.getItem('@simulation_setup');
      if (setupData) {
        setUserResponses(JSON.parse(setupData));
      } else {
        // No setup data, redirect to setup
        router.replace('/(tabs)/simulation');
      }
    } catch (error) {
      console.error('Error loading setup data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await AsyncStorage.removeItem('@simulation_setup');
      router.replace('/(tabs)/simulation'); // animation needs to be fixed!
    } catch (error) {
      console.error('Error resetting setup data:', error);
    }
  };

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

  if (isLoading) {
    return (
      <PageLayout title="Life Simulation">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      </PageLayout>
    );
  }

  if (!userResponses) {
    return null;
  }

  return (
    <PageLayout
      title="Life Simulation"
      leftView={
        <IconButton
          iconName="arrow-back"
          variant="link"
          color="white"
          onPress={handleReset}
        />
      }
      rightView={
        <IconButton
          iconName="help-circle"
          variant="link"
          color="white"
          onPress={() => setShowModal(true)}
        />}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          {/* User Profile Summary */}
          <Card className="mb-8 p-4 bg-primary-50 border border-primary-100 rounded-xl">
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
            </VStack>
          </Card>

          {/* Net Worth Projection */}
          <VStack space="md" className="mb-8">
            <Text className="text-xl font-bold text-gray-900">
              Net Worth Projection (40 Years)
            </Text>
            <Text size="sm" className="text-gray-600">
              Monte Carlo simulation showing possible outcomes
            </Text>
          </VStack>

          {/* Chart */}
          <Card className="mb-8 p-4 bg-white border border-gray-200 rounded-xl">
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
              formatYLabel={(value: string) => {
                const num = parseInt(value);
                if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
                if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
                return value;
              }}
            />
          </Card>

          {/* Statistics */}
          <Card className="mb-8 p-4 bg-white border border-gray-200 rounded-xl">
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
          <VStack space="md" className="mb-8">
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
        </View>
      </ScrollView>

      {/* Help Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalBackdrop />
        <ModalContent className="rounded-xl">
          <ModalHeader>
            <Heading size="lg">
              What is Monte Carlo Simulation?
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            <Text className="text-base text-gray-700 leading-6">
              Monte Carlo simulation runs thousands of scenarios with random market
              returns to show the range of possible outcomes for your financial future.
              This helps you understand both the best and worst-case scenarios.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
}
