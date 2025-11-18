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

// Types
interface Question {
  id: string;
  question: string;
  options: { label: string; value: string | number }[];
}

export interface UserResponses {
  career: string;
  location: string;
  children: number;
}

// Questions data
const QUESTIONS: Question[] = [
  {
    id: 'career',
    question: 'What is your career field?',
    options: [
      { label: 'Technology', value: 'tech' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Finance', value: 'finance' },
      { label: 'Education', value: 'education' },
      { label: 'Business', value: 'business' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    id: 'location',
    question: 'Where do you plan to live?',
    options: [
      { label: 'Major City (High Cost)', value: 'high_cost' },
      { label: 'Suburban Area (Medium Cost)', value: 'medium_cost' },
      { label: 'Small Town (Low Cost)', value: 'low_cost' },
      { label: 'Rural Area (Very Low Cost)', value: 'very_low_cost' },
    ],
  },
  {
    id: 'children',
    question: 'How many children do you plan to have?',
    options: [
      { label: 'None', value: 0 },
      { label: '1 child', value: 1 },
      { label: '2 children', value: 2 },
      { label: '3 children', value: 3 },
      { label: '4+ children', value: 4 },
    ],
  },
];

export default function SimulationSetup() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Partial<UserResponses>>({});
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    checkExistingSetup();
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
          checkExistingSetup();
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
  }, [currentQuestionIndex]);

  const checkExistingSetup = async () => {
    try {
      const resetFlag = await AsyncStorage.getItem('@simulation_reset');
      if (resetFlag === 'true') {
        // Coming from reset, clear the flag and show first question
        await AsyncStorage.removeItem('@simulation_reset');
        setIsLoading(false);
        return;
      }

      const setupData = await AsyncStorage.getItem('@simulation_setup');
      if (setupData) {
        // If setup exists, navigate to results
        router.replace('/(tabs)/simulation/result');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading setup data:', error);
      setIsLoading(false);
    }
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const handleOptionSelect = (value: string | number) => {
    setSelectedOption(value);
  };

  const handleNext = async () => {
    if (selectedOption !== null) {
      const newResponses = {
        ...responses,
        [currentQuestion.id]: selectedOption,
      };
      setResponses(newResponses);

      // Set direction for next animation
      setAnimationDirection('forward');

      // Animate out before transitioning
      await Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        // All questions answered - save and navigate to results
        try {
          await AsyncStorage.setItem('@simulation_setup', JSON.stringify(newResponses));
          router.push('/(tabs)/simulation/result');
        } catch (error) {
          console.error('Error saving setup data:', error);
        }
      }
    }
  };

  const handleBack = async () => {
    if (currentQuestionIndex > 0) {
      // Set direction for backward animation (slide in from left)
      setAnimationDirection('backward');

      // Animate out to the right (sliding left to right)
      await Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100, // Slide far to the right
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Reset to first question
      setCurrentQuestionIndex(0);
      setResponses({});
      setSelectedOption(null);
    } else {
      // On first question, go back to previous page
      router.back();
    }
  };

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
            onPress={handleBack}
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
        className="min-h-full"
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
        <View className="mb-8">
          <SelectionCard
            options={currentQuestion.options}
            selectedValue={selectedOption}
            onSelect={handleOptionSelect}
            spacing="md"
          />
        </View>

        {/* Navigation Buttons */}
        <View className="mt-auto">
          <TextButton
            label={
              currentQuestionIndex === QUESTIONS.length - 1
                ? 'See My Simulation'
                : 'Continue'
            }
            variant="secondary"
            size="lg"
            onPress={handleNext}
            disabled={selectedOption === null}
          />
        </View>
      </Animated.View>
    </PageLayout>
  );
}
