import { User } from "@/types/User";
import { View, Text } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import MessageItem from "./MessageItem";

const MessageList = ({
  messages,
  currentUser,
}: {
  messages: Array<any>;
  currentUser: User;
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 10 }}
    >
      {messages.map((message, index) => {
        return (
          <MessageItem
            message={message}
            key={index}
            currentUser={currentUser}
          ></MessageItem>
        );
      })}
    </ScrollView>
  );
};

export default MessageList;