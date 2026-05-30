// ============================================================================
// QUIZ SCREEN - Main Quiz UI Component
// ============================================================================
// Displays 3 quiz questions with multiple choice options
// User selects answer → taps "Check Answer" → sees result → moves to next question
// After all 3 questions: navigates to /quiz/completed for leaderboard submission

import TextButton from '@/components/inputs/text-button';
import { Text } from '@/components/ui/text';
import ProgressView from '@/components/views/progress-view';
import { SelectionCard } from '@/components/views/selection-card';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Animated, useWindowDimensions, View } from 'react-native';
import { useQuizLogic } from '@/api/quiz';
import { VStack } from '@/components/ui/vstack';
import PageLayout from '@/components/layouts/page-layout';
import IconButton from '@/components/inputs/icon-button';
import CloseButton from '@/components/inputs/close-button';

export default function QuizModal() {
  // ========== STATE & HOOKS ==========
  const {
    selectedOption,        // Selected answer index as string
    currentQuestion,       // Current question number (1-3)
    selectedAnswer,        // Selected answer index (0-3)
    showResult,            // Is result message visible?
    isCorrect,             // Was the answer correct?
    questions,             // Array of 3 Question objects
    loading,               // Is loading questions?
    error,                 // Error message if failed
    resultFadeAnim,        // Animated value for result fade
    resultSlideAnim,       // Animated value for result slide
    shakeAnim,             // Animated value for question shake
    questionFadeAnim,      // Animated value for question fade
    questionSlideAnim,     // Animated value for question slide
    loadQuestions,         // Function to fetch & reload questions
    currentQ,              // Current question object
    progress,              // Progress percentage (0-100)
    handleAnswerSelect,    // Function to select an answer
    handleCheckAnswer,     // Function to check if answer is correct
    handleNext,            // Function to move to next question or complete
  } = useQuizLogic();

  // ========== EFFECTS ==========
  // Fetch fresh questions each time this screen is focused
  useFocusEffect(
    useCallback(() => {
      loadQuestions();
    }, [loadQuestions])
  );

  // ========== COMPUTED VALUES ==========
  // Determine title based on loading/error state
  const title = loading
    ? "Loading..."
    : error || questions.length === 0
      ? "Quiz Error"  // Shows "Quiz Error" if questions failed to load
      : `Daily Quiz`;

  const { height } = useWindowDimensions();
  const isSmallPhone = height <= 670; // Adjust spacing for small phones

  // ========== RENDER ==========
  return (
    <PageLayout title={title} scrollable={false} leftView={<CloseButton />}>
      {loading ? (
        // ========== LOADING STATE ==========
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-4 text-gray-600">Loading questions...</Text>
        </View>
      ) : error || questions.length === 0 ? (
        // ========== ERROR STATE ==========
        // Shows error message (or fallback quiz questions if API failed)
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
        // ========== QUIZ CONTENT ==========
        <View className="flex-1">
          {/* Progress Bar - Shows current question number */}
          <VStack className="pb-4" space="2xl">
            <ProgressView
              currentStep={currentQuestion}
              totalSteps={questions.length}
              progress={progress}  // e.g., 33%, 66%, 100%
            />
          </VStack>

          {/* Main Quiz Content */}
          <View className="flex-1">
            <Animated.View
              style={{
                opacity: questionFadeAnim,
                transform: [{ translateY: questionSlideAnim }],
              }}
            >
              {/* Question Text */}
              <Animated.View
                style={{
                  transform: [{ translateX: shakeAnim }], // Shake on wrong answer
                }}
              >
                <Text className="text-2xl font-bold text-gray-900 my-10">
                  {currentQ.text}
                </Text>
              </Animated.View>

              {/* Answer Options (Multiple Choice Buttons) */}
              {/* 
                SelectionCard component displays 4 options as clickable cards
                Shows green highlight on correct answer after result
                Shows red highlight on incorrect answer after result
              */}
              <SelectionCard
                options={currentQ.options.map((option, index) => ({
                  label: option,
                  value: index  // 0-3
                }))}
                selectedValue={selectedAnswer}
                onSelect={(value) => handleAnswerSelect(value as number)}
                disabled={showResult}  // Can't change answer after checking
                showResult={showResult} // Show correct/incorrect highlights
                correctAnswer={currentQ.correctAnswer}
                spacing="md"
              />

              {/* Result Message - "Correct!" or "Not quite right" */}
              {showResult ? (
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
              ) : <View />}
            </Animated.View>
          </View>

          {/* Bottom Button - Changes based on state */}
          <View className={`mt-auto ${isSmallPhone ? 'pb-2' : 'pb-14'}`}>
            {!showResult ? (
              // Show "Check Answer" if result not yet shown
              <TextButton
                label="Check Answer"
                onPress={handleCheckAnswer}
                disabled={selectedOption === ""}  // Only enabled if answer selected
                variant="secondary"
                size="lg"
              />
            ) : (
              // Show "Continue" or "Complete Quiz" after result shown
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
