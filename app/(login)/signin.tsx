import { useRouter } from "expo-router";
import { View, Text, Image, SafeAreaView, TextInput } from "react-native";
import { Button } from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useContext, useState } from "react";
import { UserContext } from "@/context/context";
import { auth } from "@/services/config";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { fetch_to } from "@/utils/fetch";
import Loading from "@/components/Loading";
import SnackBarComponent from "@/components/Snackbar";
import { LoginWithEmailAndPassword } from "@/utils/login";

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const userContext = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userContext) {
    throw new Error("UserContext is null");
  }

  const { saveUser } = userContext;
  const router = useRouter();

  const handleLogin = async () => {
    const currentUser = await LoginWithEmailAndPassword(email, password);
    if (currentUser) {
      saveUser(currentUser);
      setMessage("Bienvenid@ a TwitSnap " + currentUser.name);
      setVisible(true);
      router.replace("/(feed)");
    } else {
      setMessage("Error al obtener el usuario ");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center h-full w-full">
        <Loading />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-800 justify-center">
      <View className="items-center">
        <Image
          source={require("@/assets/images/twitsnap-logo.webp")}
          className="h-64 w-64 rounded-full mb-12 mt-16"
        />
        <Text className="text-4xl text-black dark:text-white font-bold mb-6">
          Iniciar sesión
        </Text>
      </View>

      <View className="px-8">
        {loading && <Loading />}
        <TextInput
          placeholder="Email"
          placeholderTextColor={colorScheme === "dark" ? "#fff" : "#000"}
          id="email"
          onChangeText={setEmail}
          className="bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full"
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={colorScheme === "dark" ? "#fff" : "#000"}
          secureTextEntry={true}
          id="password"
          onChangeText={setPassword}
          className="bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full"
        />
      </View>

      <View className="px-8">
        <Button
          mode="contained"
          onPress={handleLogin}
          style={{ backgroundColor: "#1DA1F2" }}
          className="mb-4"
        >
          Iniciar sesión
        </Button>
      </View>
      <View className="flex-1 ">
        <Button
          mode="text"
          onPress={() => router.push("./resetPassword")}
          className="mb-4"
        >
          Restablecer contraseña
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
