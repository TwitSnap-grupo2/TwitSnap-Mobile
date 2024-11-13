import { database } from "@/utils/config";
import { formatDate } from "@/utils/time";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";

const ChatItem = ({
  username,
  avatarUri,
  roomId,
  userId,
}: {
  username: string;
  avatarUri: string;
  roomId: string;
  userId: string;
}) => {
  const router = useRouter();
  const [lastMessage, setLastMessage] = useState<
    FirebaseFirestoreTypes.DocumentData | undefined | null
  >(undefined);

  useEffect(() => {
    const docRef = doc(database, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => doc.data());
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });
    return unsub;
  }, []);

  return (
    <TouchableOpacity
      className="flex-row justify-between items-center gap-3 mb-4 pb-2 border-b border-b-neutral-200 "
      onPress={() =>
        router.navigate({
          pathname: "/(messages)/chatRoom",
          // @ts-ignore
          params: {
            id: userId,
            name: username,
          },
        })
      }
    >
      <Avatar.Image size={50} source={{ uri: avatarUri }} />

      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text className="dark:text-white font-semibold text-lg">
            {username}
          </Text>

          <Text className="dark:text-neutral-300 font-medium text-base">
            {lastMessage == undefined
              ? "Cargando..."
              : formatDate(new Date(lastMessage.createdAt.seconds * 1000))}
          </Text>
        </View>
        <Text className="dark:text-neutral-300 font-medium text-base ">
          {lastMessage == undefined ? "Cargando..." : lastMessage.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
