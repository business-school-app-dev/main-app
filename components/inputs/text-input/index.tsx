import { View, Text } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef } from "react";

interface CustomTextInputProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
  label?: string;
  isUnsaved?: boolean;
  isInvalid?: boolean;
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  multiline?: boolean;
  variant?: "outline" | "underlined" | "rounded";
}

const CustomTextInput = forwardRef<any, CustomTextInputProps>(
  function CustomTextInput(props, ref) {
    const {
      iconName,
      isInvalid,
      helperText,
      size = "md",
      color,
      className,
      label,
      isUnsaved,
      placeholder,
      value,
      onChangeText,
      onFocus,
      onBlur,
      keyboardType = "default",
      secureTextEntry,
      multiline,
      variant = "outline",
      ...inputProps
    } = props;

    return (
      <View className={className}>
        {/* Label */}
        {label && (
          <Text className="text-typography-900 text-sm mb-1">
            {label}
            {isUnsaved && <Text className="text-blue-600"> (Unsaved)</Text>}
          </Text>
        )}

        {/* Input using GluestackUI with default styling */}
        <Input
          variant={variant}
          size={size}
          isInvalid={isInvalid}
        >
          <InputField
            ref={ref}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            // Note: multiline is not directly supported by gluestack-ui Input
            {...inputProps}
          />
        </Input>

        {/* Helper Text */}
        {helperText && (
          <Text 
            className={`text-xs mt-1 ${
              isInvalid ? "text-error-700" : "text-typography-500"
            }`}
          >
            {helperText}
          </Text>
        )}
      </View>
    );
  }
);

export default CustomTextInput;
