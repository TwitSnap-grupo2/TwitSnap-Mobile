import { Stack } from "expo-router";
import { View, Text } from "react-native";
import { User } from "@/types/User";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";

const ChatRoomHeader = ({
  id,
  name,
  router,
}: {
  id: string;
  name: string;
  router: Router;
}) => {
  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo
                name="chevron-left"
                size={30}
                className="dark:bg-white bg-black"
              ></Entypo>
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <Avatar.Image
                size={50}
                source={{ uri: `https://robohash.org/${id}.png` }}
                onTouchEnd={() => {
                  router.push({
                    pathname: "/(profile)/[id]",
                    // @ts-ignore
                    params: {
                      id: id,
                    },
                  });
                }}
              />
              <Text className="text-black dark:text-white">{name}</Text>
            </View>
          </View>
        ),
      }}
    ></Stack.Screen>
  );
};

export default ChatRoomHeader;
