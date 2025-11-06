import React from 'react';
import { ScrollView, View, StatusBar } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';

import { StarIcon } from '@/components/ui/icon';
import { Flame } from 'lucide-react-native';

import PageLayout from '@/components/layouts/page-layout';
import { HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';

const leaderboardData = [
  { rank: 1, name: "Sarah Chen", score: 2850, avatar: "SC", streak: 12, bgColor: "bg-white" },
  { rank: 2, name: "Marcus Johnson", score: 2720, avatar: "MJ", streak: 10, bgColor: "bg-white" },
  { rank: 3, name: "Emma Rodriguez", score: 2680, avatar: "ER", streak: 9, bgColor: "bg-white" },
  { rank: 4, name: "Alex Kumar", score: 2540, avatar: "AK", streak: 8, bgColor: "bg-white" },
  { rank: 5, name: "Jordan Lee", score: 2480, avatar: "JL", streak: 7, bgColor: "bg-white" },
  { rank: 6, name: "Taylor Smith", score: 2320, avatar: "TS", streak: 6, bgColor: "bg-white" },
]

const currentUser = {
  rank: 8,
  name: "You",
  score: 2150,
  avatar: "YO",
  streak: 5,
  profilePic: "https://plus.unsplash.com/premium_photo-1756131939171-728118fbad4a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
}


export default function Leaderboard() {

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Icon as={StarIcon} size="lg" color="gold" />
    if (rank === 2) return <Icon as={StarIcon} size="lg" color="gray" />
    if (rank === 3) return <Icon as={StarIcon} size="lg" color="orange" />
    return null
  }

  return (
    <PageLayout title="Quiz" backButtonHidden>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerClassName="pb-10">
        {/* Your Rank Card */}
        <View className="pt-4 pb-2">
          <View className="bg-primary-500 rounded-xl p-4 border border-gray-200">
            <View className="flex-row justify-between mb-3">
              <View className="flex-row items-center space-x-3">
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center m-4">
                  <Avatar size="lg">
                    <AvatarFallbackText>{currentUser.name}</AvatarFallbackText>
                    <AvatarImage
                      source={{
                        uri: currentUser.profilePic,
                      }}
                    />
                    <AvatarBadge />
                  </Avatar>
                </View>
                <View>
                  <Text className="text-sm text-white/90 mb-0.5">Your Rank</Text>
                  <Text className="text-2xl font-bold text-white">#{currentUser.rank}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-sm text-white/90 mb-0.5">Total Score</Text>
                <Text className="text-2xl font-bold text-white">{currentUser.score}</Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-2 mt-3 pt-3 border-t border-white/20">
              <Icon as={Flame} size="sm" color="white" className="p-1" />
              <Text className="text-sm text-white p-1">{currentUser.streak} day streak </Text>
            </View>
          </View>
        </View>

        {/* Daily Quiz Button */}
        <View className="pt-4 pb-2">
          <Pressable
            className="bg-secondary-500 rounded-xl p-6 border border-secondary-300 active:bg-secondary-700"
            onPress={() => {
              router.push("/quiz-page/quiz-modal");
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-4">
                <View className="w-14 h-14 rounded-full bg-white/30 items-center justify-center">
                  <Icon as={HelpCircle} size="xl" color="black" />
                </View>
                <View className="ml-4">
                  <Text className="text-xl font-bold text-gray-900 mb-1">Daily Quiz</Text>
                  <Text className="text-sm text-gray-700">Test your knowledge today!</Text>
                </View>
              </View>
              <View className="bg-white/30 px-4 py-2 rounded-full">
                <Text className="text-sm font-semibold text-gray-900">Start</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Top Performers */}
        <View className="pt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Top Players</Text>
          <View className="space-y-3">
            {leaderboardData.map((user) => (
              <View key={user.rank} className={`rounded-xl mb-3 p-4 border border-gray-200 flex-row justify-between items-center ${user.bgColor}`}>
                <View className="flex-row items-center space-x-3">
                  <View className="relative">
                    <View className="w-12 h-12 rounded-full bg-gray-400 items-center justify-center">
                      <Text className="text-base font-semibold text-white">{user.avatar}</Text>
                    </View>
                  </View>
                  <View className="p-1">
                    <Text className="text-base font-medium text-gray-900 mb-1 p-1">{user.name}</Text>
                    <View className="bg-gray-100 px-2 py-0.5 rounded self-start">
                      <Text className="text-xs text-gray-600">{user.streak} day streak</Text>
                    </View>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-2xl font-bold text-gray-900">#{user.rank}</Text>
                  <Text className="text-sm text-gray-500 mt-0.5">{user.score} pts</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </PageLayout>

  );
}