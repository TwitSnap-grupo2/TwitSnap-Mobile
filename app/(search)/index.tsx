import Loading from "@/components/Loading";
import PortalDialog from "@/components/PortalDialog";
import SearchBar from "@/components/SearchBar";
import TweetComponent from "@/components/TwitSnap";
import UserCard from "@/components/UserCard";
import { UserContext } from "@/context/context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tweet } from "@/types/tweets";
import { User } from "@/types/User";
import { fetch_to } from "@/utils/fetch";
import { mappedTwits } from "@/utils/mappedTwits";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useRef, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Dialog, Portal, Text as PaperText, Button } from "react-native-paper";

export default function Search() {
  const router = useRouter();
  const colorScheme = useColorScheme();
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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [message, setMessage] = useState("");
  const hideDialog = () => setDialogVisible(false);

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
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/search?text=${query}`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();

      try {
        const mapped_twits = await mappedTwits(data, currentUser);
        setTweets(mapped_twits);
      } catch (error) {
        if (error instanceof Error) {
          setMessage(error.message);
        }
        setDialogVisible(true);
      } finally {
        setSearching(false);
        setSearchTwit("");
        setIsSearchingTwit(true);
      }
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
      try {
        const mapped_twits = await mappedTwits(data, currentUser);
        setTweets(mapped_twits);
      } catch (error) {
        if (error instanceof Error) {
          setMessage(error.message);
        }
        setDialogVisible(true);
      } finally {
        setSearching(false);
        setIsSearchingHashtag(true);
      }
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
    <SafeAreaView className="dark:bg-black bg-white mt-6 px-3 py-2">
      {/* <View className="flex flex-row justify-between my-4 shadow-lg  pb-1 "> */}
      <View className=" flex flex-row justify-between items-center my-4 shadow-lg pb-1 ">
        <AntDesign
          color={colorScheme === "dark" ? "#fff" : "#000"}
          // style={{ marginTop: 18 }}
          name="arrowleft"
          size={30}
          onPress={() => router.back()}
        />

        <SearchBar
          containerStyle={{ marginLeft: 20 }}
          setSearchQuery={setSearchQuery}
          value={searchQuery}
          onChangeText={handleTextChange}
          autoFocus={true}
        />
        <AntDesign
          name="setting"
          size={27}
          color={colorScheme == "dark" ? "white" : "black"}
          onTouchEnd={() => {
            router.push("../(config)");
          }}
        />
      </View>
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
        <View className="p-1 mb-1" key={user.id}>
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
            textColor={colorScheme === "dark" ? "white" : "black"}
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
            textColor={colorScheme === "dark" ? "white" : "black"}
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

      <PortalDialog
        dialogVisible={dialogVisible}
        hideDialog={hideDialog}
        message={message}
      />
    </SafeAreaView>
  );
}
