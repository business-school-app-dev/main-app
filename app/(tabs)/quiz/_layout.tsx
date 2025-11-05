import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="quiz-modal"
        options={{
          presentation: 'fullScreenModal',
          headerShown: false,
          animation: 'ios_from_right',
        }}
      />
    </Stack>
  );
}