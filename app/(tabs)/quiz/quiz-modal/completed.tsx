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
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-6 pb-4 pt-2 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        >
          <Icon as={X} size="lg" color="black" />
        </Pressable>

        <Text className="font-semibold text-gray-700">Quiz Completed</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6 mt-6">
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

            <TextButton
              label="Submit to Leaderboard"
              onPress={handleSubmit}
              variant="secondary"
              size="lg"
              disabled={name.trim() === '' || isSubmitting}
            />
          </>
        )}

        <TextButton
          label="Return Home"
          onPress={() => router.replace('/')}
          variant="primary"
          size="lg"
          className="mt-2"
        />
      </View>
    </SafeAreaView>
  );
}

