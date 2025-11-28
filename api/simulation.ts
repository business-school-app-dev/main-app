import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Animated } from "react-native";
import { UserResponses, QUESTIONS } from "@/types/Question";
import { JobsResponse } from "@/types/Job";

const API_BASE_URL = "http://127.0.0.1:5000/api/v1";

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
    const jobOpts = response.jobs.map((job) => ({
      label: job.title,
      value: job.value,
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
      // All questions answered - save and navigate to results
      try {
        await AsyncStorage.setItem(
          "@simulation_setup",
          JSON.stringify(newResponses)
        );
        router.push("/(tabs)/simulation/result");
      } catch (error) {
        console.error("Error saving setup data:", error);
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
    console.log(`${API_BASE_URL}/jobs/${category}`);
    const response = await fetch(`${API_BASE_URL}/jobs/${category}`);
    const data = await response.json();
    return data as JobsResponse;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}
