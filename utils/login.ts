import { auth } from "@/services/config";
import { fetch_to } from "./fetch";
import {
    signInWithEmailAndPassword,
  } from "firebase/auth";
  
async function _login(email: string, pass: string) {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredentials.user;
      return user;
    } catch (error) {
      console.error("failed to log in:", error);
    }
  }

export const LoginWithEmailAndPassword = async (email: string, password: string) => {
try {
    let user = await _login(email, password);

    if (user) {
    if (!user.emailVerified) {
        alert("Por favor, verifica tu correo electrónico");
        return;
    }
    const findedUser = FindUserByEmail(email);
    return findedUser;
    }
} catch (error) {
    console.error("failed to log in:", error);
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
        };
        return user;
    } else {
        return null;
    }
}