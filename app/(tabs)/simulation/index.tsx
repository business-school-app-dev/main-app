import React, { useState, useEffect, useCallback } from 'react';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import FormLayout from '@/components/layouts/form-layout';
import { useFocusEffect, router } from 'expo-router';
import { UserResponses, QUESTIONS } from '@/types/Question';
import { fetchJobsByCategory, fetchSimulationParams } from '@/api/simulation';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SimulationSetup() {
  const [responses, setResponses] = useState<Partial<UserResponses>>({});
  const [jobOptions, setJobOptions] = useState<{ label: string; value: string | number }[]>([]);

  useEffect(() => {
    checkExistingSetup();
  }, []);

  const checkExistingSetup = async () => {
    try {
      const resetFlag = await AsyncStorage.getItem('@simulation_reset');
      if (resetFlag === 'true') {
        await AsyncStorage.removeItem('@simulation_reset');
        return;
      }

      const setupData = await AsyncStorage.getItem('@simulation_setup');
      if (setupData) {
        router.replace('/(tabs)/simulation/result');
        return;
      } else {
      }
    } catch (error) {
      console.error('Error loading setup data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const resetCheck = async () => {
        const resetFlag = await AsyncStorage.getItem('@simulation_reset');
        if (resetFlag === 'true') {
          await AsyncStorage.removeItem('@simulation_reset');
          setResponses({});
        }
      };
      resetCheck();
    }, [])
  );

  useEffect(() => {
    const loadJobOptions = async () => {
      if (responses.careerCategory) {
        try {
          const response = await fetchJobsByCategory(responses.careerCategory as string);
          if (response && response.jobs && Array.isArray(response.jobs)) {
            const jobs = response.jobs.map((job) => ({
              label: job.title,
              value: job.id,
            }));
            setJobOptions(jobs);
          }
        } catch (error) {
          console.error('Error loading jobs:', error);
          setJobOptions([]);
        } finally {
        }
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
    // isLoading: index === 1 && isLoadingJobs,
    // loadingText: 'Loading jobs...',
  }));

  const handleSubmit = async () => {
    if (isFormComplete) {
      try {
        // Save user responses
        await AsyncStorage.setItem('@simulation_setup', JSON.stringify(responses));

        // Navigate immediately
        router.push('/(tabs)/simulation/result');

        // Fetch simulation data in the background
        fetchSimulationParams(responses as UserResponses)
          .then(simulationData => {
            // Save simulation data
            AsyncStorage.setItem('@simulation_data', JSON.stringify(simulationData));
          })
          .catch(error => {
            console.error('Error fetching simulation data:', error);
          });
      } catch (error) {
        console.error('Error submitting simulation:', error);
        // Navigate anyway
        router.push('/(tabs)/simulation/result');
      }
    }
  };

  // if (isLoading) {
  //   return (
  //     <View className="flex-1 items-center justify-center">
  //       <Text className="text-gray-500">Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <FormLayout
      title="Life Simulation"
      heading="Set Up Your Simulation"
      helpTitle="Life Simulation Setup"
      helpContent="Experience your financial future! Select your career path, preferred job, location, and comfort level to see a personalized simulation of your financial journey. This tool helps you understand how different career choices impact your financial life."
      fields={fields}
      submitButton={{
        label: 'View Simulation',
        onPress: handleSubmit,
        disabled: !isFormComplete,
      }}
    />
  );
}
