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
