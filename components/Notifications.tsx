import { Text, View } from "react-native";
import { Notification as NotificationType } from "@/types/notifications";
import Notification from "@/components/Notification";
import { Divider } from "react-native-paper";

export default function Notifications({
  notifications,
}: {
  notifications: NotificationType[];
}) {
  return notifications.map((n) => {
    return (
      <View key={n._id}>
        <Notification notification={n}></Notification>
        {n._id == notifications[notifications.length - 1]._id ? null : (
          <Divider></Divider>
        )}
      </View>
    );
  });
}
