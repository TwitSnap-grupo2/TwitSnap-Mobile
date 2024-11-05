import React, { useContext } from "react";
import { Card, Avatar } from "react-native-paper";
import { User } from "@/types/User";
import { useRouter } from "expo-router";
import { UserContext } from "@/context/context";

export default function UserCard({
  user,
  customHandle,
}: {
  user: User;
  customHandle?: (user: User) => void;
}) {
  const userContext = useContext(UserContext);
  const currentUser = userContext ? userContext.user : null;
  const router = useRouter();

  function handleUser() {
    if (customHandle) {
      customHandle(user);
      return;
    }
    router.push({
      pathname: `/(profile)/[id]`,
      params: {
        id: user.id,
        initialFollowed: currentUser?.followeds.includes(user.id) ? "1" : "0",
      },
    });
  }

  return (
    <Card onPress={handleUser} className="dark:bg-gray-400">
      <Card.Title
        title={user.name}
        subtitle={"@" + user.user}
        left={(props) => (
          <Avatar.Image
            {...props}
            source={{ uri: `https://robohash.org/${user.id}.png` }}
          />
        )}
      />
    </Card>
  );
}
