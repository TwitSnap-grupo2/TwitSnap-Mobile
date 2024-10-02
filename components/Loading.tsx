import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Loading() {
  return (
    <View className="flex-1 justify-center items-center h-full w-full">
      <ActivityIndicator animating={true} size="large" color="#1DA1F2" />
    </View>
  );
}
