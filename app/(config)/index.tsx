import { useColorScheme } from "@/hooks/useColorScheme";
import { auth } from "@/utils/config";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, List, Menu } from "react-native-paper";
import Modal from "react-native-modal";
import { useState } from "react";
import ModalQuestion from "@/components/ModalQuestion";

export default function Configuracion() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  async function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        router.replace("../(access)");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  }

  function toggleModal() {
    setModalVisible(!isModalVisible);
  }

  return (
    <View className="flex-1 bg-white pl-4  dark:bg-black">
      {/* Menu con dos opciones */}
      <List.Section>
        <List.Item
          title="Twits Favoritos"
          left={() => <List.Icon icon="bookmark" />}
          onPress={() => router.push("../(favs)")}
        />
        <List.Item
          title="Cerrar Sesión"
          left={() => <List.Icon icon="logout" />}
          onPress={toggleModal}
        />
      </List.Section>

      <ModalQuestion
        question="¿Estás seguro de cerrar sesión?"
        isModalVisible={isModalVisible}
        cancelAction={toggleModal}
        confirmAction={handleSignOut}
      />
    </View>
  );
}
