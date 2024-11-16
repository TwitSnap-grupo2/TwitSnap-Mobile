import Loading from "@/components/Loading";
import SnackBarComponent from "@/components/Snackbar";
import { UserContext } from "@/context/context";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { fetch_to } from "@/utils/fetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import * as Yup from "yup";

// import { TextInput } from "react-native-paper";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Button, List } from "react-native-paper";
import {
  countriesList,
  getCountryCodeByName,
  getCountryNameByCode,
} from "@/utils/countries";
import { Formik, FormikErrors } from "formik";
import Input from "@/components/Input";

interface SignUpValues {
  name: string;
  username: string;
  country: string;
}

export default function InfoScreen() {
  const router = useRouter();
  const { email, startDate } = useLocalSearchParams();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  const { saveUser } = userContext;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const [accordionIsExpanded, setAccordionIsExpanded] = useState(false);
  const [expandedId, setExpandedId] = useState<string | number | undefined>(
    undefined
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Nacionalidad");

  const signUpSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "El nombre debe tener al menos tres caracteres")
      .required("El nombre es obligatorio"),
    username: Yup.string()
      .min(3, "El nombre de usuario debe tener al menos tres caracteres")
      .required("El nombre de usuario es obligatorio"),
    country: Yup.string().required("Por favor, seleccione un país"),
  });

  async function handleSignUp(
    { username, name, country }: SignUpValues,
    setSubmitting: (isSubmitting: boolean) => void,
    validateForm: (values: SignUpValues) => Promise<FormikErrors<SignUpValues>>,
    setErrors: (errors: FormikErrors<SignUpValues>) => void,
    setTouched: (touched: Record<string, boolean>) => void
  ) {
    try {
      setSubmitting(true);

      const errors = await validateForm({
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

      setLoading(true);
      const response = await fetch_to(
        "https://api-gateway-ccbe.onrender.com/users/signup",
        "POST",
        {
          email: email,
          password: "",
          user: username,
          name: name,
          location: getCountryCodeByName(country),
        }
      );

      const final = Math.floor((Date.now() - Number(startDate)) / 1000);
      if (response.status === 201) {
        fetch_to(
          `https://api-gateway-ccbe.onrender.com/metrics/register`,
          "POST",
          {
            success: true,
            method: "google",
            registrationTime: final,
            location: getCountryCodeByName(country),
          }
        ).then((r) => console.log());

        const data = await response.json();
        saveUser({
          id: data.id,
          name: name,
          user: username,
          email: email.toString(),
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
        console.log("Error al crear el usuario", response.status);
        setMessage("Error al crear el usuario " + response.status);
      }
    } catch (error) {
      console.error("failed to sign up:", error);
    }
  }

  const handleCountry = (country: string) => {
    setSelectedCountryCode(country);
    setSelectedCountry(getCountryNameByCode(country));
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-800 justify-center">
      <View className="items-center">
        <Image
          source={require("@/assets/images/twitsnap-logo.webp")}
          className="h-64 w-64 rounded-full mb-12 mt-16"
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
