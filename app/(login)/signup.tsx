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
} from "firebase/auth";
import { auth } from "@/services/config";
import { fetch_to } from "@/utils/fetch";
import { Snackbar } from "react-native-paper";
import * as Yup from "yup";
import { Formik } from "formik";
import Input from "@/components/Input";

interface SignUpValues {
  email: string;
  password: string;
  name: string;
  username: string;
}

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
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
      const user = auth().currentUser;
      if (!user) {
        throw new Error("User is null");
      }
      await user.sendEmailVerification();
    } catch (error) {
      console.error("failed to send email verification:", error);
    }
  }

  const signUpSchema = Yup.object().shape({
    email: Yup.string()
      .email("Por favor, ingrese un email valido")
      .required("El email es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos seis caracteres")
      .required("La contraseña es obligatoria"),
    name: Yup.string()
      .min(3, "El nombre debe tener al menos seis caracteres")
      .required("El nombre es obligatorio"),
    username: Yup.string()
      .min(3, "El nombre de usuario debe tener al menos seis caracteres")
      .required("El nombre de usuario es obligatorio"),
  });

  async function signup(email: string, pass: string) {
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(
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

  async function handleSignUp({
    email,
    password,
    username,
    name,
  }: SignUpValues) {
    try {
      const user = await signup(email, password);
      console.log("user", user);
      if (user) {
        //guardo el user
        const response = await fetch_to(
          "https://api-gateway-ccbe.onrender.com/users/signup",
          "POST",
          {
            email: email,
            password: password,
            user: username,
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
            followers: data.followers,
            followeds: data.followeds,
            location: data.location,
            interests: data.interests,
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

      <Formik
        initialValues={{ email: "", password: "", username: "", name: "" }}
        validationSchema={signUpSchema}
        onSubmit={() => console.log()}
      >
        {({ errors, touched, handleChange, handleBlur, values }) => (
          <View className="px-8">
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

            <Input
              name="name"
              placeholder="Nombre"
              onChangeText={handleChange("name")}
              value={values.name}
              onBlur={handleBlur("name")}
              errorMessage={errors.name}
              isTouched={touched.name}
            />

            <Input
              name="username"
              placeholder="Nombre de usuario"
              onChangeText={handleChange("username")}
              value={values.username}
              onBlur={handleBlur("username")}
              errorMessage={errors.username}
              isTouched={touched.username}
            />

            <View className="mt-5">
              <TouchableOpacity
                className="mb-4"
                onPress={() => handleSignUp(values)}
              >
                <Text className="bg-blue-500 text-white text-center font-bold p-4 rounded-full">
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>

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
