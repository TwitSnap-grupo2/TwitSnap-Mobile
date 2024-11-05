import { User } from "@/types/User";
import { Text, View } from "react-native";

const MessageItem = ({
  message,
  currentUser,
}: {
  message: any;
  currentUser: User;
}) => {
  if (currentUser.id == message.userId) {
    return (
      <View className="flex-row justify-end mb-3 mr-3">
        <View style={{ maxWidth: "80%" }}>
          <View className="flex self-end p-3 rounded-2xl bg-white border border-neutral-200 ">
            <Text>{message.text}</Text>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View className="ml-3 mb-3">
        <View style={{ maxWidth: "80%" }}>
          <View className="flex self-start p-3 px-4 rounded-2xl max-w-2xl bg-indigo-100 border border-indigo-200">
            <Text>{message.text}</Text>
          </View>
        </View>
      </View>
    );
  }
};

export default MessageItem;
