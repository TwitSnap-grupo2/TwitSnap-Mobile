import { Searchbar } from "react-native-paper";
import { useRef, useState } from "react";
import { fetch_to } from "@/utils/fetch";
import { View, Text } from "react-native";
import { User } from "@/types/User";
import UserCard from "@/components/UserCard";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [listOfUsers, setListOfUsers] = useState<Array<User>>([]);

  async function handleTypingStop(input: string) {
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/users/search/?user=${input}&limit=10`,
      "GET"
    );
    if (response.status === 200) {
      const data = await response.json();
      setListOfUsers(data);
    } else {
      console.error(
        "Error al obtener los usuarios",
        response.status,
        response.text
      );
    }
  }

  const handleTextChange = (input: string) => {
    setSearchQuery(input);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      handleTypingStop(input);
    }, 500);
  };

  return (
    <View>
      <Searchbar
        className="mt-10"
        placeholder="Search"
        onChangeText={handleTextChange}
        value={searchQuery}
      />
      {listOfUsers.map((user) => (
        <View className="p-1" key={user.id}>
          <UserCard user={user} />
        </View>
      ))}
    </View>
  );
}
