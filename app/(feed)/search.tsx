import {
  Button,
  Searchbar,
  SegmentedButtons,
  ToggleButton,
} from "react-native-paper";
import { useContext, useEffect, useRef, useState } from "react";
import { fetch_to } from "@/utils/fetch";
import { View, Text } from "react-native";
import { User, UserRecommendations } from "@/types/User";
import UserCard from "@/components/UserCard";
import Loading from "@/components/Loading";
import TweetComponent from "@/components/TwitSnap";
import { Tweet } from "@/types/tweets";
import { mappedTwits } from "@/utils/mappedTwits";
import { UserContext } from "@/context/context";
import { SafeAreaView } from "react-native-safe-area-context";
import TabNavigation from "@/components/TabNavigation";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [listOfUsers, setListOfUsers] = useState<Array<User>>([]);
  const [tweets, setTweets] = useState<Array<Tweet>>([]);
  const [searchingHashtag, setSearchingHashtag] = useState("");
  const [isSearchingHashtag, setIsSearchingHashtag] = useState(false);
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [searchTwit, setSearchTwit] = useState("");
  const [isSearchingTwit, setIsSearchingTwit] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<
    Array<UserRecommendations> | undefined
  >(undefined);

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
        console.log("Recommendations: ", r);
        setRecommendations(r);
      });
    });
  }, []);

  async function searchUsers(query: string) {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/search/?user=${query}&limit=10`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      setSearching(false);
      setListOfUsers(data);
      setIsSearchingUser(true);
    } else {
      console.error(
        "Error al obtener los usuarios",
        response.status,
        response.text
      );
    }
  }

  async function searchTwits(query: string) {
    setSearching(true);
    setSearchingHashtag("");
    setListOfUsers([]);
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/search?text=${query}`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      const mapped_twits = await mappedTwits(data, currentUser.id);
      setSearching(false);
      setIsSearchingTwit(true);
      setTweets(mapped_twits);
      setSearchTwit("");
    } else {
      console.error(
        "Error al obtener los twits",
        response.status,
        response.text
      );
    }
  }

  async function searchHashtags(query: string) {
    setSearching(true);
    setSearchingHashtag("");
    setTweets([]);
    query = query.substring(1);
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/hashtag/search?name=${query}`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      const mapped_twits = await mappedTwits(data, currentUser.id);
      setSearching(false);
      setIsSearchingHashtag(true);
      setTweets(mapped_twits);
    } else {
      console.error(
        "Error al obtener los hashtags",
        response.status,
        response.text
      );
    }
  }

  async function handleTypingStop(input: string) {
    setListOfUsers([]);
    setTweets([]);
    setSearching(true);
    setIsSearchingHashtag(false);
    setIsSearchingTwit(false);
    setIsSearchingUser(false);
    if (input.startsWith("#")) {
      setSearchingHashtag(input);
      setSearching(false);
    } else {
      setSearchingHashtag("");
      setSearchTwit(input);
      await searchUsers(input);
    }
  }

  const handleTextChange = (input: string) => {
    setSearchQuery(input);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      handleTypingStop(input);
    }, 500);
  };

  return (
    <SafeAreaView>
      <Searchbar
        className="mt-4 dark:bg-gray-400 mb-2 mx-4"
        placeholder="Search"
        onChangeText={handleTextChange}
        value={searchQuery}
      />
      {recommendations && recommendations.length == 0 && (
        <Text className="dark:text-white">No recommendations to show</Text>
      )}
      {recommendations &&
        recommendations.length > 0 &&
        recommendations.map((recommendedUser) => (
          <View className="p-1" key={recommendedUser.id}>
            <UserCard user={recommendedUser} />
          </View>
        ))}

      {searching && (
        <View className="m-2">
          <Loading />
        </View>
      )}
      {listOfUsers.length === 0 && isSearchingUser && (
        <Text className="text-center text-gray-500 text-lg mt-5">
          No hay usuarios para mostrar
        </Text>
      )}
      {listOfUsers.map((user) => (
        <View className="p-1" key={user.id}>
          <UserCard user={user} />
        </View>
      ))}
      {/* creo un boton para buscar el twit que esta escribiendo */}
      {searchTwit && (
        <View className="m-2">
          <Button
            mode="contained"
            onPress={async () => searchTwits(searchTwit)}
            className="bg-slate-500 mb-4 p-1 rounded-full dark:text-white"
          >
            Buscar Twits
          </Button>
        </View>
      )}

      {/* creo un boton para buscar el hashtag que esta escribiendo */}
      {searchingHashtag && (
        <View className="m-2">
          <Button
            mode="contained"
            onPress={async () => searchHashtags(searchingHashtag)}
            className="bg-slate-500 mb-4 p-1 rounded-full dark:text-white"
          >
            {searchingHashtag}
          </Button>
        </View>
      )}
      {tweets.length === 0 && (isSearchingHashtag || isSearchingTwit) && (
        <Text className="text-center text-gray-500 text-lg mt-10">
          No hay twits para mostrar
        </Text>
      )}
      {tweets.length > 0 &&
        tweets.map((tweet, index) => (
          <TweetComponent
            key={index}
            initialTweet={tweet}
            shareTweet={async () => searchHashtags}
          />
        ))}
    </SafeAreaView>
  );
}
