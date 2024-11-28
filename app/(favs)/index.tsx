import Loading from "@/components/Loading";
import TweetComponent from "@/components/TwitSnap";
import { UserContext } from "@/context/context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tweet } from "@/types/tweets";
import { auth } from "@/utils/config";
import { fetch_to } from "@/utils/fetch";
import { mappedTwits } from "@/utils/mappedTwits";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { Button } from "react-native-paper";

export default function FavLayout() {
  const [loading, setLoading] = useState(true);
  const [tweets, setTweet] = useState<Tweet[]>([]);
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }
  const currentUser = userContext.user;

  async function fetchFavs() {
    const saves = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/favourites/${currentUser.id}`,
      "GET"
    );

    if (saves.status != 200) {
      console.log("Error al obtener los saves");
      return null;
    }
    const savesData = await saves.json();
    const mapped = await mappedTwits(savesData, currentUser);
    setTweet(mapped);
    setLoading(false);
  }

  useEffect(() => {
    fetchFavs();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center h-full w-full">
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView
      className="px-4 py-2 bg-white dark:bg-black"
      scrollEventThrottle={400}
    >
      {/* Renderizar los tweets */}
      {tweets.length === 0 && (
        <Text className="text-center text-gray-500 text-lg mt-10">
          No hay twits para mostrar
        </Text>
      )}
      {tweets.length > 0 &&
        tweets.map((tweet, index) => (
          <TweetComponent
            key={tweet.sharedBy + tweet.id + tweet.message}
            initialTweet={tweet}
            shareTweet={() => {}}
          />
        ))}
    </ScrollView>
  );
}
