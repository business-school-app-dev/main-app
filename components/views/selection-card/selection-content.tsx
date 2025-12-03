import React from 'react';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Radio, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';

interface SelectionCardContentProps {
  label: string;
  value: string;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
  showResult?: boolean;
  isCorrectAnswer?: boolean;
  isWrongAnswer?: boolean;
}

export default function SelectionCardContent({
  label,
  value,
  isSelected,
  onPress,
  disabled = false,
  showResult = false,
  isCorrectAnswer = false,
  isWrongAnswer = false,
}: SelectionCardContentProps) {
  // Determine border and background colors
  let borderColor = 'border-gray-200';
  let bgColor = 'bg-white';
  let textColor = 'text-gray-900';

  if (showResult) {
    // Quiz mode with result showing
    if (isCorrectAnswer) {
      borderColor = 'border-green-500';
      bgColor = 'bg-green-50';
      textColor = 'text-green-900';
    } else if (isWrongAnswer) {
      borderColor = 'border-red-500';
      bgColor = 'bg-red-50';
      textColor = 'text-red-900';
    }
  } else if (isSelected) {
    // Selected state (both simulation and quiz)
    borderColor = 'border-primary-500';
    bgColor = 'bg-red-50';
    textColor = 'text-primary-500';
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`border-2 rounded-xl p-4 ${borderColor} ${bgColor}`}
    >
      <Radio value={value}>
        <HStack className="items-center justify-between w-full">
          <HStack className="items-center flex-1" space="lg">
            <RadioIndicator className={`border-2 ${isSelected || isCorrectAnswer ? 'border-primary-500' : ''}`}>
              <RadioIcon
                as={CircleIcon}
                className={isSelected || isCorrectAnswer ? 'text-primary-500' : ''}
              />
            </RadioIndicator>
            <RadioLabel className="flex-1">
              <Text className={`text-base font-medium ${textColor} flex-shrink`} numberOfLines={0}>
                {label}
              </Text>
            </RadioLabel>
          </HStack>
        </HStack>
      </Radio>
    </Pressable>
  );
};