import { Button, ButtonText } from "@/components/ui/button";
import React, { ReactNode } from "react";
import { TouchableOpacity, Text } from "react-native";

interface TextButtonProps {
  label?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "link" | "transparent";
  size?: "sm" | "md" | "lg" | "xl" | undefined;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  children?: ReactNode;
  rounded?: "sm" | "md" | "lg" | "full" | undefined;
  center?: boolean;
}

function TextButton({
  label,
  onPress,
  variant,
  size,
  disabled = false,
  className,
  textClassName,
  children,
  rounded = "lg",
  center = true,
}: TextButtonProps) {
  // Get styling based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-secondary border border-secondary";
      case "outline":
        return "bg-transparent border border-secondary";
      case "link":
        return "bg-transparent";
      case "transparent":
        return "bg-transparent";
      default:
        return "bg-primary";
    }
  };

  // Get text color based on variant
  const getTextColorClass = () => {
    switch (variant) {
      case "secondary":
        return "text-black";
      case "outline":
        return "text-secondary";
      case "link":
        return "text-primary";
      case "transparent":
        return "text-secondary";
      default:
        return "text-background-0";
    }
  };

  // Get padding based on size
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-1 px-3";
      case "lg":
        return "py-5 px-11";
      case "xl":
        return "py-7 px-13";
      default:
        return "py-3 px-9";
    }
  };

  // Get rounded classes based on the rounded prop
  const getRoundedClasses = () => {
    switch (rounded) {
      case "sm":
        return "rounded";
      case "md":
        return "rounded-md";
      default:
        return "rounded-full";
    }
  };

  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      className={`h-fit ${center ? "items-center justify-center" : ""} ${getRoundedClasses()} ${getVariantClasses()} ${getSizeClasses()} ${disabled ? "opacity-50" : ""
        } ${className || ""}`}
    >
      {children || (
        <ButtonText
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : size === "xl" ? "xl" : "md"}
          className={`font-semibold text-center ${getTextColorClass()} ${textClassName || ""}`}
        >
          {label}
        </ButtonText>
      )}
    </Button>
  );
}

export default TextButton;
