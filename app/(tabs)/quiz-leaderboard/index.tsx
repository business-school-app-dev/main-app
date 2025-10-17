import React from 'react';
import { ScrollView, StatusBar } from "react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

import {
    Award,
    BookOpen,
    Brain,
    ChevronLeft,
    CreditCard,
    Home,
    PiggyBank,
    Settings,
    TrendingUp,
    Trophy,
    User,
} from "lucide-react-native";


function Leaderboard() {
    // Data setup remains the same, but with Tailwind background classes
    const leaderboardData = [
        { rank: 1, name: "Sarah Chen", score: 2850, avatar: "SC", streak: 12, bgColor: "bg-amber-100" },
        { rank: 2, name: "Marcus Johnson", score: 2720, avatar: "MJ", streak: 10, bgColor: "bg-gray-100" },
        { rank: 3, name: "Emma Rodriguez", score: 2680, avatar: "ER", streak: 9, bgColor: "bg-orange-200" },
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
    }

    const quizCategories = [
        {
          icon: PiggyBank,
          title: "Budgeting Basics",
          questions: 15,
          difficulty: "Beginner",
          bgColor: "bg-red-50",
          iconColor: "$red500", // Gluestack token format
          completed: true,
        },
        {
          icon: TrendingUp,
          title: "Investment Fundamentals",
          questions: 20,
          difficulty: "Intermediate",
          bgColor: "bg-pink-50",
          iconColor: "$rose700", // Gluestack token format
          completed: true,
        },
        {
          icon: CreditCard,
          title: "Credit & Loans",
          questions: 18,
          difficulty: "Intermediate",
          bgColor: "bg-red-100",
          iconColor: "$red600", // Gluestack token format
          completed: false,
        },
        // ... (rest of quizCategories)
    ]

    const getRankIcon = (rank: number) => {
        // Use gluestack Icon with 'as' prop and color token
        if (rank === 1) return <Icon as={Trophy} size="lg" color="$amber600" />
        if (rank === 2) return <Icon as={Award} size="lg" color="$gray600" />
        if (rank === 3) return <Icon as={Award} size="lg" color="$orange600" />
        return null
    }

    return (
        <ScrollView>
            <StatusBar barStyle="dark-content" />

            <Box className="flex-row items-center justify-between bg-white border-b border-gray-200 px-4 py-4">
                <Pressable className="w-10">
                    <Icon as={ChevronLeft} size="xl" color="$red600" />
                </Pressable>
                <Text className="text-lg font-semibold text-gray-900 flex-1 text-center">
                    Quiz Leaderboard
                </Text>
                <Pressable className="w-10">
                    <Icon as={Settings} size="xl" color="$gray600" />
                </Pressable>
            </Box>

            <ScrollView className="flex-1" contentContainerClassName="pb-[100px]">
                {/* Your Rank Card */}
                <Box className="px-4 pt-4 pb-2">
                    <Box className="bg-red-600 rounded-xl p-4 shadow-xl">
                        <Box className="flex-row justify-between mb-2">
                            <Box className="flex-row items-center space-x-3">
                                <Box className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
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
                        <Box className="flex-row items-center space-x-2 mt-3 pt-3 border-t border-white/20">
                            <Icon as={Brain} size="sm" color="$white" />
                            <Text className="text-sm text-white">{currentUser.streak} day streak </Text>
                        </Box>
                    </Box>
                </Box>

                {/* Top Performers */}
                <Box className="px-4 pt-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Top Performers</Text>
                    <Box className="space-y-3">
                        {leaderboardData.map((user) => (
                            <Box key={user.rank} className={`rounded-xl p-4 border border-gray-200 flex-row justify-between items-center shadow-sm ${user.bgColor}`}>
                                <Box className="flex-row items-center space-x-3">
                                    <Box className="relative">
                                        <Box className="w-12 h-12 rounded-full bg-gray-400 items-center justify-center">
                                            <Text className="text-base font-semibold text-white">{user.avatar}</Text>
                                        </Box>
                                        {user.rank <= 3 && <Box className="absolute -top-1 -right-1">{getRankIcon(user.rank)}</Box>}
                                    </Box>
                                    <Box>
                                        <Text className="text-base font-medium text-gray-900 mb-1">{user.name}</Text>
                                        <Box className="bg-gray-100 px-2 py-0.5 rounded self-start">
                                            <Text className="text-xs text-gray-600">{user.streak} day streak</Text>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className="items-end">
                                    <Text className="text-2xl font-bold text-gray-900">#{user.rank}</Text>
                                    <Text className="text-sm text-gray-500 mt-0.5">{user.score} pts</Text>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Quiz Categories */}
                <Box className="px-4 pt-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Practice Quizzes</Text>
                    <Box className="space-y-3">
                        {quizCategories.map((category, index) => {
                            const IconComponent = category.icon
                            return (
                                <Pressable key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <Box className="flex-row items-center space-x-4">
                                        <Box className={`w-14 h-14 rounded-xl items-center justify-center ${category.bgColor}`}>
                                            {/* Gluestack Icon usage */}
                                            <Icon as={IconComponent} size="xl" color={category.iconColor} />
                                        </Box>
                                        <Box className="flex-1">
                                            <Box className="flex-row justify-between items-center mb-1">
                                                <Text className="text-base font-semibold text-gray-900">{category.title}</Text>
                                                {category.completed && <Text className="text-lg text-green-600">✓</Text>}
                                            </Box>
                                            <Box className="flex-row items-center space-x-3">
                                                <Text className="text-sm text-gray-500">{category.questions} questions</Text>
                                                <Text className="text-sm text-gray-500">•</Text>
                                                <Text className="text-sm text-gray-500">{category.difficulty}</Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Pressable>
                            )
                        })}
                    </Box>
                </Box>
            </ScrollView>

            <Box className="bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex-row justify-around py-3 px-4">
                <Pressable className="items-center space-y-1">
                    <Icon as={Home} size="xl" color="$gray500" />
                    <Text className="text-xs text-gray-500">Home</Text>
                </Pressable>
                <Pressable className="items-center space-y-1">
                    <Icon as={BookOpen} size="xl" color="$gray500" />
                    <Text className="text-xs text-gray-500">Quizzes</Text>
                </Pressable>
                <Pressable className="items-center space-y-1">
                    <Icon as={Trophy} size="xl" color="$red600" />
                    <Text className="text-xs text-gray-500 text-red-600">Leaderboard</Text>
                </Pressable>
                <Pressable className="items-center space-y-1">
                    <Icon as={User} size="xl" color="$gray500" />
                    <Text className="text-xs text-gray-500">Profile</Text>
                </Pressable>
            </Box>
            </ScrollView>
    )
}

export default Leaderboard;