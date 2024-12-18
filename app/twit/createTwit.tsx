import { Button, Avatar } from "react-native-paper";
import {
  TextInput,
  View,
  KeyboardAvoidingView,
  BackHandler,
  ScrollView,
} from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UserContext } from "@/context/context";
import { fetch_to } from "@/utils/fetch";
import { styled } from "nativewind";
import SnackBarComponent from "@/components/Snackbar";
import { User } from "@/types/User";
import UserCard from "@/components/UserCard";
import Loading from "@/components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";

const StyledView = styled(View);

const CreateTweetScreen = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }
  const user = userContext.user;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mentionedUsers, setMentionedUsers] = useState<Array<User>>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [listOfUsers, setListOfUsers] = useState<Array<User>>([]);
  const { initialMessage, id } = useLocalSearchParams();
  const [tweet, setTweet] = useState(
    initialMessage ? initialMessage.toString() : ""
  );

  // const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      router.replace("/(feed)");
      return true; // prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  async function handleTypingStop(input: string) {
    setSearching(true);
    setListOfUsers([]);
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/search/?user=${input}&limit=10`,
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

  const findWordAtCursor = (text: string, cursorPosition: number) => {
    const start = text.lastIndexOf(" ", cursorPosition - 1) + 1;
    const end = text.indexOf(" ", cursorPosition);
    return text.substring(start, end === -1 ? text.length : end);
  };

  const handleSelectionChange = ({
    nativeEvent: { selection },
  }: {
    nativeEvent: { selection: { start: number; end: number } };
  }) => {
    setCursorPosition(selection.start);
    setCurrentWord(findWordAtCursor(tweet, selection.start));
  };

  const handleTextChange = (input: string) => {
    const ant_tweet = tweet;
    setTweet(input);

    // si el nuevo input solo tiene un espacio en blanco mas que el anterior, no hago nada
    if (
      input.length === ant_tweet.length + 1 &&
      input[input.length - 1] === " "
    ) {
      return;
    }

    let word = "";
    if (input.length < ant_tweet.length) {
      word = findWordAtCursor(input, cursorPosition - 1);
      const ant_word = findWordAtCursor(ant_tweet, cursorPosition - 1);

      if (word.length > 1 && word[0] === "@") {
        const user = mentionedUsers.find(
          (user) => user.user === ant_word.slice(1)
        );
        if (user) {
          const filteredUsers = mentionedUsers.filter((u) => u.id !== user.id);
          setMentionedUsers(filteredUsers);
        }
      }
    } else {
      word = findWordAtCursor(input, cursorPosition);
    }

    if (word.length > 1 && word[0] === "@") {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      typingTimeout.current = setTimeout(() => {
        // le paso la ultima palabra sin el arroba
        handleTypingStop(word.slice(1));
      }, 500);
    }
  };

  function mencionUser(user: User | any) {
    //reemplazo la ultima palabra por el usuario
    const nuevaMencion = tweet.replace(currentWord, `@${user.user}`);

    if (!mentionedUsers.includes(user)) {
      setMentionedUsers([...mentionedUsers, user]);
    }
    setTweet(nuevaMencion);
    setListOfUsers([]);
  }

  useEffect(() => {
    setCurrentWord(findWordAtCursor(tweet, cursorPosition));
  }, [tweet, cursorPosition]);

  async function handleSubmit() {
    if (tweet == "") {
      setVisible(true);
      setMessage("No se puede crear un twitsnap sin contenido");
      return;
    }
    try {
      let tweetId = "";
      if (!initialMessage) {
        const response = await fetch_to(
          "https://api-gateway-ccbe.onrender.com/twits/",
          "POST",
          {
            message: tweet,
            createdBy: user.id,
          }
        );

        if (response.status === 201) {
          const data = await response.json();
          tweetId = data.id;

          // Por cada usuario mencionado, se crea un nuevo twit
          mentionedUsers.forEach(async (user) => {
            const responseMention = await fetch_to(
              `https://api-gateway-ccbe.onrender.com/twits/${tweetId}/mention`,
              "POST",
              {
                mentionedUser: user.id,
              }
            );

            if (responseMention.status != 201) {
              setVisible(true);
              setMessage("Error al crear el usuario " + responseMention.status);
              return;
            }
          });
        } else {
          setVisible(true);
          setMessage("Error al crear el usuario " + response.status);
          return;
        }
        setVisible(true);
        setMessage("Twit snapeado correctamente");
        setTimeout(() => {
          handleBack();
        }, 700);
      } else {
        const response = await fetch_to(
          `https://api-gateway-ccbe.onrender.com/twits/${id}`,
          "PATCH",
          {
            message: tweet,
            isPriavate: false,
          }
        );

        if (response.status === 200) {
          setVisible(true);
          setMessage("Twit editado correctamente");
          setTimeout(() => {
            handleBack();
          }, 700);
        } else {
          setVisible(true);
          setMessage("Error al editar el twit " + response.status);
        }
      }
    } catch (error) {
      console.error("Failed to post twitsnap:", error);
    }
  }

  function handleBack() {
    router.back();
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center h-full w-full">
        <Loading />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex flex-1 bg-white dark:bg-black"
    >
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingTop: 20,
            }}
          >
            {/* Avatar del usuario */}
            <Avatar.Image
              size={50}
              source={{ uri: user?.avatar || "https://example.com/avatar.png" }}
            />

            {/* Input para el tweet */}
            <TextInput
              placeholder="¿Qué está pasando?"
              placeholderTextColor="#aaa"
              multiline
              value={tweet}
              onChangeText={handleTextChange}
              onSelectionChange={handleSelectionChange}
              autoFocus={true}
              style={{
                flex: 1,
                marginLeft: 12,
                color: colorScheme === "dark" ? "#fff" : "#000",
                fontSize: 18,
                backgroundColor: "transparent",
                marginBottom: 80,
              }}
              selectionColor="rgba(0, 122, 255, 0.5)" // semi-transparent blue
            />
          </View>

          {/* Lista de usuarios */}
          {searching && (
            <View>
              <Loading />
            </View>
          )}
          {listOfUsers.length > 0 &&
            listOfUsers.map((user) => (
              <View key={user.id}>
                <UserCard user={user} customHandle={mencionUser} />
              </View>
            ))}

          {/* Barra inferior con íconos */}
          <View className="flex flex-row justify-end px-10 border-t-2 border-gray-300 ">
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{ backgroundColor: "#1DA1F2" }}
              textColor={colorScheme === "dark" ? "white" : "black"}
              className="mb-4 mt-1"
            >
              Publicar
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View className="flex-1 ">
        <SnackBarComponent
          visible={visible}
          action={() => setVisible(false)}
          message={message}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateTweetScreen;
