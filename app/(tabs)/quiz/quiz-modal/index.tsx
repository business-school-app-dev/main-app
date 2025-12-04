import TextButton from '@/components/inputs/text-button';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import ProgressView from '@/components/views/progress-view';
import { SelectionCard } from '@/components/views/selection-card';
import { router, useFocusEffect } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { ActivityIndicator, Animated, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQuizLogic } from '@/api/quiz';

export default function QuizModal() {
  const {
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
    loadQuestions,
    currentQ,
    progress,
    handleAnswerSelect,
    handleCheckAnswer,
    handleNext,
  } = useQuizLogic();

  // Fetch from backend each time the modal is opened/focused
  useFocusEffect(
    useCallback(() => {
      loadQuestions();
    }, [loadQuestions])
  );

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
      <View className="px-6 mb-10">
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
