import React, { useState } from 'react';
import { ScrollView, View } from "react-native";
import PageLayout from "@/components/layouts/page-layout";
import { CreditCard, TrendingUp, Shield } from 'lucide-react-native';
import { CREDIT_CARDS_CONTENT } from '@/constants/strings';
import GuideCard from '@/components/views/guide-card';
import GuideCardModal from '@/components/views/guide-card/modal';
import { ICON_COLORS } from '@/constants/colors';

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
    <PageLayout title="Credit Cards" canGoBack>
      {/* Guide Cards Grid */}
      <View className="gap-4 flex-1">
        <GuideCard
          icon={<CreditCard size={40} color={ICON_COLORS.blue} />}
          iconBgColor="bg-blue-100"
          title="Credit Card Basics"
          description="Learn how credit cards work"
          onPress={() => handleReadMore('Credit Card Basics')}
        />
        <GuideCard
          icon={<TrendingUp size={40} color={ICON_COLORS.green} />}
          iconBgColor="bg-green-100"
          title="Building Credit"
          description="Improving your credit score"
          onPress={() => handleReadMore('Building Credit')}
        />
        <GuideCard
          icon={<Shield size={40} color={ICON_COLORS.purple} />}
          iconBgColor="bg-purple-100"
          title="Security Tips"
          description="Keep your information safe"
          onPress={() => handleReadMore('Security Tips')}
        />
      </View>
      <GuideCardModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedTitle={selectedTitle}
        selectedContent={selectedContent}
      />
    </PageLayout>
  );
}


