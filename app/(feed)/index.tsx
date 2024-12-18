import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  BackHandler,
} from "react-native";
import {
  Avatar,
  FAB,
  Dialog,
  Portal,
  Text as PaperText,
  Button,
} from "react-native-paper";
import { useRouter } from "expo-router";
import TweetComponent from "@/components/TwitSnap";
import { UserContext } from "@/context/context";
import { fetch_to } from "@/utils/fetch";
import Loading from "@/components/Loading";
import { Tweet } from "@/types/tweets";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mappedTwits } from "@/utils/mappedTwits";
import messaging from "@react-native-firebase/messaging";
import { NotificationContext } from "@/context/NotificationContext";
import * as Linking from "expo-linking";
import SnackBarComponent from "@/components/Snackbar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign } from "@expo/vector-icons";

const FeedScreen = () => {
  const url = Linking.useURL();
  const colorScheme = useColorScheme();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const userContext = useContext(UserContext);
  const notificationContext = useContext(NotificationContext);
  if (!userContext || !notificationContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }

  const user = userContext.user;
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [message, setMessage] = useState("");
  const isFocused = useIsFocused();
  const hideDialog = () => setDialogVisible(false);

  useEffect(() => {
    console.log("urlhomes", url);
    if (url) {
      const { hostname, path, queryParams } = Linking.parse(url);
      console.log("path", path);
      if (path) {
        router.push({
          pathname: "/twit/[id]",
          params: {
            id: path.split("/")[1],
          },
        });
      }
    }
  }, [url]);

  async function addDevice() {
    const token = await messaging().getToken();
    try {
      const res = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/notifications/${user.id}/devices`,
        "POST",
        {
          device: token,
        }
      );
    } catch (error) {
      console.error("Error al registrar el token FCM", error);
    }
  }

  function favoriteTweet(fav: boolean) {
    if (!fav) {
      setMessage("Tweet eliminado de favoritos");
    } else {
      setMessage("Tweet agregado a favoritos");
    }
    setVisible(true);
  }

  async function deleteTweet(tweetId: string) {
    try {
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${tweetId}`,
        "DELETE"
      );
      if (response.status === 204) {
        setTweets((prevTweets) =>
          prevTweets.filter((tweet) => tweet.id !== tweetId)
        );
        setMessage("Tweet eliminado correctamente");
        setVisible(true);
      } else {
        console.error("Error al eliminar el tweet:", response.status);
        alert("Error No se pudo eliminar el tweet.");
      }
    } catch (error) {
      console.error("Error al eliminar el tweet:", error);
      alert("Error Ocurrió un problema al eliminar el tweet.");
    }
  }

  async function editTweet(message: string, id: string) {
    router.push({
      pathname: "/twit/createTwit",
      params: {
        initialMessage: message,
        id: id,
      },
    });
  }

  useEffect(() => {
    addDevice();
    messaging().onNotificationOpenedApp((remoteMessage) => {
      const url = remoteMessage.data?.url;
      if (url) {
        console.log("Opening URL from notification click", url);
        // @ts-ignore
        router.push(url);
      }
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Received new notification:", remoteMessage);
      if (remoteMessage.notification) {
        if (remoteMessage.data && remoteMessage.data.createdBy != user.id) {
          notificationContext.saveUnseenNotifications(
            notificationContext.unseenNotifications + 1
          );
        }
      }
    });
    return unsubscribe;
  }, []);

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
  }, []);

  const fetchTweets = async (timestamp?: string) => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 2);
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${
          user?.id
        }/feed?timestamp_start=${
          timestamp ? timestamp : tomorrow.toISOString()
        }&limit=10`,
        "POST"
      );

      if (response.status === 200) {
        const data = await response.json();
        try {
          const mappedTweets = await mappedTwits(data, user);
          setTweets((prevTweets) =>
            timestamp ? [...prevTweets, ...mappedTweets] : mappedTweets
          );
        } catch (error) {
          if (error instanceof Error) {
            setMessage(error.message);
          }
          setDialogVisible(true);
          return;
        } finally {
          setLoading(false);
        }
      } else {
        console.log("ERROR: ", response);
        setMessage("Error al obtener los twits " + response.status);
      }
    } catch (error) {
      setMessage("Error de red o servidor: ");
      console.error(error);
    } finally {
      setRefreshing(false);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreTweets = async () => {
    if (loadingMore || tweets.length === 0) return;
    setLoadingMore(true);
    const lastTweetTimestamp = tweets[tweets.length - 1].createdAt;
    const lastTweetDate = new Date(lastTweetTimestamp).toISOString();
    setRefreshing(true);
    await fetchTweets(lastTweetDate);
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
        onScroll={({ nativeEvent }) => {
          const nearBottom =
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - 50;
          if (nearBottom) {
            loadMoreTweets();
          }
        }}
        scrollEventThrottle={400}
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
          <Avatar.Image
            size={50}
            source={require("@/assets/images/twitsnap-logo.webp")}
          />

          <AntDesign
            style={{ marginTop: 12 }}
            name="setting"
            size={30}
            color={colorScheme == "dark" ? "white" : "black"}
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
              key={tweet.sharedBy + tweet.id + tweet.message}
              initialTweet={tweet}
              shareTweet={onRefresh}
              deleteTweet={() => deleteTweet(tweet.id)}
              editTweet={() => editTweet(tweet.message, tweet.id)}
              favTweet={favoriteTweet}
            />
          ))}
      </ScrollView>

      {/* Botón flotante */}
      <FAB
        className="absolute bottom-4 right-4"
        icon="plus"
        onPress={() => {
          router.push("../twit/createTwit");
        }}
      />

      <View className="flex-1 ">
        <SnackBarComponent
          visible={visible}
          action={() => setVisible(false)}
          message={message}
        />
      </View>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Oops...</Dialog.Title>
          <Dialog.Content>
            <PaperText variant="bodyMedium">{message}</PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default FeedScreen;
