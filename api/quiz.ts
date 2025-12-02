import { Question } from "@/types/quiz";
import { Platform } from "react-native";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000/api/v1" // Android emulator → host machine
    : "http://127.0.0.1:5000/api/v1"; // iOS simulator / other

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/challenges/questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data = await response.json();
    if (data.success) {
      const transformedQuestions = data.questions.map((q: any) => ({
        id: q.id,
        text: q.text,
        difficulty: q.difficulty,
        options: q.options,
        correctAnswer: q.correct_answer,
      }));
      return transformedQuestions;
    } else {
      throw new Error("API returned unsuccessful response");
    }
  } catch (err) {
    console.error("Error fetching questions:", err);
    throw new Error("Failed to load questions. Please try again.");
  }
};

//CHANGED: TAKING IN username + ANSWERS (as backend expects)
export const submitAllAnswers = async (payload: {
  username: string;
  answers: { questionId: number; answer: number; timeTaken: number }[];
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/challenges/submit-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //CHANGED utilizing the structure sent from front end
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to submit answers");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error submitting answers:", err);
    return null;
  }
};
