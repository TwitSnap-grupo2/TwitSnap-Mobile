import { Stack } from "expo-router";
import React from "react";

export default function FavLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Favoritos" }} />
    </Stack>
  );
}
