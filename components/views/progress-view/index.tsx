import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
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
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View className={className}>
      <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <Animated.View
          className="h-full bg-primary-500 rounded-full"
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    </View>
  );
};

export default ProgressView;
