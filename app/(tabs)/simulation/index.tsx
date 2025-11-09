import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import PageLayout from '@/components/layouts/page-layout';

export default function SimulationScreen() {
  return (
    <PageLayout title="Simulation" backButtonHidden profileButtonHidden>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-900">
          Hello World!
        </Text>
      </View>
    </PageLayout>
  );
}
