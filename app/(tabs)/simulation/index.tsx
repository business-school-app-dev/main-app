import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { RadioGroup, Radio, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import PageLayout from '@/components/layouts/page-layout';
import TextButton from '@/components/inputs/text-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import IconButton from '@/components/inputs/icon-button';

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

  useEffect(() => {
    checkExistingSetup();
  }, []);

  const checkExistingSetup = async () => {
    try {
      const setupData = await AsyncStorage.getItem('@simulation_setup');
      if (setupData) {
        // If setup exists, navigate to results
        router.replace('/(tabs)/simulation/result');
      }
    } catch (error) {
      console.error('Error loading setup data:', error);
    } finally {
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

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestionId = QUESTIONS[currentQuestionIndex - 1].id;
      setSelectedOption(responses[prevQuestionId as keyof UserResponses] ?? null);
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
      backButtonHidden={currentQuestionIndex === 0}
      leftView={
        <IconButton
          iconName="arrow-back"
          onPress={handleBack}
        />
      }
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          {/* Progress Bar */}
          <VStack space="md" className="mb-8">
            <HStack className="justify-between items-center">
              <Text size="sm" className="text-gray-600">
                Question {currentQuestionIndex + 1} of {QUESTIONS.length}
              </Text>
              <Text size="sm" className="text-primary-500 font-semibold">
                {Math.round(progress)}%
              </Text>
            </HStack>
            <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </VStack>

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
          <RadioGroup
            value={selectedOption?.toString() ?? ""}
            onChange={(value) => {
              const option = currentQuestion.options.find(opt => opt.value.toString() === value);
              if (option) handleOptionSelect(option.value);
            }}
          >
            <VStack space="md" className="mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === option.value;

                return (
                  <Pressable
                    key={index}
                    onPress={() => handleOptionSelect(option.value)}
                    className={`border-2 rounded-xl p-4 ${isSelected
                      ? 'border-primary-500 bg-red-50'
                      : 'border-gray-200 bg-white'
                      }`}
                  >
                    <Radio value={option.value.toString()}>
                      <HStack className="items-center justify-between w-full">
                        <HStack className="items-center flex-1" space="sm">
                          <RadioIndicator className={isSelected ? 'border-primary-500' : ''}>
                            <RadioIcon as={CircleIcon} className={isSelected ? 'text-primary-500' : ''} />
                          </RadioIndicator>
                          <RadioLabel>
                            <Text
                              className={`text-base font-medium ${isSelected ? 'text-primary-500' : 'text-gray-900'
                                }`}
                            >
                              {option.label}
                            </Text>
                          </RadioLabel>
                        </HStack>
                      </HStack>
                    </Radio>
                  </Pressable>
                );
              })}
            </VStack>
          </RadioGroup>

          {/* Navigation Buttons */}
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
      </ScrollView>
    </PageLayout>
  );
}
