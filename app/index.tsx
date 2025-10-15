import "@/global.css";
import { router } from "expo-router";
import { View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";

export default function Index() {
  const handleNavigateToCreditCards = () => {
    router.push("/credit-cards");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center px-6">
        <VStack space="lg" className="items-center">
          <Heading size="2xl" className="text-gray-900 text-center">
            Welcome to UMD Smith Business App
          </Heading>
          <Text size="lg" className="text-gray-600 text-center">
            Explore financial resources and tools to help you succeed
          </Text>

          <Button
            onPress={handleNavigateToCreditCards}
            className="bg-red-600 rounded-full h-fit px-8 py-4 mt-8"
            size="lg"
          >
            <ButtonText className="text-white font-semibold">
              Credit Cards Guide
            </ButtonText>
          </Button>
        </VStack>
      </View>
    </SafeAreaView>
  );
}