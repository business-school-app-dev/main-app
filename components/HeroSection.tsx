import { ImageBackground, View, Text } from "react-native";

export function HeroSection() {
  return (
    <ImageBackground 
      source={require("../assets/images/smith-school.jpg")}
      className="w-full px-6 py-16"
      resizeMode="cover"
    >
      {/* Content */}
      <View className="text-center space-y-4">
        <Text className="text-3xl font-semibold text-white">
          Finance at Your Fingertips
        </Text>
        <Text className="text-xl text-white">
          Welcome Terp!
        </Text>
      </View>
    </ImageBackground>
  );
}