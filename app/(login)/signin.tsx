import { useRouter } from "expo-router";
import { View, Text, Image, SafeAreaView, TextInput } from "react-native";
import { Button } from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useContext, useState } from "react";
import { UserContext } from "@/context/context";
import Loading from "@/components/Loading";
import SnackBarComponent from "@/components/Snackbar";
import { LoginWithEmailAndPassword } from "@/utils/login";
import { Formik, FormikErrors } from "formik";
import * as Yup from "yup";
import Input from "@/components/Input";
import firestore, {
  addDoc,
  arrayUnion,
  collection,
  doc,
  orderBy,
  query,
  updateDoc,
} from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import { NotificationContext } from "@/context/NotificationContext";
import { fetch_to } from "@/utils/fetch";

interface loginValues {
  email: string;
  password: string;
}

interface Token {
  token: string;
}

export default function SignInScreen() {
  const userContext = useContext(UserContext);
  const notificationContext = useContext(NotificationContext);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  if (!notificationContext) {
    return;
  }

  const { saveUnseenNotifications } = notificationContext;

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

  const startDate = new Date().getTime();

  const handleLogin = async (
    { email, password }: loginValues,
    setSubmitting: (isSubmitting: boolean) => void,
    validateForm: (values: loginValues) => Promise<FormikErrors<loginValues>>,
    setErrors: (errors: FormikErrors<loginValues>) => void
  ) => {
    setSubmitting(true);

    const errors = await validateForm({ email, password });

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setSubmitting(false);
      return;
    }

    const currentUser = await LoginWithEmailAndPassword(email, password);
    const final = Math.floor((new Date().getTime() - startDate) / 1000); // its in ms, so we divide by 1000 to get seconds
    if (currentUser) {
      saveUser(currentUser);
      fetch_to(
        `https://api-gateway-ccbe.onrender.com/notifications/${currentUser.id}/unseen`,
        "GET"
      ).then((res) =>
        res.json().then((r) => saveUnseenNotifications(r["unseen"]))
      );

      fetch_to(`https://api-gateway-ccbe.onrender.com/metrics/login`, "POST", {
        success: true,
        method: "email",
        loginTime: final,
        location: currentUser.location,
      }).then((res) => res.json().then((r) => console.log("R: ", r)));

      setMessage("Bienvenid@ a TwitSnap " + currentUser.name);
      setVisible(true);
      setSubmitting(false);
      const userDeviceRef = firestore()
        .collection("userDevices")
        .doc(currentUser.id);

      const devices = (await userDeviceRef.get()).data();
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      const token = await messaging().getToken();

      if (!devices || !devices["devices"].includes(token)) {
        await userDeviceRef.set(
          { devices: firestore.FieldValue.arrayUnion(token) },
          { merge: true } // merge with existing data
        );
      }
      router.replace("/(feed)");
    } else {
      fetch_to(`https://api-gateway-ccbe.onrender.com/metrics/login`, "POST", {
        success: false,
        method: "email",
        loginTime: final,
        location: userContext.user?.location,
      }).then((r) => console.log());

      setVisible(true);
      setSubmitting(false);
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
          onSubmit={() => console.log()}
          validateOnBlur={true}
          validateOnChange={true}
        >
          {({
            errors,
            touched,
            handleChange,
            handleBlur,
            values,
            isSubmitting,
            setSubmitting,
            validateForm,
            setErrors,
          }) => (
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
                onPress={() => {
                  handleLogin(values, setSubmitting, validateForm, setErrors);
                }}
                style={{ backgroundColor: "#1DA1F2" }}
                className="mb-4 mt-1 p-1 rounded-full"
              >
                {isSubmitting ? "Logging in..." : "Iniciar sesión"}
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
