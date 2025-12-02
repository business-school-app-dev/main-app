import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { UserResponses } from "@/types/Question";
import { JobsResponse } from "@/types/Job";

const API_BASE_URL = "http://127.0.0.1:5000/api/v1";

export const fetchJobs = async (category: string) => {
  try {
    const response = await fetchJobsByCategory(category);

    // Validate response has jobs array
    if (!response || !response.jobs || !Array.isArray(response.jobs)) {
      console.error("Invalid response structure:", response);
      return [];
    }

    return response.jobs.map((job) => ({
      label: job.title,
      value: job.value,
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
  const jobs = await fetchJobs(category);
  return jobs;
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
