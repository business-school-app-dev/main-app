import { View, Text, TouchableOpacity } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface FeatureCardProps {
  title: string;
  icon: LucideIcon;
  onPress?: () => void;
}

export function FeatureCard({ title, icon: Icon, onPress }: FeatureCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full bg-white rounded-xl border border-gray-200 p-6 shadow-sm active:scale-95 transition-transform duration-150"
    >
      <View className="flex-col items-center space-y-3">
        <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
          <Icon className="w-6 h-6 text-[#E11932]" />
        </View>
        <Text className="font-semibold text-black text-center leading-tight">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
