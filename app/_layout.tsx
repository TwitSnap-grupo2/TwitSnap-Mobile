import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserProvider } from "@/context/context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import messaging, {
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import { Alert } from "react-native";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    // Handle notification clicks
    messaging().onNotificationOpenedApp((remoteMessage) => {
      const url = remoteMessage?.data?.url;
      console.log("URL: ", url);
      if (url) {
        router.push(url); // Navigates to the specified screen
      }
    });

    // Handle background messages (if the app is launched via notification)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          const url = remoteMessage.data?.url;
          console.log("URL: ", url);
          if (url) {
            router.push(url);
          }
        }
      });

    // Foreground message handler (show alert or any UI change as needed)
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title,
          remoteMessage.notification.body
        );
      }
    });

    if (loaded) {
      SplashScreen.hideAsync();
    }

    return unsubscribe;
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <UserProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(access)" options={{ headerShown: false }} />
            <Stack.Screen name="(login)" options={{ headerShown: false }} />
            <Stack.Screen name="(feed)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            <Stack.Screen name="(twit)" options={{ headerShown: false }} />
            <Stack.Screen name="(config)" options={{ headerShown: false }} />
            <Stack.Screen name="(messages)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
