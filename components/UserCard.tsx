import React from "react";
import { Card, Avatar } from "react-native-paper";
import { User } from "@/types/User";
import { useRouter } from "expo-router";

export default function UserCard({ user }: { user: User }) {
  const router = useRouter();
  function handleUser() {
    router.push(`/(profile)/${user.id}`);
  }

  return (
    <Card onPress={handleUser}>
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
