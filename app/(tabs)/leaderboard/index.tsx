import React from 'react';
import { ScrollView, View, StatusBar } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage} from '@/components/ui/avatar';
import { CalendarDaysIcon, StarIcon} from '@/components/ui/icon';
import PageLayout from '@/components/layouts/page-layout';

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
        <PageLayout title="Leaderboard" backButtonHidden className="flex-1 bg-gray-50">

            <ScrollView className="flex-1" contentContainerClassName="pb-[100px]">
                {/* Your Rank Card */}
                    <Card className="bg-red-600 rounded-xl p-4 m-3">
                        <View className="flex-row justify-between mb-3">
                            <View className="flex-row items-center space-x-3">
                                <View className="w-12 h-12 rounded-full items-center justify-center m-4">
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
                                <View className="w-20 items-start">
                                    <Text className="text-sm text-white/90 mb-0.5">Your Rank</Text>
                                    <Text className="text-2xl font-bold text-white">#{currentUser.rank}</Text>
                                </View>
                            </View>
                            <View className="items-end p-3">
                                <Text className="text-sm text-white/90 mb-0.5">Total Score</Text>
                                <Text className="text-2xl font-bold text-white">{currentUser.score}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center space-x-2 mt-3 pt-3 border-t border-white/20">
                            <Icon as={CalendarDaysIcon} size="sm" color="white" className="p-1" />
                            <Text className="text-sm text-white p-1">{currentUser.streak} day streak </Text>
                        </View>
                    </Card>

                {/* Top Performers */}
                <View className="px-4 pt-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Top Players</Text>
                    <View className="space-y-3">
                        {leaderboardData.map((user) => (
                            <Card key={user.rank} className={`rounded-xl p-4 m-1 flex-row justify-between items-center ${user.bgColor}`}>
                                <View className="flex-row items-center space-x-3">
                                    <View className="relative">
                                        <View className="w-12 h-12 rounded-full bg-gray-400 items-center justify-center">
                                            <Text className="text-base font-semibold text-white">{user.avatar}</Text>
                                        </View>
                                        {user.rank <= 3 && <View className="absolute -top-1 -right-1">{getRankIcon(user.rank)}</View>}
                                    </View>
                                    <View className="p-2">
                                        <Text className="text-base font-medium text-gray-900 mb-1">{user.name}</Text>
                                        <View className="bg-gray-100 px-2 py-0.5 rounded self-start">
                                            <Text className="text-xs text-gray-600">{user.streak} day streak</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <Text className="text-2xl font-bold text-gray-900">#{user.rank}</Text>
                                    <Text className="text-sm text-gray-500 mt-0.5">{user.score} pts</Text>
                                </View>
                            </Card>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </PageLayout>
        
    );
}
/*
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

Quiz Categories
                <Box className="px-4 pt-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Practice Quizzes</Text>
                    <Box className="space-y-3">
                        {quizCategories.map((category, index) => {
                            const IconComponent = category.icon
                            return (
                                <Pressable key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <Box className="flex-row items-center space-x-4">
                                        <Box className={`w-14 h-14 rounded-xl items-center justify-center ${category.bgColor}`}>
                                            
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
*/