import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: "" }} />
    </Stack>
  );
}