import { Text } from "react-native";
import { Notification as NotificationType } from "@/types/notifications";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { fetch_to } from "@/utils/fetch";
import { useContext } from "react";
import { NotificationContext } from "@/context/NotificationContext";

export default function Notification({
  notification,
}: {
  notification: NotificationType;
}) {
  const router = useRouter();
  const notificationContext = useContext(NotificationContext);
  if (!notificationContext) {
    throw new Error("NotificationContext is null");
  }
  const { unseenNotifications, saveUnseenNotifications } = notificationContext;
  return (
    <TouchableOpacity
      onPress={() => {
        fetch_to(
          `https://api-gateway-ccbe.onrender.com/notifications/${notification._id}`,
          "PATCH",
          {
            seen: true,
          }
        ).then((res) => {
          console.log("RES STATUS: ", res);
          res.json().then((r) => {
            console.log("PATCH: ", r);
          });
        });
        if (notification.seen == false) {
          saveUnseenNotifications(unseenNotifications - 1);
        }
        //@ts-ignore
        router.navigate(notification.url);
      }}
      className="flex gap-2 p-5"
    >
      <Text className="text-white text-lg font-bold">{notification.title}</Text>
      <Text className="text-gray-300 text-base">{notification.body}</Text>
    </TouchableOpacity>
  );
}
