import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { UserContext } from "@/context/context";
import { auth } from "@/utils/config";
import { fetch_to } from "@/utils/fetch";
import { List, Snackbar } from "react-native-paper";
import * as Yup from "yup";
import { Formik, FormikErrors } from "formik";
import Input from "@/components/Input";
import { countriesList, getCountryNameByCode } from "@/utils/countries";

interface SignUpValues {
  email: string;
  password: string;
  name: string;
  username: string;
  country: string;
}

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const userContext = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedId, setExpandedId] = useState<string | number | undefined>(
    undefined
  );
  const [initialCountry, setInitialCountry] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] =
    useState(initialCountry);
  const [selectedCountry, setSelectedCountry] = useState(
    initialCountry ? getCountryNameByCode(initialCountry) : "Nacionalidad"
  );

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
      .min(3, "El nombre debe tener al menos tres caracteres")
      .required("El nombre es obligatorio"),
    username: Yup.string()
      .min(3, "El nombre de usuario debe tener al menos tres caracteres")
      .required("El nombre de usuario es obligatorio"),
    country: Yup.string().required("Por favor, seleccione un país"), // Add validation for country
  });

  const startedAt = new Date().getTime();
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

  async function handleSignUp(
    { email, password, username, name, country }: SignUpValues,
    setSubmitting: (isSubmitting: boolean) => void,
    validateForm: (values: SignUpValues) => Promise<FormikErrors<SignUpValues>>,
    setErrors: (errors: FormikErrors<SignUpValues>) => void,
    setTouched: (touched: Record<string, boolean>) => void
  ) {
    try {
      setSubmitting(true);

      const errors = await validateForm({
        email,
        password,
        username,
        name,
        country,
      });

      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        setTouched({
          email: true,
          password: true,
          username: true,
          name: true,
          country: true,
        }); // Mark fields as touched
        setSubmitting(false);
        return;
      }

      const user = await signup(email, password);
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
            location: selectedCountryCode,
          }
        );
        const final = Math.floor((new Date().getTime() - startedAt) / 1000);
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
          fetch_to(
            `https://api-gateway-ccbe.onrender.com/metrics/register`,
            "POST",
            {
              success: true,
              method: "email",
              loginTime: final,
              location: data.location,
            }
          ).then((r) => console.log());

          setMessage("Bienvenid@ a TwitSnap " + name);
          setVisible(true);
          router.replace("/(feed)");
        } else {
          fetch_to(
            `https://api-gateway-ccbe.onrender.com/metrics/register`,
            "POST",
            {
              success: false,
              method: "email",
              loginTime: final,
              location: selectedCountryCode,
            }
          ).then((r) => console.log(r.json().then((a) => console.log(a))));

          setMessage("Error al crear el usuario " + response.status);
        }
      }
    } catch (error) {
      console.error("failed to sign up:", error);
    }
  }

  const handleCountry = (country: string) => {
    setSelectedCountryCode(country);
    setSelectedCountry(getCountryNameByCode(country));
    setExpandedId(undefined); // close the accordion after selection
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-800 justify-center">
      {/* <ScrollView className="mt-10"> */}
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
        initialValues={{
          email: "",
          password: "",
          username: "",
          name: "",
          country: "",
        }}
        validationSchema={signUpSchema}
        onSubmit={() => console.log()}
      >
        {({
          errors,
          touched,
          handleChange,
          handleBlur,
          values,
          setFieldValue,
          setErrors,
          setTouched,
          setSubmitting,
          validateForm,
        }) => (
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

            <View
              className={`${
                expandedId
                  ? "rounded-none rounded-t-3xl rounded-b-3xl"
                  : "rounded-full"
              } overflow-hidden`}
            >
              <List.AccordionGroup
                expandedId={expandedId}
                onAccordionPress={(newExpandedId) => {
                  setExpandedId(
                    newExpandedId === expandedId ? undefined : newExpandedId
                  );
                }}
              >
                <List.Accordion
                  style={{
                    backgroundColor:
                      touched.country && errors.country
                        ? "#fef2f2"
                        : colorScheme === "dark"
                        ? "#374151"
                        : "#f3f4f6",
                    paddingLeft: 12,
                    height: 50,
                  }}
                  title={values.country || "Select your country"}
                  titleStyle={{
                    color:
                      touched.country && errors.country
                        ? "red"
                        : colorScheme === "dark"
                        ? "#ccc"
                        : "#888",
                    fontSize: 15,
                  }}
                  id="1"
                >
                  <ScrollView className="h-40">
                    {countriesList.map((country) => (
                      <List.Item
                        style={{ paddingLeft: 10 }}
                        className="bg-gray-700"
                        key={country.code}
                        title={country.name}
                        titleStyle={{
                          color: colorScheme === "dark" ? "#ccc" : "#888",
                        }}
                        onPress={() => {
                          setFieldValue("country", country.name); // Update Formik's state
                          handleCountry(country.code); // Update local state
                        }}
                      />
                    ))}
                  </ScrollView>
                </List.Accordion>
              </List.AccordionGroup>
            </View>

            {/* Display Country Validation Errors */}
            {touched.country && errors.country && (
              <Text className="text-red-500 mt-1 ml-4">{errors.country}</Text>
            )}

            <View className="mt-5">
              <TouchableOpacity
                className="mb-4 mt-5"
                onPress={() =>
                  handleSignUp(
                    values,
                    setSubmitting,
                    validateForm,
                    setErrors,
                    setTouched
                  )
                }
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
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
