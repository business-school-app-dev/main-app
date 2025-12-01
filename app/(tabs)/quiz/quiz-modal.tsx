import React, { useState, useRef, useEffect } from 'react';
import { View, StatusBar, ActivityIndicator, Animated } from 'react-native';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { X } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextButton from '@/components/inputs/text-button';
import { SelectionCard } from '@/components/views/selection-card';
import ProgressView from '@/components/views/progress-view';

import { fetchQuestions, submitAllAnswers } from '@/api/quiz';
import { Question } from '@/types/quiz';

export default function QuizModal() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resultFadeAnim = useRef(new Animated.Value(0)).current;
  const resultSlideAnim = useRef(new Animated.Value(20)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const fetchedQuestions = await fetchQuestions();
      setQuestions(fetchedQuestions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const currentQ = questions[Math.min(currentQuestion - 1, questions.length - 1)];
  const progress = (currentQuestion / questions.length) * 100;

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

    // Animate result message appearance
    resultFadeAnim.setValue(0);
    resultSlideAnim.setValue(20);

    Animated.parallel([
      Animated.timing(resultFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(resultSlideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Add shake animation for incorrect answers
    if (!correct) {
      Animated.sequence([
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
      ]).start();
    }
  };

  const [userAnswers, setUserAnswers] = useState<{ questionId: number, answer: number, isCorrect: boolean }[]>([]);

  const handleNext = async () => {
    if (selectedAnswer !== null && currentQ) {
      setUserAnswers([...userAnswers, {
        questionId: currentQ.id,
        answer: selectedAnswer,
        isCorrect: isCorrect
      }]);
    }

    if (currentQuestion < questions.length) {
      // Reset animations
      resultFadeAnim.setValue(0);
      resultSlideAnim.setValue(20);
      shakeAnim.setValue(0);

      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Quiz completed
      const allAnswers = [...userAnswers, {
        questionId: currentQ.id,
        answer: selectedAnswer!,
        isCorrect: isCorrect
      }];

      const submissionResult = await submitAllAnswers(allAnswers);
      if (submissionResult && submissionResult.success === true) {
        router.back();
    } else {
        console.error("Final submission failed on server or returned unsuccessful status.");
    }

    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Loading questions...</Text>
      </SafeAreaView>
    );
  }

  // Error state: UPDATED CODE BLOCK
  if (error || questions.length === 0) {
    return (
      <SafeAreaView className="flex-1">
        {/* New Header Container for the 'X' button */}
        <View className="px-6 pb-4">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
          >
            <Icon as={X} size="lg" color="black" />
          </Pressable>
        </View>

        {/* Content area centered below the header */}
        <View className="flex-1 items-center justify-center px-6 -mt-16">
          <Text className="text-xl font-bold text-gray-900 mb-4">Oops!</Text>
          <Text className="text-center text-gray-600 mb-6">{error || 'No questions available'}</Text>

          {/* Try Again Button */}
          <TextButton
            label="Try Again"
            onPress={loadQuestions}
            variant="secondary"
            size="lg"
          />
        </View>

      </SafeAreaView>
    );
  }
  // END OF UPDATED CODE BLOCK

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent={false} />

      {/* Header */}
      <View className="px-6 pb-4">
        {/* Progress Bar */}
        <ProgressView
          currentStep={currentQuestion}
          totalSteps={questions.length}
          progress={progress}
          leftElement={
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
            >
              <Icon as={X} size="lg" color="black" />
            </Pressable>
          }
        />
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Question */}
        <Animated.View
          style={{
            transform: [{ translateX: shakeAnim }],
          }}
        >
          <Text className="text-2xl font-bold text-gray-900 mb-6 mt-4">
            {currentQ.text}
          </Text>
        </Animated.View>

        {/* Options */}
        <SelectionCard
          options={currentQ.options.map((option, index) => ({
            label: option,
            value: index
          }))}
          selectedValue={selectedAnswer}
          onSelect={(value) => handleAnswerSelect(value as number)}
          disabled={showResult}
          showResult={showResult}
          correctAnswer={currentQ.correctAnswer}
          spacing="sm"
        />

        {/* Result Message */}
        {showResult && (
          <Animated.View
            style={{
              opacity: resultFadeAnim,
              transform: [{ translateY: resultSlideAnim }],
            }}
            className={`p-4 rounded-xl mt-6 ${isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}
          >
            <Text className={`text-center text-base ${isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
              {isCorrect ? "Correct!" : "Not quite right. Try again next time!"}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Bottom Button */}
      <View className="px-6 pt-4 pb-4">
        {!showResult ? (
          <TextButton
            label="Check Answer"
            onPress={handleCheckAnswer}
            disabled={selectedOption === ""}
            variant="secondary"
            size="lg"
          />
        ) : (
          <TextButton
            label={currentQuestion < questions.length ? "Continue" : "Complete Quiz"}
            onPress={handleNext}
            variant="secondary"
            size="lg"
          />
        )}
      </View>
    </SafeAreaView>
  );
}