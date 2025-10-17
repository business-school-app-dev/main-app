import "@/global.css";
import React, { useState } from 'react';
import { ScrollView, View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from 'expo-router';
import { ChevronLeftIcon } from '@/components/ui/icon';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@/components/ui/modal';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import PageLayout from "@/components/layouts/page-layout";

// Icon components for the cards
const CreditCardIcon = () => (
    <View className="w-12 h-12 rounded-xl justify-center items-center bg-blue-100">
        <View className="w-8 h-6 rounded border-2 border-blue-800 bg-blue-500 justify-end pb-1 pl-1">
            <View className="w-6 h-1 bg-blue-300 rounded" />
        </View>
    </View>
);

const TrendingUpIcon = () => (
    <View className="w-12 h-12 rounded-xl justify-center items-center bg-green-100">
        <View className="flex-row items-end h-8">
            <View className="w-1.5 h-3 bg-green-600 rounded-t" />
            <View className="w-1.5 h-5 bg-green-600 rounded-t ml-1" />
            <View className="w-1.5 h-7 bg-green-600 rounded-t ml-1" />
            <View className="w-1.5 h-8 bg-green-600 rounded-t ml-1" />
        </View>
    </View>
);

const ShieldIcon = () => (
    <View className="w-12 h-12 rounded-xl justify-center items-center bg-purple-100">
        <View className="w-6 h-8 bg-purple-600 rounded-xl" />
    </View>
);

const BookIcon = () => (
    <View className="w-12 h-12 rounded-xl justify-center items-center bg-orange-200">
        <View className="w-6 h-8 bg-orange-600 rounded relative">
            <View className="absolute left-1 right-1 h-0.5 bg-orange-200 top-1" />
            <View className="absolute left-1 right-1 h-0.5 bg-orange-200 top-2.5" />
            <View className="absolute left-1 right-1 h-0.5 bg-orange-200 top-4" />
            <View className="absolute left-1 right-1 h-0.5 bg-orange-200 top-5.5" />
        </View>
    </View>
);

interface GuideCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ icon, title, description, onPress }) => (
    <View className="bg-white p-4 flex-1 rounded-xl shadow-md shadow-black/10 elevation-5">
        {icon}
        <Text className="text-base font-semibold text-gray-900 mt-3 mb-1.5">{title}</Text>
        <Text className="text-sm text-gray-500 leading-5 mb-4">{description}</Text>
        <Button className="bg-red-600 px-5 py-2.5 rounded-2xl self-start" onPress={onPress}>
            <ButtonText className="text-white text-sm font-medium">Read More</ButtonText>
        </Button>
    </View>
);

// Expanded content for each card type
const getExpandedContent = (cardType: string) => {
    const content = {
        'Credit Card Basics': {
            title: 'Credit Card Basics',
            content: `Credit cards are financial tools that allow you to borrow money from a bank or financial institution to make purchases. Here are the key concepts you should understand:

• Credit Limit: The maximum amount you can borrow on your card
• Interest Rate (APR): The cost of borrowing money, expressed as an annual percentage
• Minimum Payment: The smallest amount you must pay each month
• Grace Period: Time between purchase and when interest starts accruing
• Credit Score Impact: How your card usage affects your creditworthiness

Benefits of credit cards include building credit history, earning rewards, fraud protection, and convenience for online purchases. However, it's important to use them responsibly to avoid debt accumulation.`
        },
        'Building Credit': {
            title: 'Building Credit',
            content: `Building good credit takes time and consistent responsible behavior. Here are proven strategies to establish and improve your credit score:

• Pay on time, every time: Payment history is 35% of your credit score
• Keep balances low: Use less than 30% of your available credit limit
• Don't close old accounts: Length of credit history matters
• Limit new credit applications: Too many inquiries can hurt your score
• Monitor your credit report: Check for errors and dispute them promptly
• Consider becoming an authorized user on someone else's account

Start with a secured credit card or student card if you're new to credit. Be patient - building excellent credit typically takes 6+ months of responsible use.`
        },
        'Security Tips': {
            title: 'Security Tips',
            content: `Protecting your credit card information is crucial in today's digital world. Follow these security best practices:

• Never share your card details via email, text, or phone unless you initiated the contact
• Use secure websites (look for https://) when shopping online
• Monitor your statements regularly for unauthorized charges
• Set up account alerts for transactions and payments
• Cover your PIN when entering it in public
• Don't store card info on shared or public computers
• Report lost or stolen cards immediately
• Use contactless payments when possible
• Be cautious with public WiFi for financial transactions

If you notice suspicious activity, contact your card issuer immediately. Most banks offer zero liability protection for fraudulent charges.`
        },
        'Responsible Use': {
            title: 'Responsible Use',
            content: `Responsible credit card management helps you build wealth and avoid debt traps. Here are essential practices:

• Create a budget and stick to it
• Only charge what you can afford to pay off in full
• Pay your full balance each month to avoid interest charges
• Set up automatic payments for at least the minimum amount
• Use credit cards for planned purchases, not impulse buys
• Take advantage of rewards programs that match your spending
• Read and understand your card's terms and conditions
• Don't use credit cards for cash advances (high fees apply)
• Keep your credit utilization below 30% of your limit

Remember: Credit cards are tools to build credit and earn rewards, not extensions of your income. Living within your means is the foundation of financial health.`
        }
    };
    return content[cardType as keyof typeof content] || { title: cardType, content: 'Information not available.' };
};

export default function CreditCardsScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedContent, setSelectedContent] = useState({ title: '', content: '' });

    const handleGoBack = () => {
        router.back();
    };

    const handleReadMore = (cardType: string) => {
        const content = getExpandedContent(cardType);
        setSelectedContent(content);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <PageLayout title="Credit Cards" backButtonHidden className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4">
                    {/* Section Title */}
                    <Text className="text-2xl font-medium text-gray-900 mb-6">Quick Guides & Resources</Text>

                    {/* Guide Cards Grid */}
                    <View className="gap-4">
                        <View className="flex-row gap-4 mb-4">
                            <GuideCard
                                icon={<CreditCardIcon />}
                                title="Credit Card Basics"
                                description="Learn how credit cards work and their benefits"
                                onPress={() => handleReadMore('Credit Card Basics')}
                            />
                            <GuideCard
                                icon={<TrendingUpIcon />}
                                title="Building Credit"
                                description="Tips for establishing and improving credit score"
                                onPress={() => handleReadMore('Building Credit')}
                            />
                        </View>

                        <View className="flex-row gap-4 mb-4">
                            <GuideCard
                                icon={<ShieldIcon />}
                                title="Security Tips"
                                description="Keep your credit card information safe"
                                onPress={() => handleReadMore('Security Tips')}
                            />
                            <GuideCard
                                icon={<BookIcon />}
                                title="Responsible Use"
                                description="Best practices for credit card management"
                                onPress={() => handleReadMore('Responsible Use')}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modal for expanded content */}
            <Modal isOpen={isModalVisible} onClose={closeModal}>
                <ModalBackdrop />
                <ModalContent className="max-w-[90%] max-h-[80%]">
                    <ModalHeader>
                        <Heading size="lg">{selectedContent.title}</Heading>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text className="text-base text-gray-700 leading-6 text-left">{selectedContent.content}</Text>
                        </ScrollView>
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={closeModal} className="bg-red-600">
                            <ButtonText className="text-white">Close</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </PageLayout>
    );
}


