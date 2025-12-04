import TabBar from "@/components/navigation/tabbar";
import { Tabs, useRouter } from "expo-router";
import React from "react";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ headerShown: false, lazy: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="simulation" options={{ title: "Simulation" }} />
    </Tabs>
  );
}