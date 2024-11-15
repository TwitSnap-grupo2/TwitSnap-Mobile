import { useContext, useEffect, useRef, useState } from "react";
import firestore, {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  Timestamp,
  doc,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { database } from "@/utils/config";
import { getRoomId } from "@/utils/chats";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UserContext } from "@/context/context";
// import { ScrollView } from "react-native-gesture-handler";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
// import { StatusBar } from "expo-status-bar";
import ChatRoomHeader from "@/components/ChatRoomHeader";
import { Feather } from "@expo/vector-icons";
import MessageList from "@/components/MessageList";
import { fetch_to } from "@/utils/fetch";
import auth from "@react-native-firebase/auth";

const Chat = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  const user = userContext.user;
  if (!user) {
    throw new Error("UserContext.user is null");
  }
  const { id, name } = useLocalSearchParams();
  const textRef = useRef("");
  const router = useRouter();
  const [messages, setMessages] = useState<
    Array<FirebaseFirestoreTypes.DocumentData>
  >([]);
  const inputRef = useRef(null);

  //@ts-ignore
  const roomId = getRoomId(user.id, id);

  useEffect(() => {
    console.log("Refetching...");

    createChatRoom();
    const docRef = doc(database, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => doc.data());
      setMessages([...allMessages]);
      return unsub;
    });
  }, []);

  const createChatRoom = async () => {
    await setDoc(doc(database, "rooms", roomId), {
      roomId,
      participants: [user.id, id].sort(),
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;

    try {
      const docRef = doc(database, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      textRef.current = "";

      //@ts-ignore
      if (inputRef) inputRef?.current?.clear();

      await addDoc(messagesRef, {
        userId: user.id,
        text: message,
        senderName: user.name,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (err) {
      if (err instanceof Error) Alert.alert("Error: ", err.message);
    }
    try {
      console.log("user.id", user.id, "id", id);

      const res = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/notifications/${id}`,
        "POST",
        {
          url: `/(messages)/chatRoom?id=${id}&name=${name}`,
          body: `${user.name}: ${message}`,
          title: `${user.name} te ha enviado un mensaje`,
        }
      );
      console.log("res", res.status, res.statusText);
    } catch (error) {
      console.error("Error al registrar el token FCM", error);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black ">
      <ChatRoomHeader
        id={id as string}
        name={name as string}
        router={router}
      ></ChatRoomHeader>
      <View className="h-3 border-b border-neutral-300 dark:border-neutral-600"></View>
      <View className="flex-1">
        <MessageList messages={messages} currentUser={user}></MessageList>
      </View>
      <View className="mb-3 pt-2 px-3">
        <View className="flex-row justify-between bg-white border p-2 border-neutral-500 rounded-full pl-5">
          <TextInput
            ref={inputRef}
            onChangeText={(value) => (textRef.current = value)}
            placeholder="Type a message..."
            className="text-base text-gray-600 flex-1 mr-2"
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className="p-2 mr-[1px] mt-[2px] rounded-full"
          >
            <Feather name="send" size={20} color="#1DA1F2"></Feather>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Chat;
