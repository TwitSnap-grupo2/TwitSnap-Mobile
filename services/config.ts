// Import the functions you need from the SDKs you need
import { initializeApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "@react-native-firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAs-upM23kIZ0IwMYKIlNI6YyByQhplxYE",
  authDomain: "twitsnap-43ee3.firebaseapp.com",
  projectId: "twitsnap-43ee3",
  storageBucket: "twitsnap-43ee3.appspot.com",
  messagingSenderId: "51208642510",
  appId: "1:51208642510:web:ff705fad1b8992c009559f",
  measurementId: "G-G1SLT1D2GF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const database = getFirestore();

export { auth, database, app };
