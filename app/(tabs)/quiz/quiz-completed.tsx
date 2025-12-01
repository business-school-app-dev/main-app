import TextButton from '@/components/inputs/text-button';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { StatusBar, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizCompleted() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Dummy values for now
  const score = 2;
  const total = 3;

  const handleSubmit = () => {
    setSubmitted(true);
    // In the future: send name + score to backend leaderboard
  };

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

        {/* need to replace score/total with whatever score backend creates */}
      <View className="flex-1 px-6 mt-6">
        {/* Score */}
        <View className="bg-gray-100 rounded-2xl p-6 mb-8">
          <Text className="text-center text-3xl font-bold text-gray-900">
            {score}/{total}
          </Text>
          <Text className="text-center text-gray-600 mt-1">
            Your Daily Quiz Score
          </Text>
        </View>

        {/* Name Input */}
        {!submitted ? (
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


            <TextButton
              label="Submit to Leaderboard"
              onPress={handleSubmit}
              variant="secondary"
              size="lg"
              disabled={name.trim() === ''}
            />
          </>
        ) : (
          <View className="bg-green-100 rounded-xl p-4 mb-6">
            <Text className="text-green-800 text-center">
              Your name has been added to the leaderboard!
            </Text>
          </View>
        )}

        {/* should have the option to NOT be on the leaderboard */}
        {/* Home button */}
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
