import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, Calculator, BookOpen, User } from "lucide-react-native";

export function Footer() {
  const tabs = [
    { icon: Home, label: "Home", active: true },
    { icon: Calculator, label: "Tools", active: false },
    { icon: BookOpen, label: "Learn", active: false },
    { icon: User, label: "Profile", active: false },
  ];

  return (
    <SafeAreaView className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <View className="flex-row items-center justify-around px-2 py-2">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            className="flex flex-col items-center justify-center py-2 px-4 flex-1"
          >
            <View className={`p-1 ${tab.active ? "text-[#E11932]" : "text-gray-500"}`}>
              <tab.icon className="w-6 h-6" />
            </View>
            <Text
              className={`text-xs mt-1 ${
                tab.active ? "text-[#E11932] font-medium" : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
