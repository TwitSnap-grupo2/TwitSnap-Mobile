import { Slot, Stack } from "expo-router";
import React from "react";

// import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: "" }} />
      <Stack.Screen name="editprofile" options={{ title: "" }} />
    </Stack>
  );
}
