import { View } from "react-native";
import { Calendar, Clock } from "lucide-react-native";
import { ActionCard } from "./ActionCard";

export function MeetingSection() {
  return (
    <View className="w-full px-6 py-6">
      <View className="space-y-4">
        <ActionCard
          title="Schedule a Meeting with a Financial Advisor"
          icon={Calendar}
          onPress={() => console.log("Schedule Meeting pressed")}
        />
        <ActionCard
          title="Visit Office Hours"
          subtitle="Stamp Student Union, Room 2201 • Mon-Fri 9AM-5PM"
          icon={Clock}
          onPress={() => console.log("Office Hours pressed")}
        />
      </View>
    </View>
  );
}
