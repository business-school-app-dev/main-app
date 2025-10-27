import React, { ReactNode } from "react";
import { View, Text, Image, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import IconButton from "@/components/inputs/icon-button";
import { StatusBar } from "expo-status-bar";
import { Avatar, AvatarFallbackText, AvatarImage} from '@/components/ui/avatar';

export interface NavbarProps {
  title: string;
  backButtonHidden?: boolean;
  rightView?: ReactNode;
  leftView?: ReactNode;
  profileButtonHidden?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  backButtonHidden: hideBackButton = false,
  profileButtonHidden: hideProfile = false,
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

  const handleProfileClick = async () => {
      const supported = await Linking.canOpenURL("https://www.google.com");
      if (supported) {
        await Linking.openURL("https://www.google.com");
      } else {
        console.log(`Don't know how to open this URL: "https://www.google.com"`);
      }
  };

  const profileButton = (
    <Pressable onPress={handleProfileClick}>
      <Avatar size="sm">
        <AvatarFallbackText>you</AvatarFallbackText>
        <AvatarImage
          source={{
            uri: "https://plus.unsplash.com/premium_photo-1756131939171-728118fbad4a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
          }}
        />
      </Avatar>
    </Pressable>
  );

  const EmptyView = () => <View className="w-12 h-12" />;

  return (
    <View className="bg-primary pt-safe pb-2.5 px-5 flex-row justify-between items-center border-b border-secondary-300">
      <StatusBar style="light" />

      {hideBackButton ? (
        EmptyView()
      ) : (
        <View className="w-12 h-12">{backButton}</View>
      )}

      <View className="flex-row items-center">
        <Text className="text-secondary text-2xl font-bold">
          {title}
        </Text>
      </View>

      {/* <View className="w-12 h-12">{rightView || EmptyView()}</View> */}

      {hideProfile ? (
        rightView || EmptyView()
      ) : (
        <View className="w-12 h-12">{profileButton}</View>
      )}

    </View>
  );
};

export default Navbar;
