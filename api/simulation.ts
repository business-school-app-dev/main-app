import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Animated } from "react-native";
import { UserResponses, QUESTIONS } from "@/types/Question";
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
      setJobOptions([]);
      return;
    }

    const jobOpts = response.jobs.map((job) => ({
      label: job.title,
      value: job.id,  // Use career_id instead of job name
    }));
    setJobOptions(jobOpts);
  } catch (error) {
    console.error("Error loading jobs:", error);
    // Fallback to empty options if API fails
    setJobOptions([]);
  } finally {
    setIsLoadingJobs(false);
  }
};

export const checkExistingSetup = async (
  setIsLoading: (loading: boolean) => void
) => {
  try {
    const resetFlag = await AsyncStorage.getItem("@simulation_reset");
    if (resetFlag === "true") {
      // Coming from reset, clear the flag and show first question
      await AsyncStorage.removeItem("@simulation_reset");
      setIsLoading(false);
      return "reset";
    }

    const setupData = await AsyncStorage.getItem("@simulation_setup");
    if (setupData) {
      // If setup exists, navigate to results
      router.replace("/(tabs)/simulation/result");
      return "redirect";
    } else {
      setIsLoading(false);
      return "new";
    }
  } catch (error) {
    console.error("Error loading setup data:", error);
    setIsLoading(false);
    return "error";
  }
};

export const handleNext = async (
  selectedOption: string | number | null,
  responses: Partial<UserResponses>,
  currentQuestionIndex: number,
  fadeAnim: Animated.Value,
  slideAnim: Animated.Value,
  setResponses: (responses: Partial<UserResponses>) => void,
  setAnimationDirection: (direction: "forward" | "backward") => void,
  setCurrentQuestionIndex: (index: number) => void,
  setSelectedOption: (option: string | number | null) => void
) => {
  if (selectedOption !== null) {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const newResponses = {
      ...responses,
      [currentQuestion.id]: selectedOption,
    };
    setResponses(newResponses);

    // Set direction for next animation
    setAnimationDirection("forward");

    // Animate out before transitioning
    await Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // All questions answered - fetch simulation data and navigate to results
      try {
        // Save user responses
        await AsyncStorage.setItem(
          "@simulation_setup",
          JSON.stringify(newResponses)
        );

        // Fetch simulation params from backend
        const simulationData = await fetchSimulationParams(newResponses as UserResponses);

        // Save simulation data for the results page
        await AsyncStorage.setItem(
          "@simulation_data",
          JSON.stringify(simulationData)
        );

        router.push("/(tabs)/simulation/result");
      } catch (error) {
        console.error("Error saving setup data or fetching simulation:", error);
        // Still navigate to results page even if API fails
        // The results page can show an error or use fallback data
        router.push("/(tabs)/simulation/result");
      }
    }
  }
};

export const handleBack = async (
  currentQuestionIndex: number,
  fadeAnim: Animated.Value,
  slideAnim: Animated.Value,
  setAnimationDirection: (direction: "forward" | "backward") => void,
  setCurrentQuestionIndex: (index: number) => void,
  setResponses: (responses: Partial<UserResponses>) => void,
  setSelectedOption: (option: string | number | null) => void
) => {
  if (currentQuestionIndex > 0) {
    // Set direction for backward animation (slide in from left)
    setAnimationDirection("backward");

    // Animate out to the right (sliding left to right)
    await Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100, // Slide far to the right
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Go back one question
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setSelectedOption(null);
  } else {
    // On first question, go back to previous page
    router.back();
  }
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
