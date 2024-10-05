import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Avatar, FAB, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import TweetComponent from "@/components/TwitSnap";
import { User } from "@/types/User";
import { UserContext } from "@/context/context";
import { fetch_to } from "@/utils/fetch";
import Loading from "@/components/Loading";
import { Tweet } from "@/types/tweets";

const FeedScreen = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [usuario, setUser] = useState<User | null | undefined>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
      fetchTweets();
    }, 2000);
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await fetch_to(
        "https://api-gateway-ccbe.onrender.com/twits/",
        "GET"
      );

      if (response.status === 200) {
        const data = await response.json();

        const uniqueUserIds = Array.from(
          new Set(data.map((tweet: Tweet) => tweet.createdBy))
        );

        const userResponses = await Promise.all(
          uniqueUserIds.map((userId) =>
            fetch_to(
              `https://api-gateway-ccbe.onrender.com/users/${userId}`,
              "GET"
            )
          )
        );

        const users = await Promise.all(
          userResponses
            .filter((res) => res.status === 200)
            .map((res) => res.json())
        );

        const userMap: { [key: string]: any } = {};
        users.forEach((user) => {
          userMap[user.id] = user;
        });
        const mappedTweets = data.map((tweet: Tweet) => {
          const user = userMap[tweet.createdBy] || {};
          return {
            avatar: `https://robohash.org/${user.id}.png`,
            name: user?.name || "Desconocido",
            username: user?.user || "unknown",
            message: tweet.message,
            likes: 0,
            retweets: 0,
            comments: 0,
            createdBy: user.id,
          };
        });
        setTweets(mappedTweets);
      } else {
        setMessage("Error al obtener los twits " + response.status);
      }
    } catch (error) {
      setMessage("Error de red o servidor: ");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTweets();
    setUser(user);
  }, []);

  useEffect(() => {
    if (user && tweets.length > 0) {
      setLoading(false);
    }
  }, [user, tweets]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center h-full w-full">
        <Loading />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="px-4 py-2"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Sección del encabezado con los Avatares */}
        <View className="flex flex-row space-x-28 my-4">
          <Avatar.Image
            size={50}
            source={{ uri: usuario?.avatar }}
            onTouchEnd={() => {
              router.push({
                pathname: "/(profile)/[id]",
                // @ts-ignore
                params: { id: usuario?.id },
              });
            }}
          />
          <Avatar.Image
            size={50}
            source={require("@/assets/images/twitsnap-logo.webp")}
          />

          <Avatar.Icon
            size={60}
            icon="dots-vertical"
            style={{ backgroundColor: "white" }}
            onTouchEnd={() => {
              router.push("../(config)");
            }}
          />
        </View>

        {/* Renderizar los tweets */}
        {tweets.map((tweet, index) => (
          <TweetComponent key={index} tweet={tweet} />
        ))}
      </ScrollView>

      {/* Botón flotante */}
      <FAB
        className="absolute bottom-4 right-4"
        icon="plus"
        onPress={() => {
          router.replace("../(twit)/createTwit");
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
    </View>
  );
};

export default FeedScreen;
