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
  ModalBody,
  ModalFooter
} from '@/components/ui/modal';
import TextButton from '@/components/inputs/text-button';
import { Heading } from '@/components/ui/heading';
import PageLayout from "@/components/layouts/page-layout";
import { PiggyBank, TrendingUp, Wallet, LineChart, Building2, BarChart3, FolderOpen } from 'lucide-react-native';
import { INVESTING_ACCOUNTS_CONTENT } from '@/constants/strings';

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

export default function InvestingLiteracyScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');

  const handleReadMore = (accountType: string) => {
    const content = INVESTING_ACCOUNTS_CONTENT[accountType as keyof typeof INVESTING_ACCOUNTS_CONTENT] || 'Information not available.';
    setSelectedTitle(accountType);
    setSelectedContent(content);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <PageLayout title="Investing Accounts">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="py-6 flex-1">
          {/* Guide Cards Grid */}
          <View className="gap-4 flex-1">
            <GuideCard
              icon={<PiggyBank size={40} color="#dc2626" />}
              iconBgColor="bg-red-100"
              title="Roth IRA"
              description="Tax-free growth and withdrawals"
              onPress={() => handleReadMore('Roth IRA')}
            />
            <GuideCard
              icon={<TrendingUp size={40} color="#db2777" />}
              iconBgColor="bg-pink-100"
              title="Traditional IRA"
              description="Tax-deferred individual retirement"
              onPress={() => handleReadMore('Traditional IRA')}
            />
            <GuideCard
              icon={<Building2 size={40} color="#ea580c" />}
              iconBgColor="bg-orange-100"
              title="401(k)"
              description="Employer-sponsored retirement plan"
              onPress={() => handleReadMore('401(k)')}
            />
            <GuideCard
              icon={<BarChart3 size={40} color="#0891b2" />}
              iconBgColor="bg-cyan-100"
              title="ETFs"
              description="Low-cost diversified investing"
              onPress={() => handleReadMore('ETFs')}
            />
            <GuideCard
              icon={<FolderOpen size={40} color="#8b5cf6" />}
              iconBgColor="bg-violet-100"
              title="Mutual Funds"
              description="Professional portfolio management"
              onPress={() => handleReadMore('Mutual Funds')}
            />
            <GuideCard
              icon={<Wallet size={40} color="#1e40af" />}
              iconBgColor="bg-blue-100"
              title="Margin Account"
              description="Advanced trading with leverage"
              onPress={() => handleReadMore('Margin Account')}
            />
            <GuideCard
              icon={<LineChart size={40} color="#059669" />}
              iconBgColor="bg-emerald-100"
              title="Investment Strategies"
              description="Build wealth over time"
              onPress={() => handleReadMore('Investment Strategies')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal for expanded content */}
      <Modal isOpen={isModalVisible} onClose={closeModal}>
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


