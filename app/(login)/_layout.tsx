import { Slot, Stack } from "expo-router";
import React from "react";

// import { useColorScheme } from '@/hooks/useColorScheme';

export default function LogLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="signin" options={{ title: "" }} />
      <Stack.Screen name="signup" options={{ title: "" }} />
      <Stack.Screen name="resetPassword" options={{ title: "" }} />
    </Stack>
  );
}
