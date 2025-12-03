import AsyncStorage from "@react-native-async-storage/async-storage";
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

const API_BASE_URL = "http://127.0.0.1:5000/api/v1";

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
  } catch (error) {
    console.error("Error fetching job title:", error);
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
  try {
    const setupData = await AsyncStorage.getItem("@simulation_setup");
    const simData = await AsyncStorage.getItem("@simulation_data");

    if (!setupData) {
      router.replace("/(tabs)/simulation");
      return {
        userResponses: null,
        simulationData: null,
        shouldRedirect: true,
      };
    }

    const userResponses = JSON.parse(setupData);
    let simulationData = null;

    if (simData) {
      simulationData = JSON.parse(simData);
    } else {
      console.error("No simulation data found");
    }

    return { userResponses, simulationData, shouldRedirect: false };
  } catch (error) {
    console.error("Error loading setup data:", error);
    return { userResponses: null, simulationData: null, shouldRedirect: false };
  }
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
          // Update simulation data with new summary
          const newSimulationData = {
            ...simulationData,
            summary: updatedData.summary,
            years: updatedParams.years,
            params: updatedParams,
          };

          setSimulationData(newSimulationData);

          // Save to AsyncStorage
          await AsyncStorage.setItem(
            "@simulation_data",
            JSON.stringify(newSimulationData)
          );
        }
      } catch (error) {
        console.error("Error updating simulation with sliders:", error);
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
    console.log("Waiting for backend to update:", {
      sliderYears: years,
      dataYears: simulationData.years,
    });

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

  const labelInterval = years > 30 ? 10 : 5;

  console.log("Chart generation:", {
    years,
    labelInterval,
    willShowLabelsAt: Array.from(
      { length: Math.ceil(years / labelInterval) + 1 },
      (_, i) => i * labelInterval
    ).filter((y) => y > 0 && y <= years),
  });

  const rawMean = simulationData.summary.mean;
  const stdev = simulationData.summary.stdev;

  console.log("Backend simulation data:", {
    mean: rawMean,
    stdev: stdev,
    years: years,
    rawPercentile75: rawMean + stdev * 0.674,
    rawMedian: rawMean,
    rawPercentile25: rawMean - stdev * 0.674,
  });

  const rawPercentile75 = rawMean + stdev * 0.674;
  const rawMedian = rawMean;
  const rawPercentile25 = rawMean - stdev * 0.674;

  console.log("Raw values before adjustments:", {
    rawPercentile75,
    rawMedian,
    rawPercentile25,
  });

  let percentile75, median, percentile25;

  if (rawMean < -100000) {
    percentile75 = stdev * 1.5;
    median = stdev * 0.8;
    percentile25 = stdev * 0.3;
    console.warn(
      "Backend returned very negative mean, using stdev-based estimates"
    );
  } else if (rawMean < 0) {
    percentile75 = Math.abs(rawPercentile75);
    median = Math.abs(rawMedian);
    percentile25 = Math.abs(rawPercentile25);
  } else {
    percentile75 = Math.max(0, rawPercentile75);
    median = Math.max(0, rawMedian);
    percentile25 = Math.max(0, rawPercentile25);
  }

  console.log("Adjusted percentiles:", {
    percentile75,
    median,
    percentile25,
  });

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

  console.log("Chart data length:", chartDatasets.length);
  console.log("Selected years:", years);

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
      console.error("Invalid response structure:", response);
      return [];
    }

    return response.jobs.map((job) => ({
      label: job.title,
      value: job.id, // Use career_id instead of job name
    }));
  } catch (error) {
    console.error("Error loading jobs:", error);
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
  } catch (error) {
    console.error("Error loading setup data:", error);
    return { shouldRedirect: false, isReset: false };
  }
};

export const submitSimulationSetup = async (responses: UserResponses) => {
  try {
    await AsyncStorage.setItem("@simulation_setup", JSON.stringify(responses));
    return { success: true };
  } catch (error) {
    console.error("Error saving setup data:", error);
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
      console.error("Error saving setup data:", result.error);
      return { success: false, error: result.error };
    }
  }
  return { success: false, error: "Form incomplete" };
};

export async function fetchJobsByCategory(
  category: string
): Promise<JobsResponse> {
  try {
    const url = `${API_BASE_URL}/jobs/${category}`;
    console.log("Fetching jobs from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received data:", data);

    return data as JobsResponse;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

export async function fetchSimulationParams(
  userResponses: UserResponses
): Promise<any> {
  try {
    const url = `${API_BASE_URL}/simulation/run`;
    console.log("Fetching simulation params from:", url);

    // Convert state abbreviation to full name
    const locationFullName =
      STATE_ABBR_TO_NAME[userResponses.location] || userResponses.location;

    const requestBody = {
      career_id: userResponses.specificJob,
      location: locationFullName,
      num_children: Number(userResponses.children), // Ensure it's a number
      spending: userResponses.spending,
    };

    console.log("Request body:", requestBody);
    console.log("User responses:", userResponses);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.error || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    console.log("Received simulation data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching simulation params:", error);
    throw error;
  }
}

export async function fetchSimulationWithSliders(params: any): Promise<any> {
  try {
    const url = `${API_BASE_URL}/simulation/sliders`;
    console.log("Fetching simulation with sliders from:", url);
    console.log("Full params object:", JSON.stringify(params, null, 2));
    console.log("Years in params:", params.years);
    console.log("Location in params:", params.location);
    console.log("Starting salary in params:", params.starting_salary);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.error || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    console.log("Received slider simulation data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching simulation with sliders:", error);
    throw error;
  }
}
