import IconButton from "@/components/inputs/icon-button";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { router } from "expo-router";
import { View } from "react-native";

export default function QuizNavbar(props: { title?: string }) {
  return (
    <HStack className="w-full justify-end items-center relative">
      {props.title && (
        <View className="absolute inset-0 justify-center items-center" pointerEvents="none">
          <Text className="text-2xl text-black font-bold">{props.title}</Text>
        </View>
      )}
      <IconButton
        iconName="close"
        variant="transparent"
        onPress={router.back}
        className="aspect-square"
        color="black"
      />
    </HStack>
  );
}