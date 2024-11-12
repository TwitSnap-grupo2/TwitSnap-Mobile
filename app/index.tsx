import { AppRegistry } from "react-native";
import messaging from "@react-native-firebase/messaging";
import RootLayout from "./_layout"; // Your main component

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

AppRegistry.registerComponent("main", () => RootLayout);
