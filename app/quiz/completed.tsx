import TextButton from '@/components/inputs/text-button';
import TextInputField from '@/components/inputs/text-input-field';
import { Text } from '@/components/ui/text';
import { useQuizCompletion } from '@/api/quiz';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import PageLayout from '@/components/layouts/page-layout';
import { Card } from '@/components/ui/card';
import InfoModal from '@/components/views/info-modal';
import CircularProgress from '@/components/views/circular-progress';
import { PRIMARY } from '@/constants/colors';
import IconButton from '@/components/inputs/icon-button';
import CloseButton from '@/components/inputs/close-button';

export default function QuizCompleted() {
  const {
    name,
    setName,
    submitted,
    isSubmitting,
    submitError,
    scoreFromParams,
    totalFromParams,
    handleSubmit,
  } = useQuizCompletion();

  const { height } = useWindowDimensions();
  const isSmallDevice = height <= 625;
  const isSmallPhone = height <= 670;

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    isError: boolean;
  }>({
    isOpen: false,
    title: '',
    content: '',
    isError: false,
  });

  // Single source of truth for the modal: success > error > submitting.
  // Splitting these into multiple effects caused last-write-wins races
  // when both `submitted` and `submitError` settled in the same cycle.
  useEffect(() => {
    if (submitted) {
      setModalState({
        isOpen: true,
        title: 'Success!',
        content: 'Your name has been added to the leaderboard!',
        isError: false,
      });
    } else if (submitError) {
      setModalState({
        isOpen: true,
        title: 'Error',
        content: submitError,
        isError: true,
      });
    } else if (isSubmitting) {
      setModalState({
        isOpen: true,
        title: 'Submitting...',
        content: 'Please wait while we submit your score.',
        isError: false,
      });
    }
  }, [submitted, submitError, isSubmitting]);

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false, isError: false }));

    if (submitted && !modalState.isError) {
      router.replace("/(tabs)/leaderboard");
    }
  }


  return (
    <>
      <PageLayout title="Quiz Completed" scrollable={isSmallDevice} leftView={<CloseButton />}>
        <VStack space="2xl" className="pb-4 h-full">
          {/* Score Display */}
          <Card variant="outline" className="rounded-xl bg-white py-6 items-center">
            <CircularProgress color={PRIMARY} score={scoreFromParams} total={totalFromParams} size={200} strokeWidth={12}>
              <VStack space="md" className="items-center">
                <Text className="text-center text-4xl font-bold text-gray-900">
                  {scoreFromParams} / {totalFromParams}
                </Text>
                <Text className="text-center text-gray-600 text-md">
                  Daily Quiz Score
                </Text>
              </VStack>
            </CircularProgress>
          </Card>

          {/* Leaderboard Form */}
          <Card variant="outline" className="bg-white rounded-xl p-4">
            <VStack space="xl">
              <Text className="text-lg font-semibold text-gray-900">
                Get featured on the leaderboard!
              </Text>

              <TextInputField
                value={name}
                onChangeText={setName}
                placeholder="Your name"
              />
            </VStack>
          </Card>

          {/* Action Button */}
          <TextButton
            label="Submit to Leaderboard"
            onPress={handleSubmit}
            variant="secondary"
            className={`mt-auto ${isSmallPhone ? 'mb-2' : 'mb-14'}`} size="lg"
            disabled={name.trim() === '' || isSubmitting}
          />
        </VStack>
      </PageLayout>

      {/* Unified Modal */}
      <InfoModal
        isOpen={modalState.isOpen}
        onClose={handleClose}
        title={modalState.title}
        content={modalState.content}
        size="md"
      />
    </>
  );
}

