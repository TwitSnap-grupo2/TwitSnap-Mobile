// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth, app };
