import { ImageBackground, View, Text } from "react-native";

export function HeroSection() {
  return (
    <ImageBackground 
      source={require("../../../../assets/images/smith-school.jpg")}
      className="w-full px-6 py-16"
      resizeMode="cover"
    >
      {/* Content */}
      <View className="items-center space-y-4">
        <Text className="text-3xl font-semibold text-white text-center">
          Finance at Your Fingertips
        </Text>
        <Text className="text-xl taext-white text-center">
          Welcome Terp!
        </Text>
      </View>
    </ImageBackground>
  );
}
