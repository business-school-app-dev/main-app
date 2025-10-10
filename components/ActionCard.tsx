import { View, Text, TouchableOpacity } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onPress?: () => void;
}

export function ActionCard({ title, subtitle, icon: Icon, onPress }: ActionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm active:scale-95 transition-transform duration-150"
    >
      <View className="flex-row items-center space-x-4">
        <View className="w-10 h-10 bg-[#E11932] rounded-full items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-black">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-gray-600 mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
