import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { RadioGroup } from '@/components/ui/radio';
import SelectionCardContent from './selection-content';

// SelectionCardGroup component that wraps multiple SelectionCards with RadioGroup
interface SelectionOption {
  label: string;
  value: string | number;
}

interface SelectionCardProps {
  options: SelectionOption[];
  selectedValue: string | number | null;
  onSelect: (value: string | number) => void;
  disabled?: boolean;
  showResult?: boolean;
  correctAnswer?: string | number;
  spacing?: 'sm' | 'md' | 'lg';
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  options,
  selectedValue,
  onSelect,
  disabled = false,
  showResult = false,
  correctAnswer,
  spacing = 'md',
}) => {
  return (
    <RadioGroup
      value={selectedValue?.toString() ?? ""}
      onChange={(value) => {
        const option = options.find(opt => opt.value.toString() === value);
        if (option) onSelect(option.value);
      }}
    >
      <VStack space={spacing}>
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const isCorrectAnswer = showResult && correctAnswer !== undefined && option.value === correctAnswer;
          const isWrongAnswer = showResult && isSelected && correctAnswer !== undefined && option.value !== correctAnswer;

          return (
            <SelectionCardContent
              key={index}
              label={option.label}
              value={option.value.toString()}
              isSelected={isSelected}
              onPress={() => onSelect(option.value)}
              disabled={disabled}
              showResult={showResult}
              isCorrectAnswer={isCorrectAnswer}
              isWrongAnswer={isWrongAnswer}
            />
          );
        })}
      </VStack>
    </RadioGroup>
  );
};

export default SelectionCardContent;
