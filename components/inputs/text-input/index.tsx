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
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad" | "decimal-pad";
  secureTextEntry?: boolean;
  multiline?: boolean;
  variant?: "outline" | "underlined" | "rounded";
  prefix?: string;
  suffix?: string;
}

const CustomTextInput = forwardRef<any, CustomTextInputProps>(
  function CustomTextInput(props, ref) {
    const {
      iconName,
      isInvalid,
      helperText,
      size = "lg",
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
      prefix,
      suffix,
      ...inputProps
    } = props;

    return (
      <View className={className}>
        {/* Label */}
        {label && (
          <Text className="text-typography-900 font-medium text-base mb-2">
            {label}
            {isUnsaved && <Text className="text-blue-600"> (Unsaved)</Text>}
          </Text>
        )}

        {/* Input using GluestackUI with default styling */}
        <Input
          variant={variant}
          size={size}
          isInvalid={isInvalid}
          className="bg-background-50 border-0"
        >
          {iconName && (
            <View className="pl-3 justify-center">
              <Ionicons 
                name={iconName} 
                size={20} 
                color={color || "#71717a"} 
              />
            </View>
          )}
          {prefix && (
            <Text className="text-typography-500 text-md pl-3">
              {prefix}
            </Text>
          )}
          <InputField
            ref={ref}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            selectionColor="rgb(225, 25, 50)"
            className="text-typography-500 text-md"
            {...inputProps}
          />
          {suffix && (
            <Text className="text-typography-500 text-md pr-3">
              {suffix}
            </Text>
          )}
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
