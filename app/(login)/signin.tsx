import { useRouter } from "expo-router";
import { View, Text, Image, SafeAreaView, TextInput } from "react-native";
import { Button } from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useContext, useState } from "react";
import { UserContext } from "@/context/context";
import Loading from "@/components/Loading";
import SnackBarComponent from "@/components/Snackbar";
import { LoginWithEmailAndPassword } from "@/utils/login";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "@/components/Input";

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
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos seis caracteres")
      .required("La contraseña es obligatoria"),
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
              <Input
                name="email"
                placeholder="Email"
                onChangeText={handleChange("email")}
                value={values.email}
                onBlur={handleBlur("email")}
                errorMessage={errors.email}
                isTouched={touched.email}
              />
              <Input
                name="password"
                placeholder="Password"
                onChangeText={handleChange("password")}
                value={values.password}
                onBlur={handleBlur("password")}
                errorMessage={errors.password}
                isTouched={touched.password}
              />
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
