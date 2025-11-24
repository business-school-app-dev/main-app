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

// Types
interface Question {
  id: string;
  question: string;
  options: { label: string; value: string | number }[];
}

export interface UserResponses {
  careerCategory: string;
  specificJob: string;
  location: string;
  children: number;
}

// Questions data
const QUESTIONS: Question[] = [
  {
    id: 'careerCategory',
    question: 'What is your career field? (Scroll down for more choices)',
    options: [
      { label: 'Management', value: 'management' },
      { label: 'Business/Finance', value: 'business_finance' },
      { label: 'Math and Computers', value: 'math_computers' },
      { label: 'Architecture/Engineering', value: 'architecture_engineering' },
      { label: 'Life, Physical, and Social Science', value: 'science' },
      { label: 'Public Service', value: 'public_service' },
      { label: 'Legal Occupations', value: 'legal' },
      { label: 'Educational Instruction and Library Occupations', value: 'education' },
      { label: 'Arts, Design, Entertainment, Sports, and Media Occupations', value: 'arts_media' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Protective Service', value: 'protective_service' },
      { label: 'Food Preparation', value: 'food_preparation' },
      { label: 'Personal Care and Service', value: 'personal_care' },
      { label: 'Sales', value: 'sales' },
      { label: 'Office and Administrative Support', value: 'office_admin' },
      { label: 'Construction and Extraction', value: 'construction' },
      { label: 'Installation, Maintenance', value: 'installation_maintenance' },
      { label: 'Production Operations', value: 'production' },
      { label: 'Transportation', value: 'transportation' },
    ],
  },
  {
    id: 'specificJob',
    question: 'What is your specific job?',
    options: [], // Will be populated dynamically from API
  },
  {
    id: 'location',
    question: 'Where do you plan to live?',
    options: [
      { label: 'Alabama', value: 'AL' },
      { label: 'Alaska', value: 'AK' },
      { label: 'Arizona', value: 'AZ' },
      { label: 'Arkansas', value: 'AR' },
      { label: 'California', value: 'CA' },
      { label: 'Colorado', value: 'CO' },
      { label: 'Connecticut', value: 'CT' },
      { label: 'Delaware', value: 'DE' },
      { label: 'District of Columbia', value: 'DC' },
      { label: 'Florida', value: 'FL' },
      { label: 'Georgia', value: 'GA' },
      { label: 'Hawaii', value: 'HI' },
      { label: 'Idaho', value: 'ID' },
      { label: 'Illinois', value: 'IL' },
      { label: 'Indiana', value: 'IN' },
      { label: 'Iowa', value: 'IA' },
      { label: 'Kansas', value: 'KS' },
      { label: 'Kentucky', value: 'KY' },
      { label: 'Louisiana', value: 'LA' },
      { label: 'Maine', value: 'ME' },
      { label: 'Maryland', value: 'MD' },
      { label: 'Massachusetts', value: 'MA' },
      { label: 'Michigan', value: 'MI' },
      { label: 'Minnesota', value: 'MN' },
      { label: 'Mississippi', value: 'MS' },
      { label: 'Missouri', value: 'MO' },
      { label: 'Montana', value: 'MT' },
      { label: 'Nebraska', value: 'NE' },
      { label: 'Nevada', value: 'NV' },
      { label: 'New Hampshire', value: 'NH' },
      { label: 'New Jersey', value: 'NJ' },
      { label: 'New Mexico', value: 'NM' },
      { label: 'New York', value: 'NY' },
      { label: 'North Carolina', value: 'NC' },
      { label: 'North Dakota', value: 'ND' },
      { label: 'Ohio', value: 'OH' },
      { label: 'Oklahoma', value: 'OK' },
      { label: 'Oregon', value: 'OR' },
      { label: 'Pennsylvania', value: 'PA' },
      { label: 'Rhode Island', value: 'RI' },
      { label: 'South Carolina', value: 'SC' },
      { label: 'South Dakota', value: 'SD' },
      { label: 'Tennessee', value: 'TN' },
      { label: 'Texas', value: 'TX' },
      { label: 'Utah', value: 'UT' },
      { label: 'Vermont', value: 'VT' },
      { label: 'Virginia', value: 'VA' },
      { label: 'Washington', value: 'WA' },
      { label: 'West Virginia', value: 'WV' },
      { label: 'Wisconsin', value: 'WI' },
      { label: 'Wyoming', value: 'WY' },
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
  const [jobOptions, setJobOptions] = useState<{ label: string; value: string | number }[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

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

    // Fetch jobs when reaching the job selection question
    if (currentQuestionIndex === 1 && responses.careerCategory) {
      loadJobs(responses.careerCategory as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  const loadJobs = async (category: string) => {
    setIsLoadingJobs(true);
    try {
      const response = await fetchJobsByCategory(category);
      const jobOpts = response.jobs.map(job => ({
        label: job.title,
        value: job.value,
      }));
      setJobOptions(jobOpts);
    } catch (error) {
      console.error('Error loading jobs:', error);
      // Fallback to empty options if API fails
      setJobOptions([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

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
