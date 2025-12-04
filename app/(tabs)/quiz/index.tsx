import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Animated } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { StarIcon } from '@/components/ui/icon';
import { Flame } from 'lucide-react-native';
import PageLayout from '@/components/layouts/page-layout';
import { HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { View } from '@/components/ui/view';

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
  // TODO: Replace with actual authentication check
  const [isSignedIn, setIsSignedIn] = useState(true); // Change this to true to test signed-in state
  const [submittedQuiz, setIsSubmittedQuiz] = useState(false);
  const cardFadeAnim = useRef(new Animated.Value(1)).current;
  const cardScaleAnim = useRef(new Animated.Value(1)).current;
  const quizButtonFadeAnim = useRef(new Animated.Value(0)).current;
  const quizButtonSlideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Animate card transition when isSignedIn changes
    Animated.sequence([
      // Fade out and scale down current card
      Animated.parallel([
        Animated.timing(cardFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(cardScaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // Fade in and scale up new card
      Animated.parallel([
        Animated.timing(cardFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(cardScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animate quiz button appearance/disappearance
    if (isSignedIn) {
      quizButtonFadeAnim.setValue(0);
      quizButtonSlideAnim.setValue(-20);
      Animated.parallel([
        Animated.timing(quizButtonFadeAnim, {
          toValue: 1,
          duration: 400,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.spring(quizButtonSlideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(quizButtonFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSignedIn]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Icon as={StarIcon} size="lg" color="gold" />
    if (rank === 2) return <Icon as={StarIcon} size="lg" color="gray" />
    if (rank === 3) return <Icon as={StarIcon} size="lg" color="orange" />
    return null
  }

  return (
    <PageLayout title="Quiz">
      {/* Your Rank Card / Sign In Card */}
      <Box className="pt-4 pb-2">
        <Animated.View
          style={{
            opacity: cardFadeAnim,
            transform: [{ scale: cardScaleAnim }],
          }}
        >
          {isSignedIn ? (
            <Box className="bg-primary-500 rounded-xl p-4 border border-gray-200">
              <Box className="flex-row justify-between mb-3">
                <Box className="flex-row items-center space-x-3">
                  <Box className="w-12 h-12 rounded-full bg-white/20 items-center justify-center m-4">
                    <Avatar size="lg">
                      <AvatarFallbackText>{currentUser.name}</AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: currentUser.profilePic,
                        }}
                      />
                      <AvatarBadge />
                    </Avatar>
                  </Box>
                  <Box>
                    <Text className="text-sm text-white/90 mb-0.5">Your Rank</Text>
                    <Text className="text-2xl font-bold text-white">#{currentUser.rank}</Text>
                  </Box>
                </Box>
                <Box className="items-end">
                  <Text className="text-sm text-white/90 mb-0.5">Total Score</Text>
                  <Text className="text-2xl font-bold text-white">{currentUser.score}</Text>
                </Box>
              </Box>
              <Box className="flex-row items-center justify-between mt-3 pt-3 border-t border-white/20">
                <Box className="flex-row items-center space-x-2">
                  <Icon as={Flame} size="sm" color="white" className="p-1" />
                  <Text className="text-sm text-white p-1">{currentUser.streak} day streak </Text>
                </Box>
                <Pressable
                  onPress={() => setIsSignedIn(false)}
                  className="bg-white/20 px-4 py-2 rounded-full active:bg-white/30"
                >
                  <Text className="text-sm font-semibold text-white">Sign Out</Text>
                </Pressable>
              </Box>
            </Box>
          ) : (
            <View />
          )}
        </Animated.View>
      </Box>

      {/* Daily Quiz Button - Only show if signed in */}
      {!submittedQuiz && (
        <Box className="pt-4 pb-2">
          <Animated.View
            style={{
              opacity: quizButtonFadeAnim,
              transform: [{ translateY: quizButtonSlideAnim }],
            }}
          >
            <Pressable
              className="bg-secondary-500 rounded-xl p-6 border border-secondary-300 active:bg-secondary-700"
              onPress={() => {
                router.push("/quiz-modal");
              }}
            >
              <Box className="flex-row items-center justify-between">
                <Box className="flex-row items-center gap-4">
                  <Box className="w-14 h-14 rounded-full bg-white/30 items-center justify-center">
                    <Icon as={HelpCircle} size="xl" color="black" />
                  </Box>
                  <Box>
                    <Text className="text-xl font-bold text-gray-900 mb-1">Daily Quiz</Text>
                    <Text className="text-sm text-gray-700">Test your knowledge today!</Text>
                  </Box>
                </Box>
                <Box className="bg-white/30 px-4 py-2 rounded-full">
                  <Text className="text-sm font-semibold text-gray-900">Start</Text>
                </Box>
              </Box>
            </Pressable>
          </Animated.View>
        </Box>
      )}

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

    </PageLayout>
  );
}