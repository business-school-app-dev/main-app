import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"/>
      <Stack.Screen
        name="completed"
        options={{
          presentation: 'card',
          animation: "slide_from_right"
        }}
      />
    </Stack>
  );
}