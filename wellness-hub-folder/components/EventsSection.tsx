import { View, Text, ScrollView } from "react-native";
import { EventCard } from "./EventCard";

export function EventsSection() {
  const events = [
    {
      title: "Financial Planning Workshop",
      date: "Nov 15",
      detail: "Learn budgeting basics and investment strategies"
    },
    {
      title: "Career & Finance Fair",
      date: "Nov 22",
      detail: "Meet employers and financial advisors"
    },
    {
      title: "Student Loan Information Session",
      date: "Dec 1",
      detail: "Understanding repayment options and forgiveness programs"
    },
    {
      title: "Tax Preparation Workshop",
      date: "Dec 8",
      detail: "Free tax prep assistance for students"
    }
  ];

  return (
    <View className="w-full py-6">
      <View className="px-6 mb-4">
        <Text className="text-xl font-semibold text-black">
          Upcoming Campus Events
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 pb-2"
      >
        <View className="flex-row space-x-4">
          {events.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              date={event.date}
              detail={event.detail}
              onPress={() => console.log(`${event.title} pressed`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
