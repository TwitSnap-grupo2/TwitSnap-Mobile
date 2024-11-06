import { Button, Searchbar } from "react-native-paper";
import { useContext, useRef, useState } from "react";
import { fetch_to } from "@/utils/fetch";
import { View, Text } from "react-native";
import { User } from "@/types/User";
import UserCard from "@/components/UserCard";
import Loading from "@/components/Loading";
import TweetComponent from "@/components/TwitSnap";
import { Tweet } from "@/types/tweets";
import { mappedTwits } from "@/utils/mappedTwits";
import { UserContext } from "@/context/context";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [listOfUsers, setListOfUsers] = useState<Array<User>>([]);
  const [tweets, setTweets] = useState<Array<Tweet>>([]);
  const [searchingHashtag, setSearchingHashtag] = useState("");
  const [searching, setSearching] = useState(false);
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }
  const currentUser = userContext.user;

  async function searchUsers(query: string) {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/search/?user=${query}&limit=10`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      setSearching(false);
      setListOfUsers(data);
    } else {
      console.error(
        "Error al obtener los usuarios",
        response.status,
        response.text
      );
    }
  }

  async function searchHashtags(query: string) {
    setSearching(true);
    setSearchingHashtag("");
    query = query.substring(1);
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/hashtag/search?name=${query}`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log(currentUser.id);
      const mapped_twits = await mappedTwits(data, currentUser.id);
      setSearching(false);
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
    if (input.startsWith("#")) {
      setSearchingHashtag(input);
      setSearching(false);
    } else {
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
    <View>
      <Searchbar
        className="mt-10 dark:bg-gray-400 mb-2"
        placeholder="Search"
        onChangeText={handleTextChange}
        value={searchQuery}
      />
      {searching && (
        <View className="m-2">
          <Loading />
        </View>
      )}
      {listOfUsers.map((user) => (
        <View className="p-1" key={user.id}>
          <UserCard user={user} />
        </View>
      ))}
      {/* creo un boton para buscar el hashtag que esta escribiendo */}
      {searchingHashtag && (
        <View className="m-2">
          <Button
            mode="contained"
            onPress={async () => searchHashtags(searchingHashtag)}
            className="bg-slate-500 mb-4 p-1 rounded-full"
          >
            {searchingHashtag}
          </Button>
        </View>
      )}
      {tweets.length > 0 &&
        tweets.map((tweet, index) => (
          <TweetComponent
            key={index}
            initialTweet={tweet}
            shareTweet={async () => searchHashtags}
          />
        ))}
    </View>
  );
}
