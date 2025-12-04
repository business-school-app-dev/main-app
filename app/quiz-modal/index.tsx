import TextButton from '@/components/inputs/text-button';
import { Text } from '@/components/ui/text';
import ProgressView from '@/components/views/progress-view';
import { SelectionCard } from '@/components/views/selection-card';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Animated, View } from 'react-native';
import { useQuizLogic } from '@/api/quiz';
import { VStack } from '@/components/ui/vstack';
import PageLayout from '@/components/layouts/page-layout';
import IconButton from '@/components/inputs/icon-button';

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
    questionFadeAnim,
    questionSlideAnim,
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

  // Determine title based on state
  const title = loading
    ? "Loading..."
    : error || questions.length === 0
      ? "Quiz Error"
      : `Question #${currentQuestion}`;

  const rightView = (
    <IconButton
      iconName="close"
      variant="transparent"
      color="white"
      onPress={router.back}
    />
  );

  return (
    <PageLayout title={title} scrollable={false} rightView={rightView}>
      {loading ? (
        // Loading State
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-4 text-gray-600">Loading questions...</Text>
        </View>
      ) : error || questions.length === 0 ? (
        // Error State
        <View className="flex-1 items-center justify-center -mt-16">
          <Text className="text-xl font-bold text-gray-900 mb-4">Oops!</Text>
          <Text className="text-center text-gray-600 mb-6">
            {error || 'No questions available'}
          </Text>
          <TextButton
            label="Try Again"
            onPress={loadQuestions}
            variant="secondary"
            size="lg"
          />
        </View>
      ) : (
        // Quiz Content
        <View className="flex-1">
          {/* Progress Bar */}
          <VStack className="pb-4" space="2xl">
            <ProgressView
              currentStep={currentQuestion}
              totalSteps={questions.length}
              progress={progress}
            />
          </VStack>

          {/* Content */}
          <Animated.View
            className="flex-1"
            style={{
              opacity: questionFadeAnim,
              transform: [{ translateY: questionSlideAnim }],
            }}
          >
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
          </Animated.View>

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
              <Text
                className={`text-center text-base ${isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}
              >
                {isCorrect ? "Correct!" : "Not quite right. Try again next time!"}
              </Text>
            </Animated.View>
          )}

          {/* Bottom Button */}
          <View className="pb-4">
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
        </View>
      )}
    </PageLayout>
  );
}
