import React, { ReactNode } from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import IconButton from "@/components/inputs/icon-button";
import { StatusBar } from "expo-status-bar";

export interface NavbarProps {
  title: string;
  backButtonHidden?: boolean;
  rightView?: ReactNode;
  leftView?: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  backButtonHidden: hideBackButton = false,
  rightView,
  leftView,
}) => {
  const navigation = useRouter();

  // Default back button
  const backButton = (
    <IconButton
      iconName="arrow-back"
      variant="primary"
      onPress={navigation.back}
      className="my-auto"
    />
  );

  const EmptyView = () => <View className="w-12 h-12" />;

  return (
    <View className="bg-primary pt-safe pb-2.5 px-5 flex-row justify-between items-center border-b border-primary-300">
      <StatusBar style="light" />

      {hideBackButton ? (
        EmptyView()
      ) : (
        <View className="w-12 h-12">{backButton}</View>
      )}

      <View className="flex-row items-center">
        <Text className="text-white text-2xl font-bold">
          {title}
        </Text>
      </View>

      <View className="w-12 h-12">{rightView || EmptyView()}</View>
    </View>
  );
};

export default Navbar;
