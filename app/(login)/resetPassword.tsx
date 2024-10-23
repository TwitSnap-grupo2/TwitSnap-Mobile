import { View, Text, Image, SafeAreaView, TextInput } from "react-native";
import { Button } from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useState } from "react";
import { auth } from "@/services/config";
import { sendPasswordResetEmail } from "firebase/auth";
import Loading from "@/components/Loading";
import SnackBarComponent from "@/components/Snackbar";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function resetPassword() {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert(
          "Se ha enviado un correo electrónico para restablecer la contraseña"
        );
        router.replace("../(login)/signin");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setMessage(errorCode + " " + errorMessage);
        setVisible(true);
      });
  }

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
          Restablecer Contraseña
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
      </View>

      <View className="px-8">
        <Button
          mode="contained"
          onPress={resetPassword}
          style={{ backgroundColor: "#1DA1F2" }}
          className="mb-4"
        >
          Enviar mail de recuperación
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