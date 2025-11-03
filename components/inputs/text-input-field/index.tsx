import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';

interface TextInputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'decimal-pad';
    suffix?: string;
    prefix?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    suffix,
    prefix,
}) => {
    return (
        <VStack space="xs" className="mb-4">
            <Text size="sm" className="text-gray-900 font-medium mb-1">
                {label}
            </Text>
            <Input
                variant="outline"
                size="lg"
                className="bg-white border-gray-300"
            >
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
