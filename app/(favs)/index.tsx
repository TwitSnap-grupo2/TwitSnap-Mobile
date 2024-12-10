import Loading from "@/components/Loading";
import PortalDialog from "@/components/PortalDialog";
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

import { Dialog, Portal, Text as PaperText, Button } from "react-native-paper";

export default function FavLayout() {
  const [loading, setLoading] = useState(true);
  const [tweets, setTweet] = useState<Tweet[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [message, setMessage] = useState("");
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }
  const currentUser = userContext.user;

  const hideDialog = () => setDialogVisible(false);

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
    try {
      const mapped = await mappedTwits(savesData, currentUser);
      setTweet(mapped);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
      setDialogVisible(true);
      return;
    } finally {
      setLoading(false);
    }
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
      <PortalDialog
        dialogVisible={dialogVisible}
        hideDialog={hideDialog}
        message={message}
      />
    </ScrollView>
  );
}
