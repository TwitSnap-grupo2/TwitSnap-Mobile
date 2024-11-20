import Loading from "@/components/Loading";
import { UserContext } from "@/context/context";
import { fetch_to } from "@/utils/fetch";
import { useContext, useEffect, useState } from "react";
import { Text, Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Notification } from "@/types/notifications";
import { ScrollView } from "react-native-gesture-handler";
import Notifications from "@/components/Notifications";

export default function TabTwoScreen() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }
  const user = userContext.user;
  const [notifications, setNotifications] = useState<
    undefined | Array<Notification>
  >(undefined);

  useEffect(() => {
    try {
      fetch_to(
        `https://api-gateway-ccbe.onrender.com/notifications/${user.id}`,
        "GET"
      ).then((res) => {
        if (res.status != 200) {
          throw new Error();
        }
        res.json().then((r) => {
          setNotifications(r);
        });
      });
    } catch (err) {
      console.error(err);
      return Alert.alert("Error while fetching notifications");
    }
  });

  return (
    <SafeAreaView className="">
      <ScrollView className="px-4">
        <Text className="mt-4 dark:text-white text-center text-2xl mb-2">
          Notificaciones
        </Text>
        {notifications ? (
          notifications.length == 0 ? (
            <Text className="dark:text-white mt-10 text-center text-bold text-base">
              Parece que no tenes notificaciones
            </Text>
          ) : (
            <Notifications notifications={notifications}></Notifications>
          )
        ) : (
          <View className="mt-10">
            <Loading></Loading>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
