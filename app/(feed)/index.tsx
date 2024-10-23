import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Text } from "react-native";
import { Avatar, FAB, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import TweetComponent from "@/components/TwitSnap";
import { User } from "@/types/User";
import { UserContext } from "@/context/context";
import { fetch_to } from "@/utils/fetch";
import Loading from "@/components/Loading";
import { Tweet } from "@/types/tweets";
import { useIsFocused } from "@react-navigation/native";

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

        const uniqueUserIds = Array.from(
          new Set(data.map((tweet: Tweet) => tweet.createdBy))
        );

        const sharedTwit: { [key: string]: any } = {};
        data.forEach((tweet: Tweet) => {
          if (tweet.sharedBy == null) {
            return;
          }
          const resnapeado = tweet.sharedBy == user?.id;
          if (resnapeado) {
            sharedTwit[tweet.id] = resnapeado;
          }
          if (!uniqueUserIds.includes(tweet.sharedBy)) {
            uniqueUserIds.push(tweet.sharedBy);
          }
        });

        const uniqueTwitIds = Array.from(
          new Set(
            data
              .filter((tweet: Tweet) => tweet.likes_count != "0")
              .map((tweet: Tweet) => tweet.id)
          )
        );

        const userResponses = await Promise.all(
          uniqueUserIds.map((userId) =>
            fetch_to(
              `https://api-gateway-ccbe.onrender.com/users/${userId}`,
              "GET"
            )
          )
        );

        const likesResponses = await Promise.all(
          uniqueTwitIds.map((twitId) =>
            fetch_to(
              `https://api-gateway-ccbe.onrender.com/twits/${twitId}/like`,
              "GET"
            )
          )
        );

        const users = await Promise.all(
          userResponses
            .filter((res) => res.status === 200)
            .map((res) => res.json())
        );
        const likes = await Promise.all(
          likesResponses
            .filter((res) => res.status === 200)
            .map((res) => res.json())
        );

        const userMap: { [key: string]: any } = {};
        users.forEach((user) => {
          userMap[user.id] = user;
        });

        const userLikes: { [key: string]: any } = {};
        likes.flat().forEach((like) => {
          const megusteado = like.likedBy == user?.id;
          if (megusteado) {
            userLikes[like.twitsnapId] = megusteado;
          }
        });

        setTweets([]);
        const mappedTweets = data.map((tweet: Tweet) => {
          const mappedUser = userMap[tweet.createdBy] || {};
          const sharedBy = userMap[tweet.sharedBy] || {};
          const likedByMe = userLikes[tweet.id] || false;
          const sharedByMe = sharedTwit[tweet.id] || false;
          return {
            id: tweet.id,
            avatar: `https://robohash.org/${mappedUser.id}.png`,
            name: mappedUser?.name || "Desconocido",
            username: mappedUser?.user || "unknown",
            message: tweet.message,
            likes_count: tweet.likes_count,
            shares_count: tweet.shares_count,
            sharedBy: sharedBy?.user || null,
            comments: 0,
            createdBy: mappedUser.id,
            likedByMe: likedByMe,
            sharedByMe: sharedByMe,
          };
        });
        setTweets(mappedTweets);
        setLoading(false);
      } else {
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

  // useEffect(() => {
  //   if (user) {
  //     setLoading(false);
  //   }
  // }, [user, tweets]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center h-full w-full">
        <Loading />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
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
        {tweets.length === 0 && (
          <Text className="text-center text-gray-500 text-lg">
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
