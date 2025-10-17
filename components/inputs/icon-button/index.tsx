import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon, LinkIcon } from "@/components/ui/icon";

interface IconButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  variant?: "primary" | "secondary" | "outline" | "link" | "transparent";
  label?: string;
  className?: string;
}

function IconButton({
  iconName,
  onPress,
  size = 24,
  color,
  variant = "primary",
  label,
  className,
}: IconButtonProps) {
  // Default colors based on theme
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary border border-primary";
      case "secondary":
        return "bg-secondary border border-secondary";
      case "outline":
        return "bg-transparent border border-primary";
      case "link":
        return "bg-transparent";
      case "transparent":
        return "bg-transparent";
      default:
        return "bg-primary border border-primary";
    }
  };

  const getTextColorClass = () => {
    switch (variant) {
      case "primary":
      case "secondary":
        return "text-background";
      case "outline":
        return "text-primary";
      case "link":
        return "text-primary";
      case "transparent":
        return "text-gray-400";
      default:
        return "text-background";
    }
  };

  const getIconColor = () => {
    if (color) return color;

    switch (variant) {
      case "primary":
      case "secondary":
        return "#FFFFFF"; // white for primary/secondary backgrounds
      case "outline":
        return "#DC2626"; // red primary color
      case "link":
        return "#DC2626"; // red primary color
      case "transparent":
        return "#9ca3af"; // light gray for unfocused state
      default:
        return "#FFFFFF"; // white default
    }
  };

  return (
    <Button
      onPress={onPress}
      variant="link"
      className={`flex-row h-fit items-center justify-center p-2 rounded-lg ${getVariantClasses()} ${className}`}
    >
      <View className="flex-col w-fit items-center">
        <Ionicons
          name={iconName}
          size={size}
          color={getIconColor()}
        />
        {label && (
          <Text className={`text-xs font-semibold ${getTextColorClass()}`}>
            {label}
          </Text>
        )}
      </View>
    </Button>
  );
}

export default IconButton;