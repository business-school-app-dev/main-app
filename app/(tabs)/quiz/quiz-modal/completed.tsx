import TextButton from '@/components/inputs/text-button';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useQuizCompletion } from '@/api/quiz';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import React from 'react';
import { StatusBar, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import IconButton from '@/components/inputs/icon-button';
import QuizNavbar from '@/components/navigation/quiz-navbar';

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

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="pb-4 flex-row items-center justify-between">
        <VStack className="pb-4 w-full" space="md">
          <QuizNavbar title="Quiz Completed" />
        </VStack>

      </View>

      <View className="flex-1 mt-6">
        {/* Score Display */}
        <View className="bg-gray-100 rounded-2xl p-6 mb-8">
          <Text className="text-center text-3xl font-bold text-gray-900">
            {scoreFromParams}/{totalFromParams}
          </Text>
          <Text className="text-center text-gray-600 mt-1">
            Your Daily Quiz Score
          </Text>
        </View>

        {/* Leaderboard Form */}
        {submitted ? (
          <View className="bg-green-100 rounded-xl p-4 mb-6">
            <Text className="text-green-800 text-center">
              Your name has been added to the leaderboard!
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Enter your name to be featured on the leaderboard!
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-base mb-6"
              placeholderTextColor="#9CA3AF"
            />

            {submitError ? (
              <Text className="text-red-600 mb-3 text-sm">{submitError}</Text>
            ) : null}


          </>
        )}

        <VStack space="md" className="mt-auto mb-10">
          <TextButton
            label="Submit to Leaderboard"
            onPress={handleSubmit}
            variant="secondary"
            size="lg"
            disabled={name.trim() === '' || isSubmitting}
          />
          <TextButton
            label="Return Home"
            onPress={() => router.replace('/')}
            variant="secondary"
            size="lg"
            className="mt-2"
          />
        </VStack>
      </View>
    </SafeAreaView>
  );
}

