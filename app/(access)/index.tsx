import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/context";
import { auth } from "@/utils/config";
import { fetch_to } from "@/utils/fetch";
import { FindUserByEmail } from "@/utils/login";
import Loading from "@/components/Loading";
import { NotificationContext } from "@/context/NotificationContext";
import * as LocalAuthentication from "expo-local-authentication";
import SnackBarComponent from "@/components/Snackbar";
import { Dialog, Portal, Text as PaperText, Button } from "react-native-paper";

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
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  if (!userContext) {
    throw new Error("UserContext is null");
  }
  const { saveUser } = userContext;

  if (!notificationContext) {
    throw new Error("NotificationContexr is null");
  }
  const { saveUnseenNotifications } = notificationContext;

  async function biometricAuth() {
    try {
      const hasBiometricAuth = await LocalAuthentication.hasHardwareAsync();

      if (!hasBiometricAuth) {
        console.log("No biometric hardware found");
        handleLogin();
        return;
      }

      const biometricRecords = await LocalAuthentication.isEnrolledAsync();
      if (!biometricRecords) {
        console.log("No biometric records found");
        handleLogin();
        return;
      }

      // Intentar autenticar hasta 3 veces
      let authenticated = false;
      for (let i = 0; i < 3; i++) {
        const result = await LocalAuthentication.authenticateAsync();
        if (result.success) {
          authenticated = true;
          handleLogin();
          break;
        }
      }

      if (!authenticated) {
        setMessage("Error al autenticar la huella");
        setVisible(true);
      }
    } catch (error) {
      console.error("Error en la autenticación biométrica:", error);
    }
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      let user = auth().currentUser;
      if (user) {
        if (!user.emailVerified) {
          alert("Por favor, verifica tu correo electrónico");
          await user.sendEmailVerification();
          setLoading(false);
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
      setLoading(false);
      if (error instanceof Error) {
        setMessage(error.message);
        showDialog();
      }
    }
  };

  useEffect(() => {
    if (user_auth) {
      biometricAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const startDate = new Date().getTime();

  const signInWithGoogle = async () => {
    try {
      setIsInProgress(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const final = Math.floor((new Date().getTime() - startDate) / 1000);

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
            fetch_to(
              `https://api-gateway-ccbe.onrender.com/metrics/login`,
              "POST",
              {
                success: true,
                method: "google",
                loginTime: final,
                location: userContext.user?.location,
              }
            ).then((r) => console.log());
            router.replace("/(feed)");
          } else {
            router.push({
              pathname: "./info",
              params: {
                email: result.email,
                startDate: startDate,
              },
            });
          }
        }
      } else {
        fetch_to(
          `https://api-gateway-ccbe.onrender.com/metrics/login`,
          "POST",
          {
            success: false,
            method: "google",
            loginTime: final,
            location: userContext.user?.location,
          }
        ).then((r) => console.log());

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
          className="h-64 w-64 rounded-full mb-12 mt-12"
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

      <View className="flex-row justify-center space-x-10">
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Light}
          onPress={signInWithGoogle}
          disabled={isInProgress}
        />
        {user_auth && (
          <TouchableOpacity onPress={() => biometricAuth()}>
            <Image
              source={require("@/assets/images/fingerprint.png")}
              className="h-10 w-10"
            />
          </TouchableOpacity>
        )}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Title>Oops...</Dialog.Title>
            <Dialog.Content>
              <PaperText variant="bodyMedium">{message}</PaperText>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Close</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
