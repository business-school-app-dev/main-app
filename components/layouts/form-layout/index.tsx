import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import PageLayout from '@/components/layouts/page-layout';
import TextButton from '@/components/inputs/text-button';
import FormSelect from '@/components/inputs/form-select';
import HelpButton from '@/components/inputs/help-button';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';

interface FormField {
  id: string;
  label: string;
  placeholder?: string;
  options: Array<{ label: string; value: string | number }> | string[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  isScrollable?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  customRender?: () => React.ReactNode;
}

interface FormLayoutProps {
  title: string;
  heading?: string;
  fields: FormField[];
  submitButton: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  };
  helpTitle?: string;
  helpContent?: string;
  canGoBack?: boolean;
}

export default function FormLayout({
  title,
  heading,
  fields,
  submitButton,
  helpTitle,
  helpContent,
  canGoBack,
}: FormLayoutProps) {
  const { height } = useWindowDimensions();
  const isLargePhone = height >= 900; // Threshold for large phones

  const rightViewContent = (helpTitle && helpContent) ? (
    <HelpButton
      title={helpTitle}
      content={helpContent}
      variant="link"
      color="white"
    />
  ) : undefined;

  return (
    <PageLayout
      title={title}
      rightView={rightViewContent}
      scrollable={!isLargePhone}
      canGoBack={canGoBack}
    >
      <View className="flex-1">
        {heading && <Heading size="md" className="mb-6">{heading}</Heading>}

        {/* Form Fields */}
        <View className="flex-1">
          <VStack space="xs">
            {fields.map((field) => (
              <View key={field.id} className={heading ? "" : "mb-6"}>
                {!heading && field.label && (
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    {field.label}
                  </Text>
                )}
                {field.customRender ? (
                  field.customRender()
                ) : field.isLoading ? (
                  <View className="items-center justify-center py-4">
                    <Text className="text-gray-500">{field.loadingText || 'Loading...'}</Text>
                  </View>
                ) : (
                  <FormSelect
                    label={heading ? field.label : ""}
                    placeholder={"Select option"}
                    options={
                      Array.isArray(field.options) && field.options.length > 0 && typeof field.options[0] === 'object'
                        ? (field.options as Array<{ label: string; value: string | number }>).map(opt => opt.label)
                        : field.options as string[]
                    }
                    value={field.value}
                    onValueChange={field.onValueChange}
                    isScrollable={field.isScrollable}
                  />
                )}
              </View>
            ))}
          </VStack>
        </View>

        {/* Submit Button */}
        <View className="mt-10 pb-4">
          <TextButton
            label={submitButton.label}
            variant="secondary"
            size="lg"
            onPress={submitButton.onPress}
            disabled={submitButton.disabled}
          />
        </View>
      </View>
    </PageLayout>
  );
}
