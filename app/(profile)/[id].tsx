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

export default function ProfileHomeScreen() {
  const colorScheme = useColorScheme();
  const [tweets, setTweets] = useState([]);
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
    initialFollowed == "1" ? true : false
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
      console.log(data);
      const uniqueUserIds = Array.from(
        new Set(data.map((tweet: Tweet) => tweet.createdBy))
      );

      const sharedTwit: { [key: string]: any } = {};
      data.forEach((tweet: Tweet) => {
        if (tweet.sharedBy == null) {
          return;
        }
        const resnapeado = tweet.sharedBy == currentUser?.id;
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
        const megusteado = like.likedBy == currentUser?.id;
        if (megusteado) {
          userLikes[like.twitsnapId] = megusteado;
        }
      });

      setTweets([]);
      const data_tweets = data.map((tweet: Tweet) => {
        const sharedBy = userMap[tweet.sharedBy] || {};
        const createdBy = userMap[tweet.createdBy] || {};
        const likedByMe = userLikes[tweet.id] || false;
        const sharedByMe = sharedTwit[tweet.id] || false;
        return {
          id: tweet.id,
          avatar: createdBy?.avatar,
          name: createdBy?.name,
          username: createdBy?.user,
          message: tweet.message,
          likes_count: tweet.likes_count,
          shares_count: tweet.shares_count,
          sharedBy: sharedBy?.user || null,
          comments: 0,
          createdBy: tweet.createdBy,
          likedByMe: likedByMe,
          sharedByMe: sharedByMe,
        };
      });
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
            <TouchableOpacity
              onPress={() => router.push("/(profile)/editprofile")}
            >
              <Text className="bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-full shadow-md">
                Editar Perfil
              </Text>
            </TouchableOpacity>
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
        className="px-4 py-2"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tweets.map((tweet, index) => (
          // @ts-ignore
          <TweetComponent
            key={index}
            initialTweet={tweet}
            shareTweet={onRefresh}
          />
        ))}
        <View className="flex-1">
          <SnackBarComponent
            visible={visible}
            action={() => setVisible(false)}
            message={message}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
