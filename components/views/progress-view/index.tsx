import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

interface ProgressViewProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  showPercentage?: boolean;
  className?: string;
  leftElement?: React.ReactNode;
}

const ProgressView: React.FC<ProgressViewProps> = ({
  currentStep,
  totalSteps,
  progress,
  className = '',
}) => {
  return (
    <View className={className}>
      <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
};

export default ProgressView;
