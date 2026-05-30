// ============================================================================
// QUIZ LOGIC MODULE
// ============================================================================
// This file handles all quiz-related API calls, state management, and animations
// Key flows:
//   1. checkQuizCooldown: Check if user can take quiz (daily limit)
//   2. fetchQuestions: Get 3 daily questions from backend
//   3. useQuizLogic: Manage quiz screen state and interactions
//   4. useQuizCompletion: Handle leaderboard submission after quiz
import { Question } from "@/types/quiz";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

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
      `${
        process.env.EXPO_PUBLIC_API_URL
      }/challenges/can-play?username=${encodeURIComponent(username)}`,
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

export const fetchQuestions = async (signal?: AbortSignal, retries = 3, delay = 1000): Promise<Question[]> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/challenges/questions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        },
        signal,
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
  } catch (err: any) {
    if (err.name === 'AbortError' || retries === 0) {
      console.error("Error fetching questions:", err);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'UNDEFINED';
      const errorMsg = `Error loading questions.\n\nENV VAR CHECK:\nEXPO_PUBLIC_API_URL = ${apiUrl}`;
      throw new Error(errorMsg);
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchQuestions(signal, retries - 1, delay * 2);
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
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/challenges/submit-batch`,
        {
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
        }
      );

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

      const validName = await checkUserName(name.trim());

      if (!validName) {
        setSubmitError("Please choose a different name.");
        setIsSubmitting(false);
        return;
      }

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

  const checkUserName = async (name: string) => {
    // Fail-open: if the third-party profanity service is slow or down,
    // allow the submission rather than blocking the user. Apple reviewers
    // and real users should never be unable to submit because of an
    // unrelated outage.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch("https://vector.profanity.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: name }),
        signal: controller.signal,
      });
      if (!res.ok) return true;
      const data = await res.json();
      return !data.isProfanity;
    } catch {
      return true;
    } finally {
      clearTimeout(timeout);
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for TestFlight

    const fetchedQuestions = await fetchQuestions(controller.signal);
    clearTimeout(timeoutId);
    setQuestions(fetchedQuestions);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      setError("Connection timed out. Please try again.");
    } else {
      console.error("Quiz load error:", err);
      setError(err.message);
    }
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
