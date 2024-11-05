import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  BackHandler,
} from "react-native";
import { Avatar, FAB, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import TweetComponent from "@/components/TwitSnap";
import { UserContext } from "@/context/context";
import { fetch_to } from "@/utils/fetch";
import Loading from "@/components/Loading";
import { Tweet } from "@/types/tweets";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mappedTwits } from "@/utils/mappedTwits";

const FeedScreen = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }
  const user = userContext.user;
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    const backAction = () => {
      if (user) {
        // exit the app if the user is logged in and on the home screen
        BackHandler.exitApp();
        return true;
      } else {
        // Otherwise, go back to the previous screen (e.g., login)
        router.back();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [user, router]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTweets();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchTweets = async (timestamp?: Date) => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 2);
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${
          user?.id
        }/feed?timestamp_start=${tomorrow.toISOString()}&limit=10`,
        "POST"
      );

      if (response.status === 200) {
        const data = await response.json();
        setTweets([]);
        const mappedTweets = await mappedTwits(data, user?.id);
        setTweets(mappedTweets);
        setLoading(false);
      } else {
        console.log("ERROR: ", response);
        setMessage("Error al obtener los twits " + response.status);
      }
    } catch (error) {
      setMessage("Error de red o servidor: ");
      console.error(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      onRefresh();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center h-full w-full">
        <Loading />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView
        className="px-4 py-2"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Sección del encabezado con los Avatares */}
        <View className="flex flex-row justify-between my-4 shadow-lg  pb-1 ">
          <Avatar.Image
            size={50}
            source={{ uri: user.avatar }}
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
          {/* <Avatar.Image
            size={50}
            source={require("@/assets/images/twitsnap-logo.webp")}
          /> */}

          <Avatar.Icon
            size={50}
            icon="dots-vertical"
            className="bg-white dark:bg-black -mr-2"
            onTouchEnd={() => {
              router.push("../(config)");
            }}
          />
        </View>

        {/* Renderizar los tweets */}
        {tweets.length === 0 && (
          <Text className="text-center text-gray-500 text-lg mt-10">
            No hay twits para mostrar
          </Text>
        )}
        {tweets.length > 0 &&
          tweets.map((tweet, index) => (
            <TweetComponent
              key={index}
              initialTweet={tweet}
              shareTweet={onRefresh}
            />
          ))}
      </ScrollView>

      {/* Botón flotante */}
      <FAB
        className="absolute bottom-4 right-4"
        icon="plus"
        onPress={() => {
          router.push("../(twit)/createTwit");
        }}
      />

      <View className="px-8">
        <Snackbar
          visible={visible}
          onDismiss={() => {}}
          action={{
            label: "Cerrar",
            onPress: () => {
              setVisible(false);
            },
          }}
        >
          {message}
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

export default FeedScreen;
