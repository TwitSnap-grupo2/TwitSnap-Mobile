import { useRouter } from "expo-router";
import { View, Text, Image, SafeAreaView, TextInput } from "react-native";
import { Button, HelperText } from "react-native-paper";
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
import { Formik, FormikErrors, FormikHelpers } from "formik";
import * as Yup from "yup";

interface loginValues {
  email: string;
  password: string;
}

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const userContext = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userContext) {
    throw new Error("UserContext is null");
  }

  const { saveUser } = userContext;
  const router = useRouter();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Por favor, ingrese un email valido")
      .required("El email es obligatorio"),
    password: Yup.string().min(6).required("La contraseña es obligatoria"),
  });

  const handleLogin = async ({ email, password }: loginValues) => {
    const currentUser = await LoginWithEmailAndPassword(email, password);
    if (currentUser) {
      saveUser(currentUser);
      setMessage("Bienvenid@ a TwitSnap " + currentUser.name);
      setVisible(true);
      router.replace("/(feed)");
    } else {
      setVisible(true);
      setMessage("Credenciales incorrectas");
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
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched, handleChange, handleBlur, values }) => (
            <View className="flex">
              <View>
                <TextInput
                  placeholder="Email"
                  id="email"
                  onChangeText={handleChange("email")}
                  value={values.email}
                  onBlur={handleBlur("email")}
                  placeholderTextColor={
                    errors.email && touched.email
                      ? "#FF0000"
                      : colorScheme === "dark"
                      ? "#ccc"
                      : "#888"
                  }
                  className={`p-3 rounded-lg border ${
                    errors.email && touched.email
                      ? "border-red-500 bg-red-50 text-red-600" // Red border, light red background, and red text color for errors
                      : "border-transparent bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  } rounded-full`}
                />
                <View
                  style={{
                    minHeight: 15,
                    marginLeft: 11,
                    marginVertical: 1,
                  }}
                >
                  {errors.email && touched.email ? (
                    <Text className="mb-1 text-red-600 ">{errors.email}</Text>
                  ) : null}
                </View>
              </View>
              <View>
                <TextInput
                  placeholder="Contraseña"
                  secureTextEntry={true}
                  value={values.password}
                  id="password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholderTextColor={
                    errors.password && touched.password
                      ? "#FF0000"
                      : colorScheme === "dark"
                      ? "#ccc"
                      : "#888"
                  }
                  className={`p-3 rounded-lg border ${
                    errors.password && touched.password
                      ? "border-red-500 bg-red-50 text-red-600" // Red border, light red background, and red text color for errors
                      : "border-transparent bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  } rounded-full`}
                />
                <View
                  style={{ minHeight: 15, marginLeft: 11, marginVertical: 1 }}
                >
                  {errors.password && touched.password ? (
                    <Text className="mb-1 text-red-600">{errors.password}</Text>
                  ) : null}
                </View>
              </View>
              <Button
                mode="contained"
                onPress={() => handleLogin(values)}
                style={{ backgroundColor: "#1DA1F2" }}
                className="mb-4 mt-1 p-1 rounded-full"
              >
                Iniciar sesión
              </Button>
              <Button
                mode="contained"
                onPress={() => router.push("./resetPassword")}
                className="bg-slate-600 mb-4 p-1 rounded-full"
              >
                Restablecer contraseña
              </Button>
            </View>
          )}
        </Formik>
      </View>

      <View className="flex-1">
        <SnackBarComponent
          visible={visible}
          action={() => setVisible(false)}
          message={message}
        />
      </View>
    </SafeAreaView>
  );
}
