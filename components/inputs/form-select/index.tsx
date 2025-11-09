import { ChevronDownIcon } from '@/components/ui/icon';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { ScrollView } from 'react-native';

interface FormSelectProps {
  label: string;
  placeholder?: string;
  options: string[];
  value?: string;
  onValueChange?: (value: string) => void;
  isScrollable?: boolean;
  maxHeight?: number;
  size?: 'sm' | 'md' | 'lg'; // optional, for more compact sizing
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  placeholder = "Select option",
  options,
  value,
  onValueChange,
  isScrollable = false,
  maxHeight = 300,
  size = 'md', // default to medium size
}) => {
  // Map size prop to padding/height values for SelectTrigger
  const triggerHeight = size === 'sm' ? 36 : size === 'md' ? 42 : 48;

  return (
    <VStack space="xs" className="mb-4">
      <Text size="sm" className="text-gray-900 font-medium mb-1">
        {label}
      </Text>
      <Select onValueChange={onValueChange} selectedValue={value}>
        <SelectTrigger
          variant="outline"
          className="bg-white border-gray-300"
          style={{ height: triggerHeight }}
        >
          <SelectInput placeholder={placeholder} className="flex-1" />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>

        <SelectPortal>
          <SelectBackdrop />
          <SelectContent className="w-full">
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {isScrollable ? (
              <ScrollView
                style={{ maxHeight, width: '100%' }}
                showsVerticalScrollIndicator={false}
              >
                {options.map((option) => (
                  <SelectItem key={option} label={option} value={option} />
                ))}
              </ScrollView>
            ) : (
              <>
                {options.map((option) => (
                  <SelectItem key={option} label={option} value={option} />
                ))}
              </>
            )}
          </SelectContent>
        </SelectPortal>
      </Select>
    </VStack>
  );
};

export default FormSelect;
