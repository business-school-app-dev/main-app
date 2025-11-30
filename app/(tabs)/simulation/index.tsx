import React, { useState, useEffect } from 'react';
import { ScrollView, Animated } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import PageLayout from '@/components/layouts/page-layout';
import TextButton from '@/components/inputs/text-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import IconButton from '@/components/inputs/icon-button';
import { SelectionCard } from '@/components/views/selection-card';
import ProgressView from '@/components/views/progress-view';
import { useCallback } from 'react';
import { fetchJobsByCategory } from '@/services/api/careers';
import FormSelect from '@/components/inputs/form-select';
import { UserResponses } from '@/types/Question';
import { QUESTIONS } from '@/types/Question';
import { checkExistingSetup, handleBack, handleNext, loadJobs } from '@/api/simulation';


export default function SimulationSetup() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Partial<UserResponses>>({});
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const [jobOptions, setJobOptions] = useState<{ label: string; value: string | number }[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const handleOptionSelect = (value: string | number) => setSelectedOption(value);

  useEffect(() => {
    checkExistingSetup(setIsLoading);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Check when screen comes into focus
      const resetCheck = async () => {
        const resetFlag = await AsyncStorage.getItem('@simulation_reset');
        if (resetFlag === 'true') {
          // Coming from reset, clear everything
          await AsyncStorage.removeItem('@simulation_reset');
          setCurrentQuestionIndex(0);
          setResponses({});
          setSelectedOption(null);
          setIsLoading(false);
          setAnimationDirection('forward');
        } else {
          checkExistingSetup(setIsLoading);
        }
      };
      resetCheck();
    }, [])
  );

  useEffect(() => {
    // Animate in when question changes
    fadeAnim.setValue(0);
    // Set starting position based on direction
    slideAnim.setValue(animationDirection === 'forward' ? 30 : -30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Fetch jobs when reaching the job selection question
    if (currentQuestionIndex === 1 && responses.careerCategory) {
      loadJobs(responses.careerCategory as string, setIsLoadingJobs, setJobOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);



  if (isLoading) {
    return (
      <PageLayout title="Life Simulation Setup" backButtonHidden>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Life Simulation Setup"
      leftView={
        currentQuestionIndex > 0 ? (
          <IconButton
            iconName="arrow-back"
            onPress={async () => await handleBack(currentQuestionIndex, fadeAnim, slideAnim, setAnimationDirection, setCurrentQuestionIndex, setResponses, setSelectedOption)}
          />
        ) : undefined
      }
      backButtonHidden={currentQuestionIndex === 0}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        }}
        className="flex-1"
      >
        {/* Progress Bar */}
        <ProgressView
          currentStep={currentQuestionIndex + 1}
          totalSteps={QUESTIONS.length}
          progress={progress}
          className="mb-8"
        />

        {/* Question */}
        <VStack space="lg" className="mb-8">
          <Text className="text-2xl font-bold text-gray-900">
            {currentQuestion.question}
          </Text>
          <Text size="sm" className="text-gray-600">
            Select one option to continue
          </Text>
        </VStack>

        {/* Options */}
        {currentQuestionIndex === 2 ? (
          // Location question - use dropdown
          <View className="mb-8">
            <FormSelect
              label=""
              placeholder="Select a state"
              options={currentQuestion.options.map(opt => opt.label)}
              value={currentQuestion.options.find(opt => opt.value === selectedOption)?.label}
              onValueChange={(label) => {
                const option = currentQuestion.options.find(opt => opt.label === label);
                if (option) {
                  handleOptionSelect(option.value);
                }
              }}
              isScrollable={true}
              maxHeight={400}
            />
          </View>
        ) : (
          // Other questions - use SelectionCard
          <ScrollView
            className="mb-8 flex-1"
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {isLoadingJobs && currentQuestionIndex === 1 ? (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-gray-500">Loading jobs...</Text>
              </View>
            ) : (
              <SelectionCard
                options={currentQuestionIndex === 1 ? jobOptions : currentQuestion.options}
                selectedValue={selectedOption}
                onSelect={handleOptionSelect}
                spacing="md"
              />
            )}
          </ScrollView>
        )}

        <View className="mt-auto">
          <TextButton
            label={
              currentQuestionIndex === QUESTIONS.length - 1
                ? 'See My Simulation'
                : 'Continue'
            }
            variant="secondary"
            size="lg"
            onPress={async () => await handleNext(selectedOption, responses, currentQuestionIndex, fadeAnim, slideAnim, setResponses, setAnimationDirection, setCurrentQuestionIndex, setSelectedOption)}
            disabled={selectedOption === null}
          />
        </View>
      </Animated.View>
    </PageLayout>
  );
}
