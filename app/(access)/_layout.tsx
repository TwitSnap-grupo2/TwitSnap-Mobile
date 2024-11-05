import { Stack } from "expo-router";
import React from "react";

export default function AccessLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "", headerShown: false }} />
      <Stack.Screen name="info" options={{ title: "" }} />
    </Stack>
  );
}
