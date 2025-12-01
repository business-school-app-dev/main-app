import TextButton from '@/components/inputs/text-button';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import ProgressView from '@/components/views/progress-view';
import { SelectionCard } from '@/components/views/selection-card';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizModal() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const resultFadeAnim = useRef(new Animated.Value(0)).current;
  const resultSlideAnim = useRef(new Animated.Value(20)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const questions = [
    {
      question: "What is the 50/30/20 budgeting rule?",
      options: [
        "50% needs, 30% wants, 20% savings",
        "50% savings, 30% needs, 20% wants",
        "50% wants, 30% needs, 20% savings",
        "50% needs, 30% savings, 20% wants"
      ],
      correctAnswer: 0
    },
    {
      question: "Which expense is considered a 'need'?",
      options: [
        "Streaming subscriptions",
        "Dining out",
        "Rent or mortgage",
        "Concert tickets"
      ],
      correctAnswer: 2
    },
    {
      question: "How often should you review your budget?",
      options: [
        "Once a year",
        "Monthly",
        "Every 5 years",
        "Only when problems arise"
      ],
      correctAnswer: 1
    },
  ];

  const currentQ = questions[Math.min(currentQuestion - 1, questions.length - 1)];
  const progress = (currentQuestion / questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index.toString());
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
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

  const handleNext = () => {
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
      router.push("/quiz/quiz-completed");
      console.log("quiz is completed")

    }
  };

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
            {currentQ.question}
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
              {isCorrect ? "Correct! 🎉" : "Not quite right. Try again next time!"}
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