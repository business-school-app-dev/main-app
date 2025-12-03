import { Question } from "@/types/quiz";

const API_BASE_URL = "http://127.0.0.1:5000/api/v1";

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

type SubmittedAnswer = {
  questionId: number;
  answer: number;
  isCorrect: boolean;
  answerText?: string;
};

export const submitAllAnswers = async (
userAnswers: SubmittedAnswer[], username: string, scoreFromParams: number, totalFromParams: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/challenges/submit-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        // Backend expects questionId/answer fields as sent from the client
        answers: userAnswers.map(({ questionId, answer, isCorrect, answerText }) => ({
          questionId,
          answer,
          is_correct: isCorrect,
          ...(answerText ? { answerText } : {}),
        })),
      }),
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
