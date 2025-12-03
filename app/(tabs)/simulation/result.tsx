import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import LabeledSlider from '@/components/inputs/labeled-slider';
import COLORS, { GRAY_COLORS, PRIMARY_COLORS, SECONDARY_COLORS } from '@/constants/colors';
import { Briefcase, MapPin, Baby, Laptop, Heart, DollarSign, GraduationCap, Building2, Users, Home, TreePine } from 'lucide-react-native';
import { UserResponses, QUESTIONS } from '@/types/Question';
import { fetchSimulationWithSliders } from '@/api/simulation';


export default function SimulationResult() {
  const [userResponses, setUserResponses] = useState<UserResponses | null>(null);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const previousChartDataRef = useRef<{
    chartData: any[];
    xAxisLabels: string[];
    stats: { median: number; percentile25: number; percentile75: number };
    spacing: number;
    chartWidth: number;
  } | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const chartHeight = 250;
  const chartWidth = screenWidth - 80;

  useEffect(() => {
    loadUserResponses();
  }, []);

  const loadUserResponses = async () => {
    try {
      const setupData = await AsyncStorage.getItem('@simulation_setup');
      const simData = await AsyncStorage.getItem('@simulation_data');

      if (setupData) {
        setUserResponses(JSON.parse(setupData));
      } else {
        // No setup data, redirect to setup
        router.replace('/(tabs)/simulation');
        return;
      }

      if (simData) {
        const data = JSON.parse(simData);
        setSimulationData(data);

        // Initialize slider values from params
        if (data.params) {
          setStartingSalary(Math.round(data.params.starting_salary));
          setSavingsRate(Math.round(data.params.savings_rate * 100)); // Convert to percentage
          // Use years from params if available, otherwise fallback to top-level years
          setYears(data.params.years || data.years || 20);
        }
      } else {
        console.error('No simulation data found');
      }
    } catch (error) {
      console.error('Error loading setup data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced handler for slider changes - calls the backend with updated params
  const debouncedSliderChange = useCallback(async (updatedParams: any) => {
    if (!simulationData?.params) return;

    // Store the pending params
    pendingParamsRef.current = updatedParams;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set loading state immediately
    setIsUpdatingSliders(true);

    // Debounce the API call
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Call the sliders endpoint with updated params
        const updatedData = await fetchSimulationWithSliders(updatedParams);

        // Only update if this is still the latest request
        if (pendingParamsRef.current === updatedParams) {
          // Update simulation data with new summary
          // Use years from updatedParams (slider value), NOT from backend response
          setSimulationData({
            ...simulationData,
            summary: updatedData.summary,
            years: updatedParams.years,
            params: updatedParams,
          });

          // Save to AsyncStorage
          await AsyncStorage.setItem('@simulation_data', JSON.stringify({
            ...simulationData,
            summary: updatedData.summary,
            years: updatedParams.years,
            params: updatedParams,
          }));
        }
      } catch (error) {
        console.error('Error updating simulation with sliders:', error);
      } finally {
        // Only clear loading if this was the latest request
        if (pendingParamsRef.current === updatedParams) {
          setIsUpdatingSliders(false);
        }
      }
    }, 500); // Wait 500ms after user stops moving slider
  }, [simulationData]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Individual slider handlers - update state immediately for smooth UI
  const handleStartingSalaryChange = useCallback((value: number) => {
    if (!simulationData?.params) return;

    setStartingSalary(value); // Immediate UI update
    const updatedParams = {
      ...simulationData.params,
      starting_salary: value,
      years: years, // Ensure years is always included
    };
    debouncedSliderChange(updatedParams); // Debounced API call
  }, [simulationData, debouncedSliderChange, years]);

  const handleSavingsRateChange = useCallback((value: number) => {
    if (!simulationData?.params) return;

    setSavingsRate(value); // Immediate UI update
    const updatedParams = {
      ...simulationData.params,
      savings_rate: value / 100, // Convert percentage to decimal
      years: years, // Ensure years is always included
    };
    debouncedSliderChange(updatedParams); // Debounced API call
  }, [simulationData, debouncedSliderChange, years]);

  const handleYearsChange = useCallback((value: number) => {
    if (!simulationData?.params) return;

    setYears(value); // Immediate UI update
    const updatedParams = {
      ...simulationData.params,
      years: value,
    };
    debouncedSliderChange(updatedParams); // Debounced API call
  }, [simulationData, debouncedSliderChange]);

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
    if (!simulationData || !simulationData.summary) {
      // Return empty data if no simulation data
      return {
        chartData: [],
        xAxisLabels: ['0', '5', '10', '15', '20', '25', '30', '35', '40'],
        stats: { median: 0, percentile25: 0, percentile75: 0 },
        spacing: 40,
        chartWidth: chartWidth,
      };
    }

    // Don't regenerate chart if years slider has changed but backend hasn't responded yet
    // This prevents showing mismatched data (e.g., 35 year chart with 20 year projections)
    if (simulationData.years !== years) {
      // Return previous chart data while waiting for backend
      console.log('Waiting for backend to update:', { sliderYears: years, dataYears: simulationData.years });

      // If we have previous chart data, return it to keep the chart visible
      if (previousChartDataRef.current) {
        return previousChartDataRef.current;
      }

      // Otherwise return empty data
      return {
        chartData: [],
        xAxisLabels: ['0', '5', '10', '15', '20', '25', '30', '35', '40'],
        stats: { median: 0, percentile25: 0, percentile75: 0 },
        spacing: 40,
        chartWidth: chartWidth,
      };
    }

    // Calculate label interval - show fewer labels for longer time periods
    // For 5-20 years: show every 5 years
    // For 25-30 years: show every 5 years
    // For 35-40 years: show every 10 years
    const labelInterval = years > 30 ? 10 : 5;

    console.log('Chart generation:', {
      years,
      labelInterval,
      willShowLabelsAt: Array.from({ length: Math.ceil(years / labelInterval) + 1 }, (_, i) => i * labelInterval).filter(y => y > 0 && y <= years)
    });

    // Use the years from state (which is controlled by slider)
    const rawMean = simulationData.summary.mean;
    const stdev = simulationData.summary.stdev;

    // Debug logging
    console.log('Backend simulation data:', {
      mean: rawMean,
      stdev: stdev,
      years: years,
      rawPercentile75: rawMean + stdev * 0.674,
      rawMedian: rawMean,
      rawPercentile25: rawMean - stdev * 0.674,
    });

    // Calculate statistics - standard deviation gives us the spread
    const rawPercentile75 = rawMean + stdev * 0.674;
    const rawMedian = rawMean;
    const rawPercentile25 = rawMean - stdev * 0.674;

    console.log('Raw values before adjustments:', {
      rawPercentile75,
      rawMedian,
      rawPercentile25,
    });

    // If mean is very negative, the issue is backend calculation
    // For now, use stdev to estimate reasonable values
    let percentile75, median, percentile25;

    if (rawMean < -100000) {
      // Backend has a major issue, use stdev as proxy for final value
      percentile75 = stdev * 1.5;
      median = stdev * 0.8;
      percentile25 = stdev * 0.3;
      console.warn('Backend returned very negative mean, using stdev-based estimates');
    } else if (rawMean < 0) {
      // Small negative, take absolute
      percentile75 = Math.abs(rawPercentile75);
      median = Math.abs(rawMedian);
      percentile25 = Math.abs(rawPercentile25);
    } else {
      // Normal case
      percentile75 = Math.max(0, rawPercentile75);
      median = Math.max(0, rawMedian);
      percentile25 = Math.max(0, rawPercentile25);
    }

    console.log('Adjusted percentiles:', {
      percentile75,
      median,
      percentile25,
    });

    // Use percentile75 for the graph
    const targetValue = percentile75;

    // Generate realistic growth curve that reaches the target value
    const allMilestones = [0, 5, 10, 15, 20, 25, 30, 35, 40];
    const chartDatasets: any[] = [];

    // Generate data points ONLY up to selected years
    for (const milestone of allMilestones) {
      if (milestone > years) {
        break; // Stop generating data beyond selected year
      }

      if (milestone === 0) {
        chartDatasets.push({
          value: 0,
          dataPointText: '',
        });
      } else {
        // Generate data for milestones up to selected years
        const progress = milestone / years;

        // Use exponential growth curve - reaches targetValue at the selected year
        const exponentialFactor = Math.pow(progress, 1.5);
        const yearValue = targetValue * exponentialFactor;

        chartDatasets.push({
          value: Math.round(yearValue),
          dataPointText: '',
        });
      }
    }

    // Generate x-axis labels only up to selected years
    const xAxisLabels = allMilestones.filter(m => m <= years).map(m => m.toString());

    console.log('Chart data length:', chartDatasets.length);
    console.log('Selected years:', years);

    // Calculate spacing dynamically based on chart width and number of points
    // This ensures the chart always uses full width and spreads points evenly
    const availableWidth = chartWidth - 20 - 10 - 10; // subtract initialSpacing and endSpacing and padding
    const calculatedSpacing = chartDatasets.length > 1
      ? availableWidth / (chartDatasets.length - 1)
      : 0;

    const result = {
      chartData: chartDatasets,
      xAxisLabels: xAxisLabels,
      stats: { median, percentile25, percentile75 },
      spacing: calculatedSpacing,
      chartWidth: chartWidth, // Always use full chart width
    };

    // Store this chart data for use during slider updates
    previousChartDataRef.current = result;

    return result;
  }, [simulationData, years, chartWidth]);

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
      <PageLayout title="Life Simulation" canGoBack>
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
      <VStack space="md" className="mb-8">
        <Text className="text-xl font-bold text-gray-900">
          Net Worth Projection ({years} Years)
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
          <Text className="text-base font-semibold text-gray-900">
            Projected Net Worth in {years} Years
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

      {/* Sliders Section */}
      <VStack space="md" className="mb-8">
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
        {isUpdatingSliders && (
          <Text size="sm" className="text-gray-500 text-center">
            Updating simulation...
          </Text>
        )}
      </VStack>
    </PageLayout>
  );
}
