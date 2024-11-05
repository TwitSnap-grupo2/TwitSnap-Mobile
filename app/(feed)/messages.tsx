import { UserContext } from "@/context/context";
import { router, useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Avatar, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from "@/types/User";
import { fetch_to } from "@/utils/fetch";
import UserCard from "@/components/UserCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { database } from "@/services/config";
import ChatItem from "@/components/ChatItem";
import Loading from "@/components/Loading";

interface ChatItem {
  username: string;
  userId: string;
  avatarUri: string;
  roomId: string;
}

export default function TabTwoScreen() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }
  const colorScheme = useColorScheme();
  const user = userContext.user;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [listOfUsers, setListOfUsers] = useState<Array<User>>([]);
  const [chatsList, setChatsList] = useState<Array<ChatItem>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const roomsRef = collection(database, "rooms");
    const chats = query(
      roomsRef,
      where("participants", "array-contains", user.id)
    );

    let unsub = onSnapshot(chats, (snapshot) => {
      let allMessages = snapshot.docs.map(async (doc) => {
        const { participants, roomId } = doc.data();

        const otherParticipant = participants.find(
          (participant: string) => participant != user.id
        );
        const fetchedUser = await fetchUser(otherParticipant);
        const data = {
          username: fetchedUser.name,
          userId: fetchedUser.id,
          avatarUri: `https://robohash.org/${fetchedUser.id}.png`,
          roomId: roomId,
        };
        return data;
      });
      Promise.all(allMessages).then((data) => {
        setIsLoading(false);
        return setChatsList(data);
      });

      return unsub;
    });
  }, []);

  const fetchUser = async (id: string) => {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/${id}`,
      "GET"
    );
    const data = await response.json();
    return data;
  };

  async function handleTypingStop(input: string) {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/search/?user=${input}&limit=10`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      setListOfUsers(data);
    } else {
      console.error(
        "Error al obtener los usuarios",
        response.status,
        response.text
      );
    }
  }

  const handleTextChange = (input: string) => {
    setSearchQuery(input);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      handleTypingStop(input);
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView
        className="px-4 py-2"
        // refreshControl={
        // <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <View className="flex flex-1 flex-row justify-between my-4">
          <Avatar.Image
            size={50}
            source={{ uri: user?.avatar }}
            onTouchEnd={() => {
              router.push({
                pathname: "/(profile)/[id]",
                // @ts-ignore
                params: {
                  id: user.id,
                },
              });
            }}
          />
          <View className="w-4/6">
            <Searchbar
              className="-mt-1 dark:bg-gray-800 "
              placeholderTextColor={colorScheme === "dark" ? "#aaa" : "black"}
              iconColor={colorScheme === "dark" ? "#aaa" : "black"}
              inputStyle={{ color: "#cfcccc" }}
              placeholder="Buscar"
              onChangeText={handleTextChange}
              value={searchQuery}
            />
            {listOfUsers.map((user) => (
              <View className="p-1" key={user.id}>
                <UserCard
                  user={user}
                  customHandle={(user) => {
                    router.navigate({
                      pathname: "/(messages)/chatRoom",
                      // @ts-ignore
                      params: {
                        id: user.id,
                        name: user.name,
                        // avatar: user.avatar,
                      },
                    });
                  }}
                />
              </View>
            ))}
          </View>
          <Avatar.Icon
            size={50}
            icon="dots-vertical"
            className="bg-black -mr-2 -ml-3"
            onTouchEnd={() => {
              router.push("../(config)");
            }}
          />
        </View>

        {isLoading && (
          <View className="mt-7">
            <Loading />
          </View>
        )}
        {chatsList.length === 0 && !isLoading && (
          <Text className="text-center text-gray-500 text-lg mt-10">
            No hay chats para mostrar
          </Text>
        )}
        {chatsList.length > 0 &&
          chatsList.map((chat) => {
            return (
              <ChatItem
                key={chat.roomId}
                userId={chat.userId}
                username={chat.username}
                avatarUri={chat.avatarUri}
                roomId={chat.roomId}
              />
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}
