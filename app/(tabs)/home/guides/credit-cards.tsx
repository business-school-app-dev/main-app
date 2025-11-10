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
import TextButton from '@/components/inputs/text-button';
import { Heading } from '@/components/ui/heading';
import PageLayout from "@/components/layouts/page-layout";
import { CreditCard, TrendingUp, Shield } from 'lucide-react-native';

interface GuideCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  onPress: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ icon, iconBgColor, title, description, onPress }) => (
  <View className="bg-white p-6 w-full rounded-xl border border-gray-200 shadow-black/10 elevation-5 flex-1 min-h-0">
    <View className={`w-20 h-20 rounded-xl justify-center items-center ${iconBgColor}`}>
      {icon}
    </View>
    <Text className="text-2xl font-semibold text-gray-900 mt-5 mb-2">{title}</Text>
    <View className="flex-row items-center justify-between mt-auto">
      <Text className="text-lg text-gray-500 leading-6 flex-1 mr-4">{description}</Text>
      <TextButton
        label="Read More"
        onPress={onPress}
        variant="secondary"
        size="md"
      // rounded="full"
      // textClassName="text-white text-base font-medium"
      />
    </View>
  </View>
);

// Expanded content for each card type
const getExpandedContent = (cardType: string) => {
  const content = {
    'Credit Card Basics': {
      title: 'Credit Card Basics & Responsible Use',
      content: `Credit cards are financial tools that allow you to borrow money from a bank or financial institution to make purchases. Here are the key concepts you should understand:

• Credit Limit: The maximum amount you can borrow on your card
• Interest Rate (APR): The cost of borrowing money, expressed as an annual percentage
• Minimum Payment: The smallest amount you must pay each month
• Grace Period: Time between purchase and when interest starts accruing
• Credit Score Impact: How your card usage affects your creditworthiness

Benefits of credit cards include building credit history, earning rewards, fraud protection, and convenience for online purchases. However, it's important to use them responsibly to avoid debt accumulation.

RESPONSIBLE USE BEST PRACTICES

Responsible credit card management helps you build wealth and avoid debt traps. Here are essential practices:

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
    <PageLayout title="Credit Cards">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="py-6 flex-1">
          {/* Guide Cards Grid */}
          <View className="gap-4 flex-1">
            <GuideCard
              icon={<CreditCard size={40} color="#1e40af" />}
              iconBgColor="bg-blue-100"
              title="Credit Card Basics"
              description="Learn how credit cards work"
              onPress={() => handleReadMore('Credit Card Basics')}
            />
            <GuideCard
              icon={<TrendingUp size={40} color="#16a34a" />}
              iconBgColor="bg-green-100"
              title="Building Credit"
              description="Improving your credit score"
              onPress={() => handleReadMore('Building Credit')}
            />
            <GuideCard
              icon={<Shield size={40} color="#7c3aed" />}
              iconBgColor="bg-purple-100"
              title="Security Tips"
              description="Keep your information safe"
              onPress={() => handleReadMore('Security Tips')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal for expanded content */}
      <Modal isOpen={isModalVisible} onClose={closeModal}>
        <ModalBackdrop />
        <ModalContent className="max-w-[90%] max-h-[80%] rounded-xl">
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
            <TextButton
              label="Close"
              onPress={closeModal}
              variant="secondary"
            // className="bg-red-600"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
}


