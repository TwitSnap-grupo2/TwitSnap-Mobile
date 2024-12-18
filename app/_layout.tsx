import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Href, router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserProvider } from "@/context/context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider, Provider } from "react-native-paper";
import messaging, {
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import { UnseenNotificationsProvider } from "@/context/NotificationContext";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    // Handle notification clicks
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      const url = remoteMessage?.data?.url;
      if (url) {
        router.push(url as Href<string>);
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          const url = remoteMessage.data?.url;
          if (url) {
            router.push(url as Href<string>);
          }
        }
      });

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <Provider>
        <UserProvider>
          <UnseenNotificationsProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack>
                <Stack.Screen
                  name="(access)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="(login)" options={{ headerShown: false }} />
                <Stack.Screen name="(feed)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                  name="(profile)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="twit" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(config)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(messages)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(search)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="(favs)" options={{ headerShown: false }} />
              </Stack>
            </ThemeProvider>
          </UnseenNotificationsProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
