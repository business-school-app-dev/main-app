import { Tabs, useRouter } from "expo-router";
import TabBar from "@/components/navigation/tabbar";
import React, { useContext, useEffect } from "react";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ headerShown: false, lazy: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="quiz-leaderboard" options={{ title: "Leaderboard" }} />
      <Tabs.Screen name="ui-demo" options={{ title: "UI Demo" }} />
    </Tabs>
  );
}
