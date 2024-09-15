import { Slot, Stack } from 'expo-router';
import React from 'react';

// import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    // const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Feed', headerShown: false }} />
            <Stack.Screen name="search" options={{ title: 'Search', headerShown: false }} />
        </Stack>
    );
}
