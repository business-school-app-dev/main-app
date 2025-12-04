import { Question } from "@/types/quiz";
import { Animated } from "react-native";
import { useMemo, useState, useCallback, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SubmittedAnswer = {
  questionId: number;
  answer: number;
  isCorrect: boolean;
  answerText?: string;
};

export type CooldownStatus = {
  canPlay: boolean;
  nextAvailable: string | null;
  message: string;
};

export const checkQuizCooldown = async (
  username: string
): Promise<CooldownStatus> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/challenges/can-play?username=${encodeURIComponent(
        username
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to check cooldown status");
    }
    const data = await response.json();
    if (data.success) {
      return {
        canPlay: data.can_play,
        nextAvailable: data.next_available,
        message: data.message,
      };
    } else {
      throw new Error("API returned unsuccessful response");
    }
  } catch (err) {
    console.error("Error checking cooldown:", err);
    // If check fails, allow playing to avoid blocking users
    return {
      canPlay: true,
      nextAvailable: null,
      message: "Unable to check cooldown status",
    };
  }
};

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

// Animation helpers
export const createResultAnimation = (
  fadeAnim: Animated.Value,
  slideAnim: Animated.Value
) => {
  fadeAnim.setValue(0);
  slideAnim.setValue(20);

  return Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }),
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }),
  ]);
};

export const createShakeAnimation = (shakeAnim: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(shakeAnim, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnim, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnim, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(shakeAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]);
};

export const resetAnimations = (
  fadeAnim: Animated.Value,
  slideAnim: Animated.Value,
  shakeAnim: Animated.Value
) => {
  fadeAnim.setValue(0);
  slideAnim.setValue(20);
  shakeAnim.setValue(0);
};

export const calculateQuizProgress = (current: number, total: number) =>
  (current / total) * 100;

export const buildCompletedParams = (
  allAnswers: SubmittedAnswer[],
  totalQuestions: number
) => ({
  score: String(allAnswers.filter((a) => a.isCorrect).length),
  total: String(totalQuestions),
  answers: JSON.stringify(allAnswers),
});

export function useQuizCompletion() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    score: scoreParam,
    total: totalParam,
    answers: answersParam,
  } = useLocalSearchParams();

  const submitAllAnswers = async (
    userAnswers: SubmittedAnswer[],
    username: string
  ) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/challenges/submit-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          // Backend expects questionId/answer fields as sent from the client
          answers: userAnswers.map(
            ({ questionId, answer, isCorrect, answerText }) => ({
              questionId,
              answer,
              is_correct: isCorrect,
              ...(answerText ? { answerText } : {}),
            })
          ),
        }),
      });

      if (!response.ok) {
        setSubmitError("Failed to submit answers. Please try again.");
        throw new Error("Failed to submit answers");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setSubmitError("Failed to submit answers. Please try again.");
      console.error("Error submitting answers:", err);
      throw err;
    }
  };

  const { scoreFromParams, totalFromParams, answersFromParams } =
    useMemo(() => {
      const parsedScore = parseInt(String(scoreParam ?? ""), 10);
      const parsedTotal = parseInt(String(totalParam ?? ""), 10);
      let parsedAnswers: SubmittedAnswer[] = [];
      if (answersParam) {
        try {
          const maybe = JSON.parse(String(answersParam));
          if (Array.isArray(maybe)) {
            parsedAnswers = maybe;
          }
        } catch (e) {
          parsedAnswers = [];
        }
      }
      return {
        scoreFromParams: Number.isFinite(parsedScore) ? parsedScore : 0,
        totalFromParams: Number.isFinite(parsedTotal) ? parsedTotal : 0,
        answersFromParams: parsedAnswers,
      };
    }, [scoreParam, totalParam, answersParam]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (!answersFromParams.length) {
      setSubmitError("No answers to submit. Please retake the quiz.");
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await submitAllAnswers(answersFromParams, name.trim());
      // Save username to AsyncStorage for cooldown checking
      await AsyncStorage.setItem("lastQuizUsername", name.trim());
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit leaderboard entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    submitted,
    isSubmitting,
    submitError,
    scoreFromParams,
    totalFromParams,
    handleSubmit,
  };
}

export function useQuizLogic() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<SubmittedAnswer[]>([]);

  const resultFadeAnim = useRef(new Animated.Value(0)).current;
  const resultSlideAnim = useRef(new Animated.Value(20)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const questionFadeAnim = useRef(new Animated.Value(1)).current;
  const questionSlideAnim = useRef(new Animated.Value(0)).current;

  const loadQuestions = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      setQuestions([]);
      setCurrentQuestion(1);
      setSelectedOption("");
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      setUserAnswers([]);

      const fetchedQuestions = await fetchQuestions();
      setQuestions(fetchedQuestions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const currentQ =
    questions[Math.min(currentQuestion - 1, questions.length - 1)];
  const progress =
    questions.length > 0 ? (currentQuestion / questions.length) * 100 : 0;

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index.toString());
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || !currentQ) return;

    const correct = selectedAnswer === currentQ.correctAnswer;

    setIsCorrect(correct);
    setShowResult(true);

    createResultAnimation(resultFadeAnim, resultSlideAnim).start();

    if (!correct) {
      createShakeAnimation(shakeAnim).start();
    }
  };

  const handleNext = async () => {
    if (selectedAnswer !== null && currentQ) {
      setUserAnswers([
        ...userAnswers,
        {
          questionId: currentQ.id,
          answer: selectedAnswer,
          isCorrect: isCorrect,
          answerText: currentQ.options[selectedAnswer],
        },
      ]);
    }

    if (currentQuestion < questions.length) {
      resetAnimations(resultFadeAnim, resultSlideAnim, shakeAnim);

      // Animate question entrance
      questionFadeAnim.setValue(0);
      questionSlideAnim.setValue(30);

      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);

      // Start entrance animation
      Animated.parallel([
        Animated.timing(questionFadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(questionSlideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      const allAnswers = [
        ...userAnswers,
        {
          questionId: currentQ.id,
          answer: selectedAnswer!,
          isCorrect: isCorrect,
          answerText: currentQ.options[selectedAnswer!],
        },
      ];
      const totalQuestions = questions.length;

      router.replace({
        pathname: "/quiz/completed",
        params: buildCompletedParams(allAnswers, totalQuestions),
      });
    }
  };

  return {
    selectedOption,
    currentQuestion,
    selectedAnswer,
    showResult,
    isCorrect,
    questions,
    loading,
    error,
    resultFadeAnim,
    resultSlideAnim,
    shakeAnim,
    questionFadeAnim,
    questionSlideAnim,
    loadQuestions,
    currentQ,
    progress,
    handleAnswerSelect,
    handleCheckAnswer,
    handleNext,
  };
}
