import BackHeader from "@/components/BackHeader";
import TweetComponent from "@/components/TwitSnap";
import { UserContext } from "@/context/context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
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

export default function ProfileHomeScreen() {
  const [tweets, setTweets] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id, initialFollowed } = useLocalSearchParams();
  const userContext = useContext(UserContext);
  const currentUser = userContext ? userContext.user : null;

  const isCurrentUserProfile = currentUser?.id === id;
  const [followed, setFollowed] = useState(
    initialFollowed == "1" ? true : false
  );

  async function handleFollow() {
    if (followed) {
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/users/follow/${currentUser?.id}?followed_id=${id}`,
        "DELETE",
        id
      );

      if (response.status === 200) {
        setFollowed(false);
        setMessage("Usuario dejado de seguir correctamente");
        setVisible(true);
      } else {
        setMessage("Error al dejar de seguir al usuario " + response.status);
        setVisible(true);
      }
      return;
    } else {
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/users/${currentUser?.id}/follow`,
        "POST",
        id
      );

      if (response.status === 201) {
        setMessage("Usuario seguido correctamente");
        setVisible(true);
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
      };
      setUser(data_user);
    } else {
      setMessage("Error al obtener los twits " + response.status);
    }
  };

  const fetchTweets = async () => {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/user/${id}`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      const data_tweets = data.map((tweet: Tweet) => {
        return {
          avatar: user?.avatar,
          name: user?.name,
          username: user?.user,
          message: tweet.message,
          likes_count: 0,
          shares_count: 0,
          comments: 0,
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
          <Text className="text-2xl font-bold text-gray-900">{user?.name}</Text>
          <Text className="text-md text-gray-500">@{user?.user}</Text>

          <View className="flex-row space-x-4 mt-2">
            <Text className="text-sm text-gray-600">
              <Text className="font-semibold">{user?.followeds.length}</Text>{" "}
              Following
            </Text>
            <Text className="text-sm text-gray-600">
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
      {tweets.map((tweet, index) => (
        // @ts-ignore
        <TweetComponent key={index} initialTweet={tweet} />
      ))}
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
