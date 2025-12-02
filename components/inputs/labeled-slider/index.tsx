import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@/components/ui/slider';
import { View } from 'react-native';

interface LabeledSliderProps {
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
  className?: string;
  formatValue?: (value: number) => string;
}

export default function LabeledSlider({
  label,
  value,
  minValue,
  maxValue,
  step,
  onChange,
  suffix = '%',
  className = '',
  formatValue,
}: LabeledSliderProps) {
  const displayValue = formatValue ? formatValue(value) : `${value}${suffix}`;

  return (
    <VStack space="xs" className={className}>
      <HStack className="justify-between items-center mb-2">
        <Text size="sm" className="text-gray-900 font-medium">
          {label}
        </Text>
        <Text size="md" className="text-primary-500 font-semibold">
          {displayValue}
        </Text>
      </HStack>
      <VStack space="sm">
        <View className="px-3">
          <Slider
            value={value}
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            onChange={onChange}
            size="lg"
          >
            <SliderTrack>
              <SliderFilledTrack className="bg-primary-500" />
            </SliderTrack>
            <SliderThumb className="bg-primary-500 shadow-transparent" />
          </Slider>
        </View>
        <HStack className="justify-between items-center mt-1">
          <Text size="xs" className="text-gray-500">
            {formatValue ? formatValue(minValue) : `${minValue}${suffix}`}
          </Text>
          <Text size="xs" className="text-gray-500">
            {formatValue ? formatValue(maxValue) : `${maxValue}${suffix}`}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
