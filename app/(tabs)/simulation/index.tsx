import React, { useState, useEffect } from 'react';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import FormLayout from '@/components/layouts/form-layout';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { UserResponses } from '@/types/Question';
import { QUESTIONS } from '@/types/Question';
import { initializeSimulationSetup, handleSimulationReset, loadJobOptionsForCategory, submitSimulationForm } from '@/api/simulation';


export default function SimulationSetup() {
  const [responses, setResponses] = useState<Partial<UserResponses>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [jobOptions, setJobOptions] = useState<{ label: string; value: string | number }[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const result = await initializeSimulationSetup();
      if (result.shouldLoad) {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const resetCheck = async () => {
        const result = await handleSimulationReset();
        if (result.shouldClearResponses) {
          setResponses({});
        }
        if (result.shouldLoad) {
          setIsLoading(false);
        }
      };
      resetCheck();
    }, [])
  );

  useEffect(() => {
    const loadJobOptions = async () => {
      if (responses.careerCategory) {
        setIsLoadingJobs(true);
        const jobs = await loadJobOptionsForCategory(responses.careerCategory as string);
        setJobOptions(jobs);
        setIsLoadingJobs(false);
      }
    };
    loadJobOptions();
  }, [responses.careerCategory]);

  const isFormComplete = Object.keys(responses).length === QUESTIONS.length;

  const fields = QUESTIONS.map((question, index) => ({
    id: question.id,
    label: question.question,
    options: index === 1 ? jobOptions : question.options,
    value: index === 1
      ? jobOptions.find(opt => opt.value === responses[question.id as keyof UserResponses])?.label
      : question.options.find(opt => opt.value === responses[question.id as keyof UserResponses])?.label,
    onValueChange: (label: string) => {
      const option = index === 1
        ? jobOptions.find(opt => opt.label === label)
        : question.options.find(opt => opt.label === label);
      if (option) {
        setResponses({ ...responses, [question.id]: option.value });
      }
    },
    isScrollable: true,
    isLoading: index === 1 && isLoadingJobs,
    loadingText: 'Loading jobs...',
  }));

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  return (
    <FormLayout
      title="Life Simulation"
      heading="Future Questionare"
      helpTitle="Life Simulation Setup"
      helpContent="Experience your financial future! Select your career path, preferred job, location, and comfort level to see a personalized simulation of your financial journey. This tool helps you understand how different career choices impact your financial life."
      fields={fields}
      submitButton={{
        label: 'View Simulation Result',
        onPress: async () => { await submitSimulationForm(responses, QUESTIONS.length); },
        disabled: !isFormComplete,
      }}
    />
  );
}
