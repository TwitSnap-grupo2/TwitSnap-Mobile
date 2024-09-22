import { Slot, Stack } from 'expo-router';
import React from 'react';

// import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    // const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name="signin" options={{ title: 'Sign in', headerShown: false }} />
            <Stack.Screen name="signup" options={{ title: 'Sign up', headerShown: false }} />

        </Stack>
    );
}
