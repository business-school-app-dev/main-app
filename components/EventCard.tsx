import { View, Text, TouchableOpacity } from "react-native";

interface EventCardProps {
  title: string;
  date: string;
  detail: string;
  onPress?: () => void;
}

export function EventCard({ title, date, detail, onPress }: EventCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 p-4 shadow-sm active:scale-95 transition-transform duration-150"
    >
      <View className="text-left space-y-2">
        <Text className="text-xs font-medium text-[#E11932] uppercase tracking-wide">
          {date}
        </Text>
        <Text className="font-semibold text-black leading-tight">
          {title}
        </Text>
        <Text className="text-sm text-gray-600">
          {detail}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
