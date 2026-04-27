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
import { checkQuizCooldown } from '@/api/quiz';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfoModal from '@/components/views/info-modal';
import { ActivityIndicator } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import IconButton from '@/components/inputs/icon-button';
import {
  fetchLeaderboard,
  fetchCurrentUser,
  handleQuizButtonPress,
  handleSignOut,
  animateCardTransition,
  animateQuizButton
} from '@/api/leaderboard';
import { User } from '@/types/User';
import { Spinner } from '@/components/ui/spinner';
import { HStack } from '@/components/ui/hstack';

export default function Leaderboard() {
  // TODO: Replace with actual authentication check
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [showCooldownModal, setShowCooldownModal] = useState(false);
  const [cooldownMessage, setCooldownMessage] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingCurrentUser, setIsLoadingCurrentUser] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const cardFadeAnim = useRef(new Animated.Value(1)).current;
  const cardScaleAnim = useRef(new Animated.Value(1)).current;
  const quizButtonFadeAnim = useRef(new Animated.Value(0)).current;
  const quizButtonSlideAnim = useRef(new Animated.Value(-20)).current;


  const loadLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    const data = await fetchLeaderboard();
    setLeaderboardData(data);
    setIsLoadingLeaderboard(false);
  };

  const loadCurrentUser = async () => {
    setIsLoadingCurrentUser(true);
    const lastUsername = await AsyncStorage.getItem('lastQuizUsername');

    if (!lastUsername) {
      setIsLoadingCurrentUser(false);
      return;
    }

    const user = await fetchCurrentUser(lastUsername);
    setCurrentUser(user);
    setIsLoadingCurrentUser(false);
  };

  const onQuizButtonPress = () => {
    handleQuizButtonPress(setShowCooldownModal, setCooldownMessage);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadLeaderboard(), loadCurrentUser()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadLeaderboard();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!isAnimatingOut) {
      animateCardTransition(cardFadeAnim, cardScaleAnim);
      animateQuizButton(!!currentUser, quizButtonFadeAnim, quizButtonSlideAnim);
    }
  }, [currentUser, isAnimatingOut]);

  const onSignOut = async () => {
    setIsAnimatingOut(true);
    // Animate out first
    Animated.parallel([
      Animated.timing(cardFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardScaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      // After animation completes, handle sign out
      await handleSignOut(setCurrentUser);
      setIsAnimatingOut(false);
      // Reset animation values for next time
      cardFadeAnim.setValue(1);
      cardScaleAnim.setValue(1);
    });
  };

  const signOutButton = <IconButton iconName="log-out-outline" variant="primary" onPress={onSignOut} />

  return (
    <>
      <PageLayout 
        title="Leaderboard" 
        rightView={currentUser ? signOutButton : null} 
        scrollable={true}
        onRefresh={onRefresh}
        refreshing={refreshing}
      >
        {/* Your Rank Card / Sign In Card */}
        <Box className="">
          {(currentUser || isAnimatingOut) && (
            <Animated.View
              style={{
                opacity: cardFadeAnim,
                transform: [{ scale: cardScaleAnim }],
              }}
            >
              <Box className="bg-primary-500 rounded-xl py-6">
                {isLoadingCurrentUser ? (
                  <Box className="py-8 items-center justify-center">
                    <Spinner size="large" color="#ffffff" />
                    <Text className="mt-4 text-white">Loading your stats...</Text>
                  </Box>
                ) : currentUser && (
                  <HStack className="justify-between">
                    <Box className="items-center w-[33%]">
                      <Text className="text-lg font-bold text-white/90 mb-0.5">Your Rank</Text>
                      <Text className="text-2xl font-bold text-white">#{currentUser.rank}</Text>
                    </Box>
                    <Box className="items-center w-[33%]">
                      <Text className="text-lg font-bold text-white/90 mb-0.5">Your Name</Text>
                      <Text className="text-2xl font-bold text-white" numberOfLines={1} ellipsizeMode="tail">{currentUser.name}</Text>
                    </Box>
                    <Box className="items-center w-[33%]">
                      <Text className="text-lg font-bold text-white/90 mb-0.5">Total Score</Text>
                      <Text className="text-2xl font-bold text-white">{currentUser.score}</Text>
                    </Box>
                  </HStack>
                )}
              </Box>
            </Animated.View>
          )}
        </Box>

        {/* Daily Quiz Button */}
        <Box className="pt-4 pb-2">
          <View>
            <Pressable
              className="bg-secondary-500 rounded-xl p-6 border border-secondary-300 active:bg-secondary-700"
              onPress={onQuizButtonPress}
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
          </View>
        </Box>

        {/* Top Performers */}
        <View className="pt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Top Players</Text>
          {isLoadingLeaderboard ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#000" />
              <Text className="mt-4 text-gray-600">Loading leaderboard...</Text>
            </View>
          ) : leaderboardData.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-600">No scores yet. Be the first to play!</Text>
            </View>
          ) : (
            <View className="space-y-3">
              {leaderboardData.map((user) => (
                <HStack key={user.rank} className={`rounded-xl mb-3 p-4 border border-gray-200 justify-between items-center bg-white`}>
                  <View className="flex-row items-center space-x-3 w-[70%]">
                    <View className="p-1">
                      <Text className="text-base font-medium text-gray-900 p-2" numberOfLines={1} ellipsizeMode="tail">{user.name}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-gray-900">#{user.rank}</Text>
                    <Text className="text-sm text-gray-500 mt-0.5">{user.score} pts</Text>
                  </View>
                </HStack>
              ))}
            </View>
          )}
        </View>

      </PageLayout>

      {/* Cooldown Modal */}
      <InfoModal
        isOpen={showCooldownModal}
        onClose={() => setShowCooldownModal(false)}
        title="Come Back Tomorrow!"
        content={cooldownMessage}
        size="md"
      />
    </>
  );
}