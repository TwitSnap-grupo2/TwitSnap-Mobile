import { useColorScheme } from "@/hooks/useColorScheme";
import { auth } from "@/utils/config";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";

export default function FavLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
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

  return (
    <View className="flex-1 bg-white justify-center items-center dark:bg-black">
      <Button
        mode="contained"
        onPress={handleSignOut}
        textColor={colorScheme === "dark" ? "white" : "black"}
        style={{ backgroundColor: "#1DA1F2" }}
      >
        Cerrar Sesión
      </Button>
    </View>
  );
}
