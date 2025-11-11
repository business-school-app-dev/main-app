import React, { useState } from 'react';
import { ScrollView, View } from "react-native";
import PageLayout from "@/components/layouts/page-layout";
import { PiggyBank, TrendingUp, Wallet, LineChart, Building2, BarChart3, FolderOpen } from 'lucide-react-native';
import { INVESTING_ACCOUNTS_CONTENT } from '@/constants/strings';
import GuideCard from '@/components/cards/guidecard';
import GuideCardModal from '@/components/cards/guidecard/modal';

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
      <GuideCardModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedTitle={selectedTitle}
        selectedContent={selectedContent}
      />
    </PageLayout>
  );
}


