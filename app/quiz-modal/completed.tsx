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
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Icon, CloseIcon } from '@/components/ui/icon';
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
  const isSmallDevice = height < 625;

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

  useEffect(() => {
    if (submitted) {
      setModalState({
        isOpen: true,
        title: 'Success!',
        content: 'Your name has been added to the leaderboard!',
        isError: false,
      });
    }
  }, [submitted]);

  useEffect(() => {
    if (submitError) {
      setModalState({
        isOpen: true,
        title: 'Error',
        content: submitError,
        isError: true,
      });
    }
  }, [submitError]);

  const content = (
    <VStack space="md" className="pb-4 h-full">
      {/* Score Display */}
      <Card variant="outline" className="rounded-xl bg-white py-6 items-center">
        <CircularProgress color={PRIMARY} score={scoreFromParams} total={totalFromParams} size={200} strokeWidth={12}>
          <VStack space="xs" className="items-center">
            <Text className="text-center text-3xl font-bold text-gray-900">
              {scoreFromParams}/{totalFromParams}
            </Text>
            <Text className="text-center text-gray-600 text-lg">
              Daily Quiz Scoregg
            </Text>
          </VStack>
        </CircularProgress>
      </Card>

      {/* Leaderboard Form */}
      <Card variant="outline" className="bg-white rounded-xl p-4">
        <VStack space="sm">
          <Text className="text-base font-semibold text-gray-900">
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
        onPress={() => {
          handleSubmit();
          // setModalState({
          //   isOpen: true,
          //   title: 'Submitting...',
          //   content: 'Please wait while we submit your score.',
          //   isError: false,
          // });
        }}
        variant="secondary"
        className="mt-auto"
        size="lg"
        disabled={name.trim() === '' || isSubmitting}
      />
    </VStack>
  );

  return (
    <>
      <PageLayout title="Quiz Completed" scrollable={isSmallDevice} leftView={<CloseButton />}>
        <VStack space="md" className="pb-4 h-full">
          {/* Score Display */}
          <Card variant="outline" className="rounded-xl bg-white py-6 items-center">
            <CircularProgress color={PRIMARY} score={scoreFromParams} total={totalFromParams} size={200} strokeWidth={12}>
              <VStack space="xs" className="items-center">
                <Text className="text-center text-3xl font-bold text-gray-900">
                  {scoreFromParams}/{totalFromParams}
                </Text>
                <Text className="text-center text-gray-600 text-xs">
                  Daily Quiz Score
                </Text>
              </VStack>
            </CircularProgress>
          </Card>

          {/* Leaderboard Form */}
          <Card variant="outline" className="bg-white rounded-xl p-4">
            <VStack space="sm">
              <Text className="text-base font-semibold text-gray-900">
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
            onPress={() => {
              handleSubmit();
              // setModalState({
              //   isOpen: true,
              //   title: 'Submitting...',
              //   content: 'Please wait while we submit your score.',
              //   isError: false,
              // });
            }}
            variant="secondary"
            className="mt-auto mb-10"
            size="lg"
            disabled={name.trim() === '' || isSubmitting}
          />
        </VStack>
      </PageLayout>

      {/* Unified Modal */}
      <Modal isOpen={modalState.isOpen} onClose={() => setModalState((prev) => ({ ...prev, isOpen: false, isError: false }))} size="sm">
        <ModalBackdrop />
        <ModalContent className="rounded-xl">
          <ModalHeader>
            <Heading size="lg">
              {modalState.title}
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            <Text className="text-base text-gray-700 leading-6">
              {modalState.content}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal >
    </>
  );
}

