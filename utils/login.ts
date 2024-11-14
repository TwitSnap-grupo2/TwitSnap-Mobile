import { auth } from "@/utils/config";
import { fetch_to } from "./fetch";
import { FirebaseError } from "firebase/app";

async function _login(email: string, pass: string) {
  try {
    const userCredentials = await auth().signInWithEmailAndPassword(
      email,
      pass
    );
    const user = userCredentials.user;
    return user;
  } catch (error) {
    console.log("failed to log in:", error);
  }
}

export const LoginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    let user = await _login(email, password);
    if (user) {
      if (!user.emailVerified) {
        alert("Por favor, verifica tu correo electrónico");
        return;
      }
      const findedUser = await FindUserByEmail(email);
      return findedUser;
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.log(error.cause);
      console.log(error.code);
      console.log(error.customData);
      console.log(error.name);
    }
    console.log("failed to log in:", error);
  }
};

export async function FindUserByEmail(email: string | null) {
  const response = await fetch_to(
    `https://api-gateway-ccbe.onrender.com/users/email/${email}`,
    "GET"
  );

  if (response.status === 200) {
    const data = await response.json();
    if (!data.id) {
      return null;
    }
    const user = {
      id: data.id,
      name: data.name,
      user: data.user,
      email: data.email,
      avatar: `https://robohash.org/${data.id}.png`,
      followers: data.followers,
      followeds: data.followeds,
      location: data.location,
      interests: data.interests,
    };
    return user;
  } else {
    return null;
  }
}
