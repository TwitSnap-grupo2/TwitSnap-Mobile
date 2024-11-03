import { auth } from "@/services/config";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";

export default function Configuracion() {
  const router = useRouter();

  async function handleSignOut() {
    auth
      .signOut()
      .then(() => {
        router.replace("../(access)");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  }

  return (
    <View className="flex-1 bg-white justify-center items-center dark:bg-black">
      <Button
        mode="contained"
        onPress={handleSignOut}
        style={{ backgroundColor: "#1DA1F2" }}
      >
        Cerrar Sesión
      </Button>
    </View>
  );
}
