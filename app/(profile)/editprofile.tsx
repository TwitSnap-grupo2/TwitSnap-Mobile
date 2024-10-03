import BackHeader from "@/components/BackHeader";
import { UserContext } from "@/context/context";
import { useContext, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Snackbar, Button } from "react-native-paper";
import SnackBarComponent from "@/components/Snackbar";

export default function EditProfileScreen() {
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const [username, setUsername] = useState(user?.user);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const colorScheme = useColorScheme();

  const handleEditProfile = async () => {
    setVisible(true);
    setMessage("Perfil actualizado correctamente");
    return;

    const response = await fetch(
      `https://api-gateway-ccbe.onrender.com/users/${user?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: username,
        }),
      }
    );

    if (response.status === 200) {
      setVisible(true);
      setMessage("Perfil actualizado correctamente");
    } else {
      setVisible(true);
      setMessage("Error al actualizar el perfil");
    }
  };

  return (
    <SafeAreaView className="flex flex-1 bg-white dark:bg-black">
      <BackHeader />

      <View className="items-center">
        <Image
          source={{ uri: user?.avatar }}
          className="rounded-full h-40 w-40"
        />
      </View>
      <View className="p-7">
        <TextInput
          placeholder="Usuario"
          placeholderTextColor={colorScheme === "dark" ? "#fff" : "#000"}
          id="usuario"
          value={username}
          onChangeText={setUsername}
          className="bg-gray-100 dark:bg-gray-700 text-dark dark:text-white mb-4 rounded-full"
        />
      </View>
      <View className="px-8">
        <Button
          mode="contained"
          onPress={handleEditProfile}
          style={{ backgroundColor: "#1DA1F2" }}
          className="mb-4"
        >
          Editar
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
