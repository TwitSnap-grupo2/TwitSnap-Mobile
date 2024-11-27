import { useColorScheme } from "@/hooks/useColorScheme";
import { auth } from "@/utils/config";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, List, Menu } from "react-native-paper";
import Modal from "react-native-modal";
import { useState } from "react";

export default function Configuracion() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  async function handleSignOut() {
    setModalVisible(true);
    // auth()
    //   .signOut()
    //   .then(() => {
    //     router.replace("../(access)");
    //   })
    //   .catch((error) => {
    //     console.error("Error al cerrar sesión:", error);
    //   });
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
          onPress={() => console.log("Eliminar cuenta")}
        />
        <List.Item
          title="Cerrar Sesión"
          left={() => <List.Icon icon="logout" />}
          onPress={handleSignOut}
        />
      </List.Section>

      <Modal isVisible={isModalVisible}>
        <View className="bg-white rounded-lg p-5 items-center">
          <Text className="text-lg font-semibold text-gray-800">
            ¿Estás seguro de realizar esta acción?
          </Text>

          {/* Acciones dentro del modal */}
          <View className="flex-row mt-4 space-x-2">
            <TouchableOpacity
              onPress={() => {
                console.log("Acción confirmada");
                toggleModal();
              }}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              <Text className="text-gray-800 font-medium">Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleModal}
              className="px-4 py-2 bg-blue-500 rounded-lg mr-2"
            >
              <Text className="text-white font-medium">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <Button
        mode="contained"
        onPress={handleSignOut}
        textColor={colorScheme === "dark" ? "white" : "black"}
        style={{ backgroundColor: "#1DA1F2" }}
      >
        Cerrar Sesión
      </Button> */}
    </View>
  );
}
