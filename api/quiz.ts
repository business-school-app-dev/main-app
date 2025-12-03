import { Question } from "@/types/quiz";

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/challenges/questions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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

export const submitAllAnswers = async (
  userAnswers: { questionId: number; answer: number; isCorrect: boolean }[]
) => {
  try {
    const userId = 0;
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/challenges/submit-batch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          answers: userAnswers,
        }),
      }
    );

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
