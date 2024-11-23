import {
  Avatar,
  Button,
  Searchbar,
  SegmentedButtons,
  ToggleButton,
} from "react-native-paper";
import { useContext, useEffect, useRef, useState } from "react";
import { fetch_to } from "@/utils/fetch";
import { View, Text, useColorScheme } from "react-native";
import { User, UserRecommendations } from "@/types/User";
import UserCard from "@/components/UserCard";
import Loading from "@/components/Loading";
import TweetComponent from "@/components/TwitSnap";
import { Tweet } from "@/types/tweets";
import { mappedTwits } from "@/utils/mappedTwits";
import { UserContext } from "@/context/context";
import { SafeAreaView } from "react-native-safe-area-context";
import TabNavigation from "@/components/TabNavigation";
import { useRouter } from "expo-router";
import SearchBar from "@/components/SearchBar";
import { AntDesign } from "@expo/vector-icons";

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const [recommendations, setRecommendations] = useState<
    Array<UserRecommendations> | undefined
  >(undefined);
  const router = useRouter();

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }
  const currentUser = userContext.user;
  useEffect(() => {
    fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/recommendations/${currentUser.id}`,
      "GET"
    ).then((res) => {
      res.json().then((r) => {
        setRecommendations(r);
      });
    });
  }, []);

  return (
    <SafeAreaView className="px-3 py-2">
      <View className="flex flex-row items-center justify-between mt-1 mb-3 shadow-lg  pb-1 ">
        <Avatar.Image
          size={40}
          // className="dark:mt-1"
          source={{ uri: currentUser.avatar }}
          onTouchEnd={() => {
            router.push({
              pathname: "/(profile)/[id]",
              // @ts-ignore
              params: {
                id: currentUser.id,
              },
            });
          }}
        />
        <SearchBar
          containerStyle={{ marginLeft: 20 }}
          value=""
          onPress={() => router.push("/(search)/")}
          onChangeText={(_ = "") => console.log("")}
          setSearchQuery={() => console.log()}
        ></SearchBar>
        <AntDesign
          name="setting"
          size={27}
          color={colorScheme == "dark" ? "white" : "black"}
          onTouchEnd={() => {
            router.push("../(config)");
          }}
        />

        {/* <Avatar.Icon
          size={40}
          icon="dots-vertical"
          className="dark:mt-1 bg-white dark:bg-black -mr-2"
          onTouchEnd={() => {
            router.push("../(config)");
          }}
        /> */}
      </View>
      <Text className="dark:text-white text-center text-2xl font-bold mb-5">
        Recommendations
      </Text>
      {recommendations && recommendations.length == 0 && (
        <Text className="dark:text-white text-center text-2xl font-bold">
          No recommendations to show
        </Text>
      )}
      {recommendations &&
        recommendations.length > 0 &&
        recommendations.map((recommendedUser) => (
          <View className="p-1" key={recommendedUser.id}>
            <UserCard user={recommendedUser} />
          </View>
        ))}
    </SafeAreaView>
  );
}
