import { Tabs, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NotificationContext } from "@/context/NotificationContext";
import messaging from "@react-native-firebase/messaging";

export default function FeedLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const notificationContext = useContext(NotificationContext);
  if (!notificationContext) {
    throw new Error("NotificationContext is null");
  }
  const unseenNotifications = notificationContext.unseenNotifications;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search" : "search-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "notifications" : "notifications-outline"}
              color={color}
            />
          ),
          tabBarBadge:
            unseenNotifications == 0 ? undefined : unseenNotifications,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Mensajes",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "mail" : "mail-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
