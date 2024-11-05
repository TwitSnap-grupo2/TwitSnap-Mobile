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
  const [chatsList, setChatsList] = useState([]);

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
              placeholder="Search"
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
        {chatsList.length === 0 && (
          <Text className="text-center text-gray-500 text-lg mt-10">
            No hay chats para mostrar
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
