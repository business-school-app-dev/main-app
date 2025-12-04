import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { Stack } from 'expo-router';
import React from 'react';

export default function App() {
  return (
    <GluestackUIProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="webview-modal"
          options={{
            presentation: "containedModal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="quiz-modal"
          options={{
            presentation: 'containedModal',
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
