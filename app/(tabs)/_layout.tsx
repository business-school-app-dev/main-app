import TabBar from "@/components/navigation/tabbar";
import { Tabs, useRouter } from "expo-router";
import React from "react";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ headerShown: false, lazy: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="quiz" options={{ title: "Quiz" }} />
      <Tabs.Screen name="wellness-hub" options={{ title: "Wellness" }} />
      <Tabs.Screen name="student-loans" options={{ title: "Loans" }} />
    </Tabs>
  );
}