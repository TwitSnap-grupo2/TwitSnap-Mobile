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
import * as Linking from "expo-linking";

export default function Twit() {
  const url = Linking.useURL();

  const router = useRouter();
  const { id, twit } = useLocalSearchParams();
  const [tweet, setTweet] = useState<Tweet | {}>(
    twit ? (JSON.parse(twit as string) as Tweet) : {}
  );
  const [responses, setResponses] = useState(Array<Tweet>);
  const [visible, setVisible] = useState(false);
  const [messageSnack, setMessageSnack] = useState("");
  const [messageResponse, setMessageResponse] = useState("");
  const [inputExpanded, setInputExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  if (!userContext) {
    router.replace("/(login)/signin");
    return;
  }
  const currentUser = userContext.user;
  if (!currentUser) {
    router.replace("/(login)/signin");
    return;
  }

  async function getTwit(idTwit?: string) {
    setLoading(true);
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/${idTwit}`,
      "GET"
    );
    if (response.status != 200) {
      console.log("Error al obtener twit");
      setMessageSnack("Error al obtener twit");
      setVisible(true);
      setLoading(false);
      return;
    }
    const data = await response.json();
    //@ts-ignore
    const mapped = await mappedTwits([data], currentUser);
    setTweet(mapped[0]);
    fetchResponses();
  }

  async function fetchResponses(twitId?: string) {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/${
        twitId ? twitId : id
      }/replies`,
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
    if (id && twit) {
      fetchResponses();
    }
  }, []);

  useEffect(() => {
    if (id && !twit) {
      getTwit(id as string);
    }
  }, [id]);

  useEffect(() => {
    if (url) {
      const { hostname, path, queryParams } = Linking.parse(url);
      console.log(
        `linked to app with hostname: ${hostname}, path: ${path} and queryParams: ${JSON.stringify(
          queryParams
        )}`
      );
      getTwit(path?.split("/")[1]);
    }
  }, [url]);

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
          initialTweet={tweet}
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
              fontSize: 18,
              borderColor: inputExpanded ? "#0068ff" : "#ddd",
              borderBottomWidth: 1,
              padding: inputExpanded ? 20 : 0,
            }}
            className={
              inputExpanded ? "dark:bg-black bg-white" : "bg-transparent"
            }
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
