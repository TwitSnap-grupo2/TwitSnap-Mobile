import Loading from "@/components/Loading";
import SnackBarComponent from "@/components/Snackbar";
import TweetComponent from "@/components/TwitSnap";
import { UserContext } from "@/context/context";
import { Tweet } from "@/types/tweets";
import { fetch_to } from "@/utils/fetch";
import { mappedTwits } from "@/utils/mappedTwits";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Snackbar } from "react-native-paper";

export default function Twit() {
  const router = useRouter();
  const { id, twit } = useLocalSearchParams();
  const [responses, setResponses] = useState(Array<Tweet>);
  const [visible, setVisible] = useState(false);
  const [messageSnack, setMessageSnack] = useState("");
  const [messageResponse, setMessageResponse] = useState("");
  const [inputExpanded, setInputExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  const currentUser = userContext.user;
  if (!currentUser) {
    throw new Error("UserContext.user is null");
  }

  async function fetchResponses() {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/${id}/replies`,
      "GET"
    );
    if (response.status != 200) {
      setMessageSnack("Error al obtener respuestas");
      return;
    }
    const data = await response.json();

    setResponses([]);
    // @ts-ignore
    const mappedTweets = await mappedTwits(data, currentUser);
    setResponses(mappedTweets);
    setLoading(false);
  }

  async function handleResponse() {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/${id}/reply`,
      "POST",
      {
        message: messageResponse,
        // @ts-ignore
        createdBy: currentUser.id,
      }
    );
    if (response.status != 201) {
      setMessageSnack("Error al publicar respuesta");
      setVisible(true);
      return;
    }
    setVisible(true);
    setMessageSnack("Respuesta publicada correctamente");
    setTimeout(() => {
      setVisible(false);
    }, 2000);
    fetchResponses();
  }

  useEffect(() => {
    fetchResponses();
  }, []);

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
      style={{ flex: 1 }}
      className="bg-white dark:bg-black"
    >
      <View className="mt-2 px-2">
        <TweetComponent
          //@ts-ignore
          initialTweet={JSON.parse(twit) as Tweet}
          shareTweet={() => {}}
        />
        <Text className="py-4">Respuestas más relevantes</Text>
        {responses.map((response: Tweet) => (
          <TweetComponent
            key={response.id}
            initialTweet={response}
            shareTweet={() => {}}
            isResponse
          />
        ))}
      </View>

      {/* Contenedor del TextInput en la parte inferior */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 10,
          backgroundColor: inputExpanded ? "white" : "transparent",
        }}
      >
        <TouchableOpacity
          onPress={() => setInputExpanded(true)}
          activeOpacity={1}
        >
          <TextInput
            placeholder="Agrega una respuesta"
            placeholderTextColor="#aaa"
            multiline
            value={messageResponse}
            onChangeText={setMessageResponse}
            style={{
              flex: 1,
              color: "#000",
              fontSize: 18,
              backgroundColor: inputExpanded ? "white" : "transparent",
              borderColor: inputExpanded ? "#0068ff" : "#ddd",
              borderBottomWidth: 1,
              padding: inputExpanded ? 20 : 0,
            }}
            onFocus={() => setInputExpanded(true)}
          />
        </TouchableOpacity>

        {/* Botón de enviar respuesta */}
        {inputExpanded && (
          <Button
            mode="contained"
            style={{ backgroundColor: "#1DA1F2", marginTop: 8 }}
            onPress={() => {
              handleResponse();
              setInputExpanded(false);
              setMessageResponse("");
            }}
          >
            Responder
          </Button>
        )}
      </View>
      <View className="flex-1">
        <SnackBarComponent
          visible={visible}
          message={messageSnack}
          action={() => setVisible(false)}
        ></SnackBarComponent>
      </View>
    </KeyboardAvoidingView>
  );
}
