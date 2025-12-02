import { router } from "expo-router";

const API_BASE_URL = "http://127.0.0.1:5000/api/v1";

export interface RecommendationResponse {
  recommendations?: any[];
  comfort_level?: string;
  max_credits?: string | number;
}

export const fetchAllCourses = async (): Promise<any[]> => {
  const url = `${API_BASE_URL}/courses/all`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export const getRecommendations = async (
  comfortLevel: string,
  credit: string
): Promise<RecommendationResponse> => {
  console.log(`CREDIT: ${credit}, COMFORT LEVEL: ${comfortLevel}`);
  const url = `${API_BASE_URL}/recommend?comfort=${comfortLevel.toLowerCase()}&max_credits=${credit}`;
  const response = await fetch(url);

  if (!response.ok) {
    // For server errors, we'll return a shape that results in "no courses"
    // instead of crashing the app.
    return {
      recommendations: [],
      comfort_level: comfortLevel,
      max_credits: credit,
    };
  }

  return response.json();
};

export const handleAllCourses = async () => {
  console.log("Button pressed → allCourses running");

  // Navigate immediately with empty data
  router.navigate({
    pathname: "/home/guides/course-recommender/courses",
    params: {
      recommendations: JSON.stringify([]),
      comfort_level: "n/a",
      max_credits: "n/a",
      loading: "true",
    },
  });

  try {
    const data = await fetchAllCourses();
    // Update the route with actual data
    router.setParams({
      recommendations: JSON.stringify(data),
      loading: "false",
    });
  } catch (error) {
    console.error("Error fetching all courses:", error);
    router.setParams({
      loading: "false",
    });
  }
};

export const handleGetRecommendations = async (
  comfortLevel: string,
  credit: string
) => {
  // Navigate immediately with empty data
  router.navigate({
    pathname: "/home/guides/course-recommender/courses",
    params: {
      recommendations: JSON.stringify([]),
      comfort_level: comfortLevel,
      max_credits: credit,
      loading: "true",
    },
  });

  try {
    const data = await getRecommendations(comfortLevel, credit);
    const recs = Array.isArray(data.recommendations)
      ? data.recommendations
      : [];

    // Update the route with actual data
    router.setParams({
      recommendations: JSON.stringify(recs),
      comfort_level: data.comfort_level ?? comfortLevel,
      max_credits: String(data.max_credits ?? credit),
      loading: "false",
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    router.setParams({
      recommendations: JSON.stringify([]),
      loading: "false",
    });
  }
};
