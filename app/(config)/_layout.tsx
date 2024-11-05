import { Stack } from "expo-router";
import React from "react";

export default function ConfigLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "" }} />
    </Stack>
  );
}
