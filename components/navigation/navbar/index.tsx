import React, { ReactNode, useState } from "react";
import { View, Text, Image, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import IconButton from "@/components/inputs/icon-button";
import { Icon } from "@/components/ui/icon";
import { StatusBar } from "expo-status-bar";
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { WebView } from "react-native-webview";
import { Modal, ModalContent, ModalBackdrop } from '@/components/ui/modal';
import { X } from "lucide-react-native";

export interface NavbarProps {
  title: string;
  canGoBack?: boolean;
  rightView?: ReactNode;
  leftView?: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  canGoBack = false,
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

  const [modalVisible, setModalVisible] = useState(false);
  const handleProfileClick = () => {
    setModalVisible(true);
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
    <View className="bg-primary pt-safe pb-2.5 px-5 flex-row justify-between items-center border-b border-primary-300">
      <StatusBar style="light" />

      {canGoBack ? (
        <View className="w-12 h-12">{leftView ? leftView : backButton}</View>
      ) : (
        EmptyView()
      )}

      <View className="flex-row items-center">
        <Text className="text-white text-2xl font-bold">
          {title}
        </Text>
      </View>

      <View className="w-12 h-12">{rightView || EmptyView()}</View>

      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ModalBackdrop />
        <ModalContent
          style={{ height: "100%", width: "100%", padding: 0 }}
        >
          <View
            style={{ flex: 1, backgroundColor: "white" }}
            className="pt-safe pb-safe px-2"
          >
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                alignItems: "center",
              }}
              className="pb-2"
            >

              <Pressable
                onPress={() => setModalVisible(false)}
                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
              >
                <Icon as={X} size="lg" color="black" />
              </Pressable>
            </View>
            <WebView
              source={{
                uri: "https://terpengage.umd.edu/community/s/change-major",
              }}
              style={{ flex: 1 }}
            />
          </View>
        </ModalContent>
      </Modal>
    </View>

  );
};

export default Navbar;
