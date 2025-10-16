import { View, Text } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";

interface CustomTextInputProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  label: string;
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
      ...inputProps
    } = props;

    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    // Handle focus
    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    // Handle blur
    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    // Handle text change
    const handleChangeText = (text: string) => {
      setHasValue(!!text);
      onChangeText?.(text);
    };

    // Get size classes for input
    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "h-12";
        case "md":
          return "h-14";
        case "lg":
          return "h-16";
        default:
          return "h-14";
      }
    };

    // Get label size classes
    const getLabelSizeClasses = () => {
      switch (size) {
        case "sm":
          return "text-xs";
        case "md":
          return "text-sm";
        case "lg":
          return "text-base";
        default:
          return "text-sm";
      }
    };

    // Determine border and label colors
    const borderClass = isInvalid
      ? "border-red-500"
      : isUnsaved
        ? "border-blue-600"
        : isFocused
          ? "border-blue-500"
          : "border-gray-300";

    const labelColorClass = isInvalid
      ? "text-red-500"
      : isUnsaved
        ? "text-blue-600"
        : isFocused || hasValue
          ? "text-blue-500"
          : "text-gray-500";

    // Label positioning
    const labelPositionClass = isFocused || hasValue
      ? "-top-2 left-3 px-1 bg-white"
      : "top-4 left-4 bg-transparent";

    const labelScaleClass = isFocused || hasValue ? "scale-90" : "scale-100";

    const finalLabel = isUnsaved ? `${label} (Unsaved)` : label;

    return (
      <View className={`relative ${className || ""}`}>
        {/* Main Input Container */}
        <View className="relative">
          {/* Floating Label */}
          <Text
            className={`
              absolute z-10 transition-all duration-200
              ${labelPositionClass}
              ${labelColorClass}
              ${getLabelSizeClasses()}
              ${labelScaleClass}
              font-medium
            `}
          >
            {finalLabel}
          </Text>

          {/* Input using GluestackUI */}
          <Input
            variant="outline"
            size={size}
            isInvalid={isInvalid}
            isFocused={isFocused}
            className={`
              ${getSizeClasses()}
              ${borderClass}
              bg-white
              rounded-lg
              border-2
            `}
          >
            <InputField
              ref={ref}
              placeholder={isFocused || hasValue ? placeholder : ""}
              value={value}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              multiline={multiline}
              className={`
                pt-6 pb-2 px-4
                ${multiline ? "min-h-20" : ""}
                placeholder:text-gray-400
              `}
              {...inputProps}
            />
          </Input>
        </View>

        {/* Helper Text */}
        {helperText && (
          <Text className={`
            text-xs mt-1 ml-3
            ${isInvalid ? "text-red-500" : "text-gray-500"}
          `}>
            {helperText}
          </Text>
        )}
      </View>
    );
  }
);

export default CustomTextInput;
