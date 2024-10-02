import {
  TextInput,
  Button,
  Avatar,
  IconButton,
  Snackbar,
} from "react-native-paper";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { UserContext } from "@/context/context";
import { auth } from "@/services/config";
import { fetch_to } from "@/utils/fetch";

const CreateTweetScreen = () => {
  const [tweet, setTweet] = useState("");
  const router = useRouter();
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function handleSubmit() {
    try {
      const response = await fetch_to(
        "https://api-gateway-ccbe.onrender.com/twits/",
        "POST",
        {
          message: tweet,
          // @ts-ignore
          createdBy: user.id,
        }
      );

      if (response.status === 201) {
        setMessage("Twit snapeado correctamente");
        setVisible(true);
        router.replace("/(feed)");
      } else {
        setMessage("Error al crear el usuario " + response.status);
      }
    } catch (error) {
      console.error("failed to sign up:", error);
    }

    // Navegar de vuelta al feed después de crear el tweet
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex flex-1 bg-white dark:bg-black"
    >
      <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
        {/* Botón de cerrar */}
        <TouchableOpacity onPress={() => router.back()}>
          <IconButton icon="close" size={24} />
        </TouchableOpacity>
      </View>

      <View
        style={{ flexDirection: "row", paddingHorizontal: 10, paddingTop: 20 }}
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
          onChangeText={setTweet}
          style={{
            flex: 1,
            marginLeft: 10,
            color: "white",
            fontSize: 18,
            backgroundColor: "transparent",
            marginBottom: 100,
          }}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
        />
      </View>

      {/* Barra inferior con íconos */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 0,
          paddingHorizontal: 10,
          borderTopWidth: 1,
          borderTopColor: "#333",
        }}
      >
        {/* Íconos de la barra inferior */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton icon="image" size={30} onPress={() => {}} />
        </View>
      </View>
      <View className="px-8">
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={{ backgroundColor: "#1DA1F2" }}
          className="mb-4"
        >
          Publicar
        </Button>
        <Snackbar
          visible={visible}
          onDismiss={() => {}}
          action={{
            label: "X",
            onPress: () => {
              setVisible(false);
            },
          }}
        >
          {message}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateTweetScreen;
