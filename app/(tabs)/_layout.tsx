import TabBar from "@/components/navigation/tabbar";
import { Tabs, useRouter } from "expo-router";
import React from "react";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ headerShown: false, lazy: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="credit-cards" options={{ title: "Credit Cards" }} />
      <Tabs.Screen name="ui-demo" options={{ title: "UI Demo" }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
      <Tabs.Screen name="student-loans" options={{ title: "Loans" }} />
      <Tabs.Screen name="course-recommender" options={{ title: "Courses" }} />
    </Tabs>
  );
}