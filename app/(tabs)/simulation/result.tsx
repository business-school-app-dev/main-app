import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import PageLayout from '@/components/layouts/page-layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-gifted-charts';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import IconButton from '@/components/inputs/icon-button';
import HelpButton from '@/components/inputs/help-button';
import LabeledSlider from '@/components/inputs/labeled-slider';
import COLORS, { GRAY_COLORS, PRIMARY, PRIMARY_COLORS, SECONDARY_COLORS } from '@/constants/colors';
import { Briefcase, MapPin, Baby, Laptop, Heart, DollarSign, GraduationCap, Building2, Users, Home, TreePine } from 'lucide-react-native';
import { UserResponses, QUESTIONS } from '@/types/Question';
import {
  fetchSimulationWithSliders,
  formatCurrency,
  formatText,
  formatChildrenValue,
  formatChildrenLabel,
  getCareerIcon,
  getLocationIcon,
  generateChartData,
  ChartDataResult,
  loadUserResponses as loadUserResponsesFromStorage,
  createDebouncedSliderChange,
  createStartingSalaryHandler,
  createSavingsRateHandler,
  createYearsHandler,
} from '@/api/simulation';


export default function SimulationResult() {
  const [userResponses, setUserResponses] = useState<UserResponses | null>(null);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState<string>('');

  // Slider states - these will update the params
  const [startingSalary, setStartingSalary] = useState<number>(50000);
  const [savingsRate, setSavingsRate] = useState<number>(20);
  const [years, setYears] = useState<number>(20);
  const [isUpdatingSliders, setIsUpdatingSliders] = useState(false);

  // Debounce timer ref to prevent excessive API calls
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track the latest pending params to avoid race conditions
  const pendingParamsRef = useRef<any>(null);

  // Store previous chart data to show while waiting for backend update
  const previousChartDataRef = useRef<ChartDataResult | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const chartHeight = 250;
  const chartWidth = screenWidth - 80;

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      const { userResponses, simulationData, shouldRedirect } = await loadUserResponsesFromStorage();

      if (shouldRedirect || controller.signal.aborted) {
        return;
      }

      if (userResponses) {
        setUserResponses(userResponses);

        // Fetch job title from backend using career category and job ID
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/jobs/${userResponses.careerCategory}`,
            { signal: controller.signal }
          );
          if (response.ok && !controller.signal.aborted) {
            const data = await response.json();
            const job = data.jobs.find((j: any) => j.id === userResponses.specificJob);
            if (job && !controller.signal.aborted) {
              setJobTitle(job.title);
            }
          }
        } catch {
          // Aborted on unmount or network error — leave jobTitle empty
        }
      }

      if (controller.signal.aborted) return;

      if (simulationData) {
        setSimulationData(simulationData);

        // Initialize slider values from params
        if (simulationData.params) {
          setStartingSalary(Math.round(simulationData.params.starting_salary));
          setSavingsRate(Math.round(simulationData.params.savings_rate * 100));
          setYears(simulationData.params.years || simulationData.years || 20);
        }
      }

      setIsLoading(false);
    };

    loadData();

    return () => controller.abort();
  }, []);

  // Debounced handler for slider changes - calls the backend with updated params
  const debouncedSliderChange = useCallback(
    createDebouncedSliderChange(
      debounceTimerRef,
      pendingParamsRef,
      setIsUpdatingSliders,
      setSimulationData,
      simulationData
    ),
    [simulationData]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Individual slider handlers - update state immediately for smooth UI
  const handleStartingSalaryChange = useCallback(
    createStartingSalaryHandler(simulationData, years, setStartingSalary, debouncedSliderChange),
    [simulationData, debouncedSliderChange, years]
  );

  const handleSavingsRateChange = useCallback(
    createSavingsRateHandler(simulationData, years, setSavingsRate, debouncedSliderChange),
    [simulationData, debouncedSliderChange, years]
  );

  const handleYearsChange = useCallback(
    createYearsHandler(simulationData, setYears, debouncedSliderChange),
    [simulationData, debouncedSliderChange]
  );

  const handleReset = async () => {
    try {
      await AsyncStorage.removeItem('@simulation_setup');
      await AsyncStorage.setItem('@simulation_reset', 'true');
      router.back(); // Go back with left-to-right animation
    } catch (error) {
      console.error('Error resetting setup data:', error);
    }
  };

  // Generate chart data from backend simulation
  const { chartData, xAxisLabels, stats, spacing, chartWidth: dynamicChartWidth } = useMemo(() => {
    const result = generateChartData(simulationData, years, chartWidth, previousChartDataRef.current);

    // Store this chart data for use during slider updates
    previousChartDataRef.current = result;

    return result;
  }, [simulationData, years, chartWidth]);

  if (isLoading) {
    return (
      <PageLayout title="Life Simulation" scrollable={false} canGoBack>
        <View className="flex-1 h-full items-center justify-center">
          <Spinner size="large" color={PRIMARY} />
        </View>
      </PageLayout>
    );
  }

  if (!userResponses) {
    return null;
  }

  const profile = [
    {
      icon: getCareerIcon(userResponses.careerCategory),
      value: jobTitle || 'Loading...',
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
      canGoBack
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
      <VStack space="md" className="mt-6">
        <Text className="text-xl font-bold text-gray-900">
          Net Worth Projection ({years} Years)
        </Text>
        <Text size="sm" className="text-gray-600 mb-4">
          Monte Carlo simulation showing possible outcomes
        </Text>
      </VStack>

      {/* Chart */}
      <Card className="mb-8 p-4 bg-white border border-gray-200 rounded-xl">
        <VStack space="sm">
          {isUpdatingSliders && (
            <View className="absolute inset-0 items-center justify-center z-10 bg-white/80 rounded-xl">
              <Spinner color={PRIMARY} size="large" />
            </View>
          )}
          <LineChart
            data={chartData}
            height={chartHeight}
            width={dynamicChartWidth}
            color={PRIMARY_COLORS[600]}
            thickness={3}
            endSpacing={10}
            startFillColor={`${PRIMARY_COLORS[500]}33`}
            endFillColor={`${PRIMARY_COLORS[500]}33`}
            startOpacity={0.9}
            endOpacity={0.1}
            initialSpacing={10}
            spacing={spacing}
            xAxisLabelTexts={xAxisLabels}
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
            {years}-year projection based on your inputs
          </Text>
        </VStack>
      </Card>

      {/* Statistics */}
      <Card className="mb-8 p-4 bg-white border border-gray-200 rounded-xl">
        <VStack space="md" className="p-4">
          {isUpdatingSliders && (
            <View className="absolute inset-0 items-center justify-center z-10 bg-white/80 rounded-xl">
              <Spinner color={PRIMARY} size="large" />
            </View>
          )}

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

      {/* Sliders Section */}
      <VStack space="md" className="mt-6">
        <Text className="text-xl font-bold text-gray-900">
          Adjust Your Assumptions
        </Text>
        <Card className="p-6 bg-white border border-gray-200 rounded-xl">
          <VStack space="lg">
            <LabeledSlider
              label="Starting Salary"
              value={startingSalary}
              minValue={30000}
              maxValue={200000}
              step={5000}
              onChange={handleStartingSalaryChange}
              formatValue={(val) => formatCurrency(val)}
              className="mb-2"
            />
            <LabeledSlider
              label="Savings Rate"
              value={savingsRate}
              minValue={5}
              maxValue={50}
              step={5}
              onChange={handleSavingsRateChange}
              suffix="%"
              className="mb-2"
            />
            <LabeledSlider
              label="Time Horizon"
              value={years}
              minValue={5}
              maxValue={40}
              step={5}
              onChange={handleYearsChange}
              suffix=" years"
              className="mb-2"
            />
          </VStack>
        </Card>
      </VStack>
    </PageLayout>
  );
}
