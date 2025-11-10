import React, { useState } from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { X } from 'lucide-react-native';
import { router } from 'expo-router';
import { RadioGroup, Radio, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextButton from '@/components/inputs/text-button';

export default function QuizModal() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

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
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Quiz completed
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent={false} />

      {/* Header */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
          >
            <Icon as={X} size="lg" color="black" />
          </Pressable>
          <Text className="text-base font-medium text-gray-700">
            {currentQuestion} / {questions.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <Text className="text-2xl font-bold text-gray-900 mb-6 mt-4">
          {currentQ.question}
        </Text>

        {/* Options */}
        <RadioGroup value={selectedOption} onChange={(value) => handleAnswerSelect(parseInt(value))}>
          <View className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedOption === index.toString();
              const isCorrectAnswer = index === currentQ.correctAnswer;

              let borderColor = 'border-gray-200';
              let bgColor = 'bg-white';

              if (showResult) {
                if (isCorrectAnswer) {
                  borderColor = 'border-green-500';
                  bgColor = 'bg-green-50';
                } else if (isSelected && !isCorrect) {
                  borderColor = 'border-red-500';
                  bgColor = 'bg-red-50';
                }
              } else if (isSelected) {
                borderColor = 'border-primary-500';
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`border-2 rounded-xl my-2 p-4 ${borderColor} ${bgColor}`}
                >
                  <Radio value={index.toString()} className="flex-row items-center">
                    <RadioIndicator className="mr-3">
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>
                      <Text className="text-base text-gray-900 flex-1">
                        {option}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </Pressable>
              );
            })}
          </View>
        </RadioGroup>

        {/* Result Message */}
        {showResult && (
          <View className={`p-4 rounded-xl mt-6 ${isCorrect ? 'bg-green-100' : 'bg-red-100'
            }`}>
            <Text className={`text-center text-base ${isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
              {isCorrect ? "Correct" : "Not quite right. Try again next time"}
            </Text>
          </View>
        )}
      </ScrollView>

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