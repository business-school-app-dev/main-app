import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { PRIMARY } from '@/constants/colors';
import { LucideIcon } from 'lucide-react-native';

interface TextInputFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  suffix?: string;
  prefix?: string;
  icon?: LucideIcon;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  suffix,
  prefix,
  icon,
}) => {
  return (
    <VStack space="xs">
      {label ? (
        <Text size="sm" className="text-gray-900 font-medium">
          {label}
        </Text>
      ) : null}
      <Input
        variant="outline"
        size="lg"
        className="bg-white border-gray-300"
      >
        {icon && (
          <InputSlot className="pl-3">
            <InputIcon as={icon} />
          </InputSlot>
        )}
        {prefix && (
          <Text className="text-typography-500 text-base pl-3">
            {prefix}
          </Text>
        )}
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          selectionColor={PRIMARY}
          className="text-typography-900 text-base"
        />
        {suffix && (
          <Text className="text-typography-500 text-base pr-3">
            {suffix}
          </Text>
        )}
      </Input>
    </VStack>
  );
};

export default TextInputField;
