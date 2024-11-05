import { Stack } from "expo-router";
import React from "react";

export default function TwitLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: "" }} />
      <Stack.Screen name="createTwit" options={{ title: "" }} />
    </Stack>
  );
}
