import BackHeader from "@/components/BackHeader";
import { UserContext } from "@/context/context";
import { useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Snackbar, Button, Chip, List } from "react-native-paper";
import SnackBarComponent from "@/components/Snackbar";
import { fetch_to } from "@/utils/fetch";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import { router } from "expo-router";
import { countriesList, getCountryNameByCode } from "@/utils/countries";

function renderIcon(name: string): string {
  switch (name) {
    case "sports":
      return "sports-soccer";
    case "games":
      return "videogame-asset";
    case "science":
      return "science";
    case "politics":
      return "account-balance";
    case "engineering":
      return "engineering";
    default:
      return "help-outline";
  }
}

export default function EditProfileScreen() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  const user = userContext.user;
  if (!user) {
    throw new Error("UserContext.user is null");
  }
  const saveUser = userContext.saveUser;
  const [username, setUsername] = useState(user.name);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const colorScheme = useColorScheme();
  const [interests, setInterests] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  const [initialCountry, setInitialCountry] = useState(user.location);
  const [initialInterests, setInitialInterests] = useState(user.interests);
  const [selectedCountryCode, setSelectedCountryCode] =
    useState(initialCountry);
  const [selectedCountry, setSelectedCountry] = useState(
    initialCountry ? getCountryNameByCode(initialCountry) : "Nacionalidad"
  );
  const [selectedInterests, setSelectedInterests] =
    useState<string[]>(initialInterests);

  const toggleSelection = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  const handleCountry = (country: string) => {
    setSelectedCountryCode(country);
    setSelectedCountry(getCountryNameByCode(country));
  };

  const handleEditProfile = async () => {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/name/${user?.id}?name=${username}`,
      "PUT"
    );

    if (response.status != 200) {
      setVisible(true);
      setMessage(`Error al actualizar el usuario + ${response.status}`);
      return;
    }

    const responseLocation = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/location/${user?.id}`,
      "POST",
      {
        location: selectedCountryCode,
      }
    );
    if (responseLocation.status != 201) {
      setVisible(true);
      setMessage(
        `Error al actualizar la nacionalidad + ${responseLocation.status}`
      );
      return;
    }

    const newInterests = selectedInterests.filter(
      (i) => !initialInterests.includes(i)
    );
    const responseInterests = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/interests/${user?.id}`,
      "POST",
      newInterests
    );
    if (responseInterests.status != 201) {
      setVisible(true);
      setMessage(
        `Error al actualizar los intereses + ${responseInterests.status}`
      );
      return;
    }

    setVisible(true);
    saveUser({
      ...user,
      user: username,
      location: selectedCountryCode,
      interests: selectedInterests,
    });
    setMessage(`Perfil actualizado correctamente`);
    router.dismissAll();
    router.replace(`/(profile)/${user.id}`);
  };

  async function fetchInterests() {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/interests/`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      setLoading(false);
      setInterests(data);
    } else {
      console.error("Error al obtener los intereses", response.status);
    }
  }

  useEffect(() => {
    fetchInterests();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center h-full w-full">
        <Loading />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex flex-1 bg-white dark:bg-black">
      <View className="items-center mt-16">
        <Image
          source={{ uri: user?.avatar }}
          className="rounded-full h-20 w-20"
        />
      </View>
      <View className="p-7">
        <Text>Usario</Text>
        <TextInput
          placeholder="Usuario"
          placeholderTextColor={colorScheme === "dark" ? "#fff" : "#000"}
          id="usuario"
          value={username}
          onChangeText={setUsername}
          className="bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full"
        />
        <Text>Intereses</Text>
        <View className="flex-row flex-wrap">
          {interests.map((interest) => (
            <Chip
              key={interest}
              className="w-30 m-1"
              icon={() =>
                selectedInterests.includes(interest) ? (
                  <MaterialIcons name="check" size={20} />
                ) : (
                  <MaterialIcons
                    name={
                      renderIcon(
                        interest
                      ) as keyof typeof MaterialIcons.glyphMap
                    }
                  />
                )
              }
              onPress={() => toggleSelection(interest)}
            >
              {interest}
            </Chip>
          ))}
        </View>

        <Text className="mt-2">Nacionalidad</Text>
        <View>
          <List.AccordionGroup>
            <List.Accordion title={selectedCountry} id="1">
              <ScrollView className="h-40">
                {countriesList.map((country) => (
                  // @ts-ignore
                  <List.Item
                    // @ts-ignore
                    key={country.code}
                    // @ts-ignore
                    title={country.name}
                    // @ts-ignore
                    onPress={() => handleCountry(country.code)}
                  />
                ))}
              </ScrollView>
            </List.Accordion>
          </List.AccordionGroup>
        </View>
      </View>
      <View className="px-8">
        <Button
          mode="contained"
          onPress={handleEditProfile}
          style={{ backgroundColor: "#1DA1F2" }}
          className="mb-4"
        >
          Guardar
        </Button>
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
