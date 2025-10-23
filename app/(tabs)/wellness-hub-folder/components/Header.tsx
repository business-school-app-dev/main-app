import { Menu } from "lucide-react-native";
import { View, Text, Image, TouchableOpacity } from "react-native";

export function Header() {
  return (
    <View className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <View className="flex-row items-center justify-between">
        {/* Left: UMD Logo */}
        <View className="w-10 h-10">
          <Image
            source={require("../../../../assets/images/umd-logo.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        {/* Center: Title */}
        <Text className="text-lg font-semibold text-black flex-1 text-center">
          Financial Wellness Hub
        </Text>

        {/* Right: Menu and Profile */}
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="p-2">
            <Menu className="w-6 h-6 text-black" />
          </TouchableOpacity>
          <View className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              source={require("../../../../assets/images/profile-picture.jpg")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </View>
  );
}