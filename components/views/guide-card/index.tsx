import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import TextButton from '@/components/inputs/text-button';

export interface GuideCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  onPress: () => void;
}

export default function GuideCard({ icon, iconBgColor, title, description, onPress }: GuideCardProps) {
  return (
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
        />
      </View>
    </View>
  );
}
