import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { UserResponses } from "@/types/Question";
import { JobsResponse } from "@/types/Job";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

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
      value: job.id,  // Use career_id instead of job name
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
    const locationFullName = STATE_ABBR_TO_NAME[userResponses.location] || userResponses.location;

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
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Received simulation data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching simulation params:", error);
    throw error;
  }
}

export async function fetchSimulationWithSliders(
  params: any
): Promise<any> {
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
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Received slider simulation data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching simulation with sliders:", error);
    throw error;
  }
}
