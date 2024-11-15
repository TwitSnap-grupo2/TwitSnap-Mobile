import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
// import statusCodes along with GoogleSignin
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/context";
import { auth } from "@/utils/config";
import { fetch_to } from "@/utils/fetch";
import { FindUserByEmail } from "@/utils/login";
import Loading from "@/components/Loading";
import {
  NotificationContext,
  UnseenNotificationsProvider,
} from "@/context/NotificationContext";

GoogleSignin.configure({
  webClientId:
    "51208642510-ee5d1iurrlbvvrp8nqm6jvvishpk3708.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export default function HomeScreen() {
  const [isInProgress, setIsInProgress] = useState(false);
  const router = useRouter();
  const user_auth = auth().currentUser;
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext);
  const notificationContext = useContext(NotificationContext);

  if (!userContext) {
    throw new Error("UserContext is null");
  }
  const { saveUser } = userContext;

  if (!notificationContext) {
    throw new Error("NotificationContexr is null");
  }
  const { saveUnseenNotifications } = notificationContext;

  const handleLogin = async () => {
    setLoading(true);
    try {
      let user = auth().currentUser;
      if (user) {
        if (!user.emailVerified) {
          alert("Por favor, verifica tu correo electrónico");
          return;
        }

        const currentUser = await FindUserByEmail(user.email);
        if (currentUser) {
          saveUser(currentUser);
          fetch_to(
            `https://api-gateway-ccbe.onrender.com/notifications/${currentUser.id}/unseen`,
            "GET"
          ).then((res) =>
            res.json().then((r) => {
              console.log("🚀 ~ res.json ~ r:", r);
              saveUnseenNotifications(r["unseen"]);
            })
          );
          router.replace("/(feed)");
        } else {
          router.replace("/(login)");
          // alert("Error al obtener el usuario " + user.email);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log("failed to log in:", error);
    }
  };

  useEffect(() => {
    if (user_auth) {
      handleLogin();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsInProgress(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response.data) {
        if (!response.data.idToken) {
          console.log("No idToken found in response");
          return;
        }
        const googleCredential = auth.GoogleAuthProvider.credential(
          response.data.idToken
        );
        if (!googleCredential) {
          console.log("No googleCredential found");
          return;
        }
        const res = await auth().signInWithCredential(googleCredential);
        if (!res.user) {
          console.log("No user found in response");
          return;
        }
        const result = auth().currentUser;
        if (result) {
          setLoading(true);
          const currentUser = await FindUserByEmail(result.email);
          setIsInProgress(false);
          if (currentUser) {
            saveUser(currentUser);
            fetch_to(
              `https://api-gateway-ccbe.onrender.com/notifications/${currentUser.id}/unseen`,
              "GET"
            ).then((res) =>
              res.json().then((r) => saveUnseenNotifications(r["unseen"]))
            );
            router.replace("/(feed)");
          } else {
            router.push({
              pathname: "./info",
              params: {
                email: result.email,
              },
            });
          }
        }
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
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
          className="h-64 w-64 rounded-full mb-12"
        />
        <Text className="text-4xl text-black dark:text-white font-bold mb-6">
          Hola!
        </Text>
        <Text className="text-lg text-gray-500 text-center">
          Bienvenido a TwitSnap,
        </Text>
        <Text className="text-lg text-gray-500 text-center mb-6">
          la conexión al mundo
        </Text>
      </View>

      <View className="px-8">
        <TouchableOpacity
          className="mb-4"
          onPress={() => router.push("../(login)/signin")}
        >
          <Text className="bg-blue-500 text-white text-center font-bold p-4 rounded-full">
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-6 border-opacity-100 border-black"
          onPress={() => router.push("../(login)/signup")}
        >
          <Text className="bg-gray-100 dark:bg-white text-black text-center font-bold p-4 rounded-full">
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg text-gray-500 text-center mb-6">Unirse con</Text>

      <View className="flex-row justify-center">
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Light}
          onPress={signInWithGoogle}
          disabled={isInProgress}
        />
      </View>
    </SafeAreaView>
  );
}
