import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";
import { UserResponses } from "@/types/Question";
import { JobsResponse } from "@/types/Job";
import {
  Laptop,
  Heart,
  DollarSign,
  GraduationCap,
  Building2,
  Briefcase,
  Home,
  Users,
  TreePine,
  MapPin,
} from "lucide-react-native";

// Formatting functions
export const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

export const formatText = (text: string) => {
  // Replace underscores with spaces and capitalize first letter of each word
  return text === undefined
    ? text
    : text
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const formatChildrenValue = (count: number) => {
  if (count === 4) {
    return "4+";
  }
  return count.toString();
};

export const formatChildrenLabel = (count: number) => {
  return count === 1 ? "Child" : "Children";
};

// Helper method to get job title by ID
export const getJobTitleById = async (
  careerCategory: string,
  jobId: string | number
): Promise<string> => {
  try {
    const response = await fetchJobsByCategory(careerCategory);
    if (response && response.jobs && Array.isArray(response.jobs)) {
      const job = response.jobs.find((j) => j.id === jobId);
      return job ? job.title : String(jobId);
    }
    return String(jobId);
  } catch {
    return String(jobId);
  }
};

// Icon mapping functions
export const getCareerIcon = (career: string) => {
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

export const getLocationIcon = (location: string) => {
  const iconMap: { [key: string]: any } = {
    high_cost: Building2,
    medium_cost: Home,
    low_cost: Users,
    very_low_cost: TreePine,
  };
  return iconMap[location] || MapPin;
};

// Load user responses and simulation data from storage
export const loadUserResponses = async () => {
  const setupData = await AsyncStorage.getItem("@simulation_setup").catch(
    () => null
  );
  const simData = await AsyncStorage.getItem("@simulation_data").catch(
    () => null
  );

  if (!setupData) {
    router.replace("/(tabs)/simulation");
    return {
      userResponses: null,
      simulationData: null,
      shouldRedirect: true,
    };
  }

  let userResponses;
  try {
    userResponses = JSON.parse(setupData);
  } catch {
    // Corrupted setup data — clear and send user back to setup
    await AsyncStorage.multiRemove([
      "@simulation_setup",
      "@simulation_data",
    ]).catch(() => {});
    router.replace("/(tabs)/simulation");
    return {
      userResponses: null,
      simulationData: null,
      shouldRedirect: true,
    };
  }

  let simulationData = null;
  if (simData) {
    try {
      simulationData = JSON.parse(simData);
    } catch {
      await AsyncStorage.removeItem("@simulation_data").catch(() => {});
    }
  }

  return { userResponses, simulationData, shouldRedirect: false };
};

// Debounced slider change handler
export const createDebouncedSliderChange = (
  debounceTimerRef: React.MutableRefObject<ReturnType<
    typeof setTimeout
  > | null>,
  pendingParamsRef: React.MutableRefObject<any>,
  setIsUpdatingSliders: (value: boolean) => void,
  setSimulationData: (data: any) => void,
  simulationData: any
) => {
  return async (updatedParams: any) => {
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
          // Update simulation data with new summary, preserving job_name
          const newSimulationData = {
            ...simulationData,
            summary: updatedData.summary,
            years: updatedParams.years,
            params: {
              ...updatedParams,
              job_name: simulationData.params?.job_name, // Preserve job_name from original data
            },
          };

          setSimulationData(newSimulationData);

          // Save to AsyncStorage
          await AsyncStorage.setItem(
            "@simulation_data",
            JSON.stringify(newSimulationData)
          );
        }
      } catch {
        if (pendingParamsRef.current === updatedParams) {
          Alert.alert(
            "Update Failed",
            "We couldn't update your simulation. Please try again."
          );
        }
      } finally {
        // Only clear loading if this was the latest request
        if (pendingParamsRef.current === updatedParams) {
          setIsUpdatingSliders(false);
        }
      }
    }, 500); // Wait 500ms after user stops moving slider
  };
};

// Individual slider handlers
export const createStartingSalaryHandler = (
  simulationData: any,
  years: number,
  setStartingSalary: (value: number) => void,
  debouncedSliderChange: (params: any) => void
) => {
  return (value: number) => {
    if (!simulationData?.params) return;

    setStartingSalary(value); // Immediate UI update
    const updatedParams = {
      ...simulationData.params,
      starting_salary: value,
      years: years, // Ensure years is always included
    };
    debouncedSliderChange(updatedParams); // Debounced API call
  };
};

export const createSavingsRateHandler = (
  simulationData: any,
  years: number,
  setSavingsRate: (value: number) => void,
  debouncedSliderChange: (params: any) => void
) => {
  return (value: number) => {
    if (!simulationData?.params) return;

    setSavingsRate(value); // Immediate UI update
    const updatedParams = {
      ...simulationData.params,
      savings_rate: value / 100, // Convert percentage to decimal
      years: years, // Ensure years is always included
    };
    debouncedSliderChange(updatedParams); // Debounced API call
  };
};

export const createYearsHandler = (
  simulationData: any,
  setYears: (value: number) => void,
  debouncedSliderChange: (params: any) => void
) => {
  return (value: number) => {
    if (!simulationData?.params) return;

    setYears(value); // Immediate UI update
    const updatedParams = {
      ...simulationData.params,
      years: value,
    };
    debouncedSliderChange(updatedParams); // Debounced API call
  };
};

// Chart data generation
export interface ChartDataResult {
  chartData: any[];
  xAxisLabels: string[];
  stats: { median: number; percentile25: number; percentile75: number };
  spacing: number;
  chartWidth: number;
}

export const generateChartData = (
  simulationData: any,
  years: number,
  chartWidth: number,
  previousChartData: ChartDataResult | null
): ChartDataResult => {
  if (!simulationData || !simulationData.summary) {
    // Return empty data if no simulation data
    return {
      chartData: [],
      xAxisLabels: ["0", "5", "10", "15", "20", "25", "30", "35", "40"],
      stats: { median: 0, percentile25: 0, percentile75: 0 },
      spacing: 40,
      chartWidth: chartWidth,
    };
  }

  // Don't regenerate chart if years slider has changed but backend hasn't responded yet
  if (simulationData.years !== years) {
    if (previousChartData) {
      return previousChartData;
    }

    return {
      chartData: [],
      xAxisLabels: ["0", "5", "10", "15", "20", "25", "30", "35", "40"],
      stats: { median: 0, percentile25: 0, percentile75: 0 },
      spacing: 40,
      chartWidth: chartWidth,
    };
  }

  const rawMean = Number(simulationData.summary.mean);
  const stdev = Number(simulationData.summary.stdev);

  if (!Number.isFinite(rawMean) || !Number.isFinite(stdev)) {
    return {
      chartData: [],
      xAxisLabels: ["0", "5", "10", "15", "20", "25", "30", "35", "40"].filter(
        (m) => Number(m) <= years
      ),
      stats: { median: 0, percentile25: 0, percentile75: 0 },
      spacing: 40,
      chartWidth: chartWidth,
    };
  }

  const safeStdev = Math.max(0, stdev);

  // Always use mean ± 0.674σ, clamp at 0 so negative net worth doesn't invert
  // the ordering of the percentiles via Math.abs.
  const percentile75 = Math.max(0, rawMean + safeStdev * 0.674);
  const median = Math.max(0, rawMean);
  const percentile25 = Math.max(0, rawMean - safeStdev * 0.674);

  const targetValue = percentile75;
  const allMilestones = [0, 5, 10, 15, 20, 25, 30, 35, 40];
  const chartDatasets: any[] = [];

  for (const milestone of allMilestones) {
    if (milestone > years) {
      break;
    }

    if (milestone === 0) {
      chartDatasets.push({
        value: 0,
        dataPointText: "",
      });
    } else {
      const progress = milestone / years;
      const exponentialFactor = Math.pow(progress, 1.5);
      const yearValue = targetValue * exponentialFactor;

      chartDatasets.push({
        value: Math.round(yearValue),
        dataPointText: "",
      });
    }
  }

  const xAxisLabels = allMilestones
    .filter((m) => m <= years)
    .map((m) => m.toString());

  const availableWidth = chartWidth - 20 - 10 - 10;
  const calculatedSpacing =
    chartDatasets.length > 1 ? availableWidth / (chartDatasets.length - 1) : 0;

  return {
    chartData: chartDatasets,
    xAxisLabels: xAxisLabels,
    stats: { median, percentile25, percentile75 },
    spacing: calculatedSpacing,
    chartWidth: chartWidth,
  };
};

// Map state abbreviations to full names for backend API
const STATE_ABBR_TO_NAME: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

export const loadJobs = async (
  category: string,
  setIsLoadingJobs: (loading: boolean) => void,
  setJobOptions: (
    options: {
      label: string;
      value: string | number;
    }[]
  ) => void
) => {
  setIsLoadingJobs(true);
  try {
    const response = await fetchJobsByCategory(category);

    // Validate response has jobs array
    if (!response || !response.jobs || !Array.isArray(response.jobs)) {
      return [];
    }

    return response.jobs.map((job) => ({
      label: job.title,
      value: job.id, // Use career_id instead of job name
    }));
  } catch {
    return [];
  }
};

export const checkExistingSetup = async () => {
  try {
    const resetFlag = await AsyncStorage.getItem("@simulation_reset");
    if (resetFlag === "true") {
      await AsyncStorage.removeItem("@simulation_reset");
      return { shouldRedirect: false, isReset: true };
    }

    const setupData = await AsyncStorage.getItem("@simulation_setup");
    if (setupData) {
      return { shouldRedirect: true, isReset: false };
    }

    return { shouldRedirect: false, isReset: false };
  } catch {
    return { shouldRedirect: false, isReset: false };
  }
};

export const submitSimulationSetup = async (responses: UserResponses) => {
  try {
    await AsyncStorage.setItem("@simulation_setup", JSON.stringify(responses));
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const initializeSimulationSetup = async () => {
  const result = await checkExistingSetup();
  if (result.shouldRedirect) {
    router.replace("/(tabs)/simulation/result");
    return { shouldNavigate: true, shouldLoad: false };
  }
  return { shouldNavigate: false, shouldLoad: true };
};

export const handleSimulationReset = async () => {
  const result = await checkExistingSetup();
  if (result.isReset) {
    return {
      shouldClearResponses: true,
      shouldLoad: true,
      shouldNavigate: false,
    };
  } else if (result.shouldRedirect) {
    router.replace("/(tabs)/simulation/result");
    return {
      shouldClearResponses: false,
      shouldLoad: false,
      shouldNavigate: true,
    };
  }
  return {
    shouldClearResponses: false,
    shouldLoad: true,
    shouldNavigate: false,
  };
};

export const loadJobOptionsForCategory = async (category: string) => {
  const response = await fetchJobsByCategory(category);
  if (!response || !response.jobs || !Array.isArray(response.jobs)) {
    return [];
  }
  return response.jobs.map((job) => ({
    label: job.title,
    value: job.id,
  }));
};

export const submitSimulationForm = async (
  responses: Partial<UserResponses>,
  totalQuestions: number
) => {
  if (Object.keys(responses).length === totalQuestions) {
    const result = await submitSimulationSetup(responses as UserResponses);
    if (result.success) {
      router.push("/(tabs)/simulation/result");
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  }
  return { success: false, error: "Form incomplete" };
};

export async function fetchJobsByCategory(
  category: string
): Promise<JobsResponse> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/jobs/${category}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data as JobsResponse;
}

export async function fetchSimulationParams(
  userResponses: UserResponses
): Promise<any> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/simulation/run`;

  // Convert state abbreviation to full name
  const locationFullName =
    STATE_ABBR_TO_NAME[userResponses.location] || userResponses.location;

  const requestBody = {
    career_id: userResponses.specificJob,
    location: locationFullName,
    num_children: Number(userResponses.children), // Ensure it's a number
    spending: userResponses.spending,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${
        errorData.error || "Unknown error"
      }`
    );
  }

  const data = await response.json();

  return data;
}

export async function fetchSimulationWithSliders(params: any): Promise<any> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/simulation/sliders`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${
        errorData.error || "Unknown error"
      }`
    );
  }

  const data = await response.json();

  return data;
}
