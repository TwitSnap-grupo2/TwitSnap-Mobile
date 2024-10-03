import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { UserContext } from "@/context/context";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/services/config";
import { fetch_to } from "@/utils/fetch";
import { Snackbar } from "react-native-paper";

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const userContext = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  if (!userContext) {
    throw new Error("UserContext is null");
  }

  const { saveUser } = userContext;

  async function emailVerification() {
    try {
      const user = auth?.currentUser;
      if (!user) {
        throw new Error("User is null");
      }
      await sendEmailVerification(user);
    } catch (error) {
      console.error("failed to send email verification:", error);
    }
  }

  async function signup(email: string, pass: string) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      await emailVerification();
      const user = userCredentials.user;
      return user;
    } catch (error) {
      console.error("failed to sign up:", error);
    }
  }

  async function handleSignUp() {
    try {
      const user = await signup(email, password);
      if (user) {
        //guardo el user
        const response = await fetch_to(
          "https://api-gateway-ccbe.onrender.com/users/signup",
          "POST",
          {
            // @ts-ignore
            email: email,
            // @ts-ignore
            password: password,
            // @ts-ignore
            user: username,
            // @ts-ignore
            name: name,
          }
        );
        if (response.status === 201) {
          const data = await response.json();
          saveUser({
            id: data.id,
            name: name,
            user: username,
            email: email,
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
          className="h-64 w-64 rounded-full mb-12"
        />
        <Text className="text-4xl text-black dark:text-white font-bold mb-6">
          Registrarse
        </Text>
      </View>

      <View className="px-8">
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
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

      {errorMessage ? (
        <Text className="text-red-700 mb-12">{errorMessage}</Text>
      ) : null}

      <View className="px-8">
        <TouchableOpacity className="mb-4" onPress={handleSignUp}>
          <Text className="bg-blue-500 text-white text-center font-bold p-4 rounded-full">
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>
      <View className="px-8">
        <Snackbar
          visible={visible}
          onDismiss={() => {}}
          action={{
            label: "Cerrar",
            onPress: () => {
              setVisible(false);
            },
          }}
        >
          {message}
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}
