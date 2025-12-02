import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import PageLayout from '@/components/layouts/page-layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-gifted-charts';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import IconButton from '@/components/inputs/icon-button';
import HelpButton from '@/components/inputs/help-button';
import COLORS, { GRAY_COLORS, PRIMARY_COLORS, SECONDARY_COLORS } from '@/constants/colors';
import { Briefcase, MapPin, Baby, Laptop, Heart, DollarSign, GraduationCap, Building2, Users, Home, TreePine } from 'lucide-react-native';
import LabeledSlider from '@/components/inputs/labeled-slider';
import { QUESTIONS, UserResponses } from '@/types/Question';


export default function SimulationResult() {
  const [userResponses, setUserResponses] = useState<UserResponses | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulation parameters (adjustable with sliders)
  const [savingsRate, setSavingsRate] = useState(15);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [retirementAge, setRetirementAge] = useState(65);

  const screenWidth = Dimensions.get('window').width;
  const chartHeight = 250;

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
      await AsyncStorage.setItem('@simulation_reset', 'true');
      router.back(); // Go back with left-to-right animation
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
            // Add label to data point - show only for multiples of 10
            label: year % 10 === 0 ? year.toString() : '',
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

  const formatText = (text: string) => {
    // Replace underscores with spaces and capitalize first letter of each word
    return text === undefined ? text : text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCareerIcon = (career: string) => {
    const iconMap: { [key: string]: any } = {
      tech: Laptop,
      healthcare: Heart,
      finance: DollarSign,
      education: GraduationCap,
      business: Building2,
      other: Briefcase,
    };
    return iconMap[career] || Briefcase;
  };

  const getLocationIcon = (location: string) => {
    const iconMap: { [key: string]: any } = {
      high_cost: Building2,
      medium_cost: Home,
      low_cost: Users,
      very_low_cost: TreePine,
    };
    return iconMap[location] || MapPin;
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

  const formatChildrenValue = (count: number) => {
    if (count === 4) {
      return '4+';
    }
    return count.toString();
  };

  const formatChildrenLabel = (count: number) => {
    return count === 1 ? 'Child' : 'Children';
  };

  const profile = [
    {
      icon: getCareerIcon(userResponses.careerCategory),
      value: formatText(userResponses.specificJob),
      label: 'Job',
    },
    {
      icon: getLocationIcon(userResponses.location),
      value: formatText(
        QUESTIONS.find(q => q.id === "location")?.
          options.find(option => option.value === userResponses.location)?.
          label || userResponses.location),
      label: 'Location',
    },
    {
      icon: Baby,
      value: formatChildrenValue(userResponses.children),
      label: formatChildrenLabel(userResponses.children),
    },
  ];

  const assumptions = [
    {
      label: 'Best Case (75th percentile)',
      value: stats.percentile75,
      color: 'text-green-600',
    },
    {
      label: 'Median Case (50th percentile)',
      value: stats.median,
      color: 'text-primary-500',
    },
    {
      label: 'Worst Case (25th percentile)',
      value: stats.percentile25,
      color: 'text-orange-600',
    },
  ]

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
        <HelpButton
          title="What is Monte Carlo?"
          content="Monte Carlo simulation runs thousands of scenarios with random market returns to show the range of possible outcomes for your financial future. This helps you understand both the best and worst-case scenarios."
        />
      }
    >
      {/* User Profile Summary */}
      <VStack space="md">
        <Text className="text-xl font-bold text-gray-900">
          Your Profile
        </Text>
        <Card className="mb-8 p-4 bg-white border border-gray-200 rounded-xl">
          <HStack className="justify-between items-center mt-2">
            {profile.map((item, index) => (
              <VStack key={index} className="flex-1 items-center" space="xs">
                <View className="w-16 h-16 rounded-full items-center justify-center bg-secondary">
                  <Icon as={item.icon} size="xl" className="text-gray-900" />
                </View>
                <Text size="xs" numberOfLines={1} className="text-gray-900 font-semibold text-center">
                  {item.value}
                </Text>
                <Text size="2xs" className="text-gray-600">
                  {item.label}
                </Text>
              </VStack>
            ))}
          </HStack>
        </Card>
      </VStack>

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
        <VStack space="sm">
          <LineChart
            data={chartData}
            height={chartHeight}
            width={screenWidth - 130}
            color={PRIMARY_COLORS[600]}
            thickness={3}
            endSpacing={0}
            startFillColor={`${PRIMARY_COLORS[500]}33`}
            endFillColor={`${PRIMARY_COLORS[500]}33`}
            startOpacity={0.9}
            endOpacity={0.1}
            initialSpacing={4}
            spacing={7.5}
            noOfSections={4}
            yAxisColor={GRAY_COLORS[200]}
            xAxisColor={GRAY_COLORS[200]}
            yAxisTextStyle={{ color: GRAY_COLORS[500], fontSize: 10 }}
            xAxisLabelTextStyle={{ color: GRAY_COLORS[500], fontSize: 10 }}
            showXAxisIndices
            xAxisIndicesHeight={5}
            xAxisIndicesWidth={1}
            xAxisIndicesColor={GRAY_COLORS[300]}
            areaChart
            curved
            isAnimated
            showDataPointLabelOnFocus
            hideDataPoints
            yAxisLabelPrefix="$"
            disableScroll={true}
            hideRules={false}
            formatYLabel={(value: string) => {
              const num = parseInt(value);
              if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
              if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
              return value;
            }}
            pointerConfig={{
              pointerStripHeight: chartHeight,
              pointerStripColor: PRIMARY_COLORS[500],
              pointerStripWidth: 1.5,
              pointerColor: PRIMARY_COLORS[500],
              radius: 6,
              pointerLabelWidth: 100,
              // pointerLabelHeight: 50,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: (items: any[]) => {
                return (
                  <Text className="h-fit w-fit text-primary text-center text-sm font-semibold -ml-[77px] mt-[33.5px]">
                    {formatCurrency(items[0].value)}
                  </Text>
                );
              },
            }}
          />
          <Text size="xs" className="text-gray-500 text-center">
            40-year projection based on your inputs
          </Text>
        </VStack>
      </Card>

      {/* Statistics */}
      <Card className="mb-8 p-4 bg-white border border-gray-200 rounded-xl">
        <VStack space="md" className="p-4">
          <Text className="text-base font-semibold text-gray-900">
            Projected Net Worth in 40 Years
          </Text>

          <VStack space="sm">
            {assumptions.map((stat, index) => (
              <HStack key={index} className="justify-between items-center">
                <Text size="sm" className="text-gray-600">
                  {stat.label}
                </Text>
                <Text className={`text-base font-bold ${stat.color}`}>
                  {formatCurrency(stat.value)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Card>

      {/* Adjustable Parameters */}
      <VStack space="md" className="mb-8">
        <Text className="text-lg font-bold text-gray-900">
          Adjust Your Assumptions
        </Text>

        <LabeledSlider
          label="Savings Rate"
          value={savingsRate}
          minValue={5}
          maxValue={50}
          step={5}
          onChange={setSavingsRate}
          suffix="%"
        />

        <LabeledSlider
          label="Expected Annual Return"
          value={investmentReturn}
          minValue={3}
          maxValue={12}
          step={0.5}
          onChange={setInvestmentReturn}
          suffix="%"
        />

        <LabeledSlider
          label="Target Retirement Age"
          value={retirementAge}
          minValue={55}
          maxValue={75}
          step={1}
          onChange={setRetirementAge}
          suffix=""
        />
      </VStack>
    </PageLayout>
  );
}
