// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import {PermissionsAndroid} from 'react-native';
import messaging from "@react-native-firebase/messaging";

async function checkPermission() {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
    const token = await messaging().getToken();
    console.log("FCM token:", token);
  }
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

messaging().onMessage(async (remoteMessage) => {
  console.log("A new FCM message arrived!", remoteMessage);
});

checkPermission();

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

if (!firebaseConfig.apiKey) {
  throw new Error("Missing FIREBASE_API_KEY");
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

const database = getFirestore();

export { auth, database, app };
