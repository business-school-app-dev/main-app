import React, { useState } from 'react';
import { ScrollView, View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from 'expo-router';
import { ChevronLeftIcon, CloseIcon, Icon } from '@/components/ui/icon';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@/components/ui/modal';
import TextButton from '@/components/inputs/text-button';
import { Heading } from '@/components/ui/heading';
import PageLayout from "@/components/layouts/page-layout";
import { CreditCard, TrendingUp, Shield } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { CREDIT_CARDS_CONTENT } from '@/constants/strings';

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

export default function CreditCardsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');

  const handleReadMore = (cardType: string) => {
    const content = CREDIT_CARDS_CONTENT[cardType as keyof typeof CREDIT_CARDS_CONTENT] || 'Information not available.';
    setSelectedTitle(cardType);
    setSelectedContent(content);
    setIsModalVisible(true);
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
      <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <ModalBackdrop />
        <ModalContent className="max-w-[90%] max-h-[80%] rounded-xl">
          <ModalHeader>
            <Heading size="lg">{selectedTitle}</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody showsVerticalScrollIndicator={false}>
            <Text className="text-base text-gray-700 leading-6 text-left">{selectedContent}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
}


