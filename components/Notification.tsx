import { Text } from "react-native";
import { Notification as NotificationType } from "@/types/notifications";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

export default function Notification({
  notification,
}: {
  notification: NotificationType;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        //@ts-ignore
        router.navigate(notification.url);
      }}
      className="flex gap-2 p-5"
    >
      <Text className="text-white text-lg font-bold">{notification.title}</Text>
      <Text className="text-white text-base">{notification.body}</Text>
    </TouchableOpacity>
  );
}
