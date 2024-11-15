import BackHeader from "@/components/BackHeader";
import TweetComponent from "@/components/TwitSnap";
import { UserContext } from "@/context/context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Tweet } from "@/types/tweets";
import { User } from "@/types/User";
import { fetch_to } from "@/utils/fetch";
import Loading from "@/components/Loading";
import SnackBarComponent from "@/components/Snackbar";
import { ScrollView, RefreshControl } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { mappedTwits } from "@/utils/mappedTwits";
import { List } from "react-native-paper";

export default function ProfileHomeScreen() {
  const colorScheme = useColorScheme();
  const [tweets, setTweets] = useState(Array<Tweet>);
  const [user, setUser] = useState<User | null>(null);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id, initialFollowed } = useLocalSearchParams();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  const { saveUser } = userContext;
  const currentUser = userContext.user;
  if (!currentUser) {
    throw new Error("UserContext.user is null");
  }
  const isCurrentUserProfile = currentUser?.id === id;
  const [followed, setFollowed] = useState(
    currentUser?.followeds.includes(id as string)
    // initialFollowed == "1" ? true : false
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTweets();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  async function handleFollow() {
    if (followed) {
      setFollowed(false);

      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/users/follow/${currentUser?.id}?followed_id=${id}`,
        "DELETE",
        id
      );

      if (response.status === 200) {
        setFollowed(false);
        const new_followeds = currentUser?.followeds;
        if (!new_followeds) {
          return;
        }
        const index = new_followeds.indexOf(id as string);
        if (index > -1) {
          new_followeds.splice(index, 1);
        }
        console.log(new_followeds);
        saveUser({ ...currentUser, followeds: new_followeds });
      } else {
        setMessage("Error al dejar de seguir al usuario " + response.status);
        setVisible(true);
      }
      return;
    } else {
      setFollowed(true);
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/users/follow/${currentUser?.id}?followed_id=${id}`,
        "POST"
      );

      if (response.status === 201) {
        const new_followeds = currentUser?.followeds;
        if (!new_followeds) {
          return;
        }
        new_followeds.push(id as string);
        console.log(new_followeds);
        saveUser({ ...currentUser, followeds: new_followeds });
        setFollowed(true);
      } else {
        setMessage("Error al seguir al usuario " + response.status);
        setVisible(true);
      }
    }
  }

  const fetchUser = async () => {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/${id}`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      const data_user = {
        id: data.id,
        name: data.name,
        user: data.user,
        avatar: `https://robohash.org/${data.id}.png`,
        email: data.email,
        followers: data.followers,
        followeds: data.followeds,
        location: data.location,
        interests: data.interests,
      };
      setUser(data_user);
    } else {
      setMessage("Error al obtener los twits " + response.status);
    }
  };

  const fetchTweets = async () => {
    if (!user) {
      fetchUser();
      return;
    }

    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/user/${id}`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      setTweets([]);
      const data_tweets = await mappedTwits(data, user.id);
      setTweets(data_tweets);
      setLoading(false);
    } else {
      setMessage("Error al obtener los twits " + response.status);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchTweets();
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center h-full w-full">
        <Loading />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View className="items-center mt-10">
        <Image
          source={{ uri: user?.avatar }}
          className="h-24 w-24 rounded-full border-2 border-gray-300"
        />
      </View>

      <View className="flex-row justify-between items-center mt-4 p-4">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.name}
          </Text>
          <Text className="text-md text-gray-500 dark:text-gray-300 ">
            @{user?.user}
          </Text>

          <View className="flex-row space-x-4 mt-2">
            <Text className="text-sm text-gray-600 dark:text-gray-500">
              <Text className="font-semibold">{user?.followeds.length}</Text>{" "}
              Following
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-500">
              <Text className="font-semibold">{user?.followers.length}</Text>{" "}
              Followers
            </Text>
          </View>
        </View>

        <View className="ml-4">
          {isCurrentUserProfile ? (
            <View className="flex flex-row gap-2">
              <TouchableOpacity onPress={() => router.push("/(profile)/stats")}>
                <Text className="text-center bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-full shadow-md">
                  Estadisticas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/(profile)/editprofile")}
              >
                <Text className="text-center bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-full shadow-md">
                  Editar Perfil
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleFollow}>
              <Text
                className={
                  followed
                    ? "bg-white text-blue-500 text-sm font-bold py-2 px-4 rounded-full shadow-md"
                    : "bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-full shadow-md"
                }
              >
                {followed ? "Siguiendo" : "Seguir"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView
        className="px-4 py-2 bg-white dark:bg-black mb-64"
        contentContainerStyle={{ marginBottom: 100, minHeight: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tweets.map((tweet, index) => (
          // @ts-ignore
          <TweetComponent
            key={tweet.sharedBy + tweet.id}
            initialTweet={tweet}
            shareTweet={onRefresh}
          />
        ))}
      </ScrollView>
      <View className="flex-1">
        <SnackBarComponent
          visible={visible}
          action={() => setVisible(false)}
          message={message}
        />
      </View>
    </SafeAreaView>
  );
}
