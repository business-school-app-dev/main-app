import React, { useState } from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { X } from 'lucide-react-native';
import { router } from 'expo-router';
import { RadioGroup, Radio, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sample quiz data
const quizData = {
    currentQuestion: 1,
    totalQuestions: 20,
    question: "What is the 50/30/20 budgeting rule?",
    options: [
        "50% needs, 30% wants, 20% savings",
        "50% savings, 30% needs, 20% wants",
        "50% wants, 30% needs, 20% savings",
        "50% needs, 30% savings, 20% wants"
    ],
    correctAnswer: 0
};

export default function QuizModal() {
    const [selectedOption, setSelectedOption] = useState<string>("");

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" translucent={false} />

            {/* Header */}
            <View className="px-6 pb-4">
                <View className="flex-row items-center justify-between mb-4">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
                    >
                        <Icon as={X} size="lg" color="black" />
                    </Pressable>
                    <Text className="text-base font-medium text-gray-700">
                        {quizData.currentQuestion} / {quizData.totalQuestions}
                    </Text>
                </View>

                {/* Progress Bar */}
                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${(quizData.currentQuestion / quizData.totalQuestions) * 100}%` }}
                    />
                </View>
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
            >
                {/* Question */}
                <Text className="text-2xl font-bold text-gray-900 mb-6 mt-4">
                    {quizData.question}
                </Text>

                {/* Options */}
                <RadioGroup value={selectedOption} onChange={setSelectedOption}>
                    <View className="space-y-3">
                        {quizData.options.map((option, index) => (
                            <Pressable
                                key={index}
                                onPress={() => setSelectedOption(index.toString())}
                                className={`border-2 rounded-2xl p-4 ${selectedOption === index.toString()
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <Radio value={index.toString()} className="flex-row items-center">
                                    <RadioIndicator className="mr-3">
                                        <RadioIcon as={CircleIcon} />
                                    </RadioIndicator>
                                    <RadioLabel>
                                        <Text className="text-base text-gray-900 flex-1">
                                            {option}
                                        </Text>
                                    </RadioLabel>
                                </Radio>
                            </Pressable>
                        ))}
                    </View>
                </RadioGroup>
            </ScrollView>

            {/* Bottom Button */}
            <View className="px-6 pt-4">
                <Pressable
                    onPress={() => {
                        // Handle answer check
                        console.log('Checking answer:', selectedOption);
                    }}
                    disabled={selectedOption === ""}
                    className={`rounded-2xl py-4 items-center ${selectedOption === ""
                        ? 'bg-gray-400'
                        : 'bg-gray-600 active:bg-gray-700'
                        }`}
                >
                    <Text className="text-white text-lg font-semibold">
                        Check Answer
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
