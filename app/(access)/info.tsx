import Loading from "@/components/Loading";
import SnackBarComponent from "@/components/Snackbar";
import { UserContext } from "@/context/context";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { fetch_to } from "@/utils/fetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
// import { TextInput } from "react-native-paper";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Button } from "react-native-paper";

export default function InfoScreen() {
  const router = useRouter();
  const { email, startDate } = useLocalSearchParams();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  const { saveUser } = userContext;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  async function handleSignUp() {
    try {
      setLoading(true);
      const response = await fetch_to(
        "https://api-gateway-ccbe.onrender.com/users/signup",
        "POST",
        {
          email: email,
          password: "",
          user: username,
          name: name,
        }
      );
      const final = Math.floor(new Date().getTime() - Number(startDate));

      if (response.status === 201) {
        // fetch_to(
        //   `https://api-gateway-ccbe.onrender.com/metrics/register`,
        //   "POST",
        //   {
        //     success: true,
        //     method: "google",
        //     registrationTime: final,
        //     location: userContext.user?.location,
        //   }
        // ).then((r) => console.log());

        const data = await response.json();
        saveUser({
          id: data.id,
          name: name,
          user: username,
          email: email.toString(),
          avatar: `https://robohash.org/${data.id}.png`,
          followers: 0,
          following: 0,
        });
        setMessage("Bienvenid@ a TwitSnap " + name);
        setVisible(true);
        router.replace("/(feed)");
      } else {
        setMessage("Error al crear el usuario " + response.status);
      }
    } catch (error) {
      console.error("failed to sign up:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-800 justify-center">
      <View className="items-center">
        <Image
          source={require("@/assets/images/twitsnap-logo.webp")}
          className="h-64 w-64 rounded-full mb-12 mt-16"
        />
        <Text className="text-4xl text-black dark:text-white font-bold mb-6">
          Registrarse
        </Text>
      </View>

      <View className="px-8">
        {loading && <Loading />}
        <TextInput
          placeholder="Nombre"
          placeholderTextColor={colorScheme === "dark" ? "#fff" : "#000"}
          id="name"
          onChangeText={setName}
          className="bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full"
        />
        <TextInput
          placeholder="Nombre de usuario"
          placeholderTextColor={colorScheme === "dark" ? "#fff" : "#000"}
          id="username"
          onChangeText={setUsername}
          className="bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full"
        />
      </View>

      <View className="px-8">
        <Button
          mode="contained"
          onPress={handleSignUp}
          style={{ backgroundColor: "#1DA1F2" }}
          className="mb-4"
        >
          Registrarse
        </Button>
      </View>

      <View className="flex-1 ">
        <SnackBarComponent
          visible={visible}
          action={() => setVisible(false)}
          message={message}
        />
      </View>
    </SafeAreaView>
  );
}
