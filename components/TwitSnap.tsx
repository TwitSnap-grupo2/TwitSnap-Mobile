import { Tweet } from "@/types/tweets";
import { Avatar } from "react-native-paper";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { fetch_to } from "@/utils/fetch";
import { useContext, useState } from "react";
import { UserContext } from "@/context/context";

export default function TweetComponent({
  initialTweet,
}: {
  initialTweet: Tweet;
}) {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const [tweet, setTweet] = useState<Tweet>(initialTweet);

  async function handleLike() {
    const updatedTweet = {
      ...tweet,
      likedByMe: true,
      likes_count: (parseInt(tweet.likes_count) + 1).toString(),
    };

    setTweet(updatedTweet);
    const response = await fetch_to(
      `https://api-gateway-ccbe.onrender.com/twits/${tweet.id}/like`,
      "POST",
      {
        likedBy: user?.id,
      }
    );

    if (response.status != 201) {
      console.error("Error al dar like al tweet", response.status);
    }
  }

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={50}
        source={{
          uri: tweet.avatar || `https://robohash.org/${tweet.createdBy}.png`,
        }}
        onTouchEnd={() => {
          router.push({
            pathname: "/(profile)/[id]",
            params: { id: tweet?.createdBy },
          });
        }}
      />

      {/* <Image source={{ uri: tweet.avatar }} style={styles.avatar} /> */}
      <View style={styles.tweetContent}>
        {tweet.sharedBy != null && (
          <View style={styles.tweetHeader}>
            <Text style={styles.username}>
              re-snapeado por {tweet.sharedBy}
            </Text>
          </View>
        )}
        <View style={styles.tweetHeader}>
          <Text style={styles.name}>{tweet.name}</Text>

          <Text style={styles.username}>@{tweet.username}</Text>
        </View>
        <Text style={styles.tweetText}>{tweet.message}</Text>
        <View style={styles.tweetActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={16} color="#657786" />
            <Text style={styles.actionText}>{tweet.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon
              name="repeat"
              size={16}
              color={tweet.sharedByMe ? "#1DA1F2" : "#657786"}
            />
            <Text style={styles.actionText}>{tweet.shares_count}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Icon
              name="heart"
              size={16}
              color={tweet.likedByMe ? "#EE0000" : "#657786"}
            />
            <Text style={styles.actionText}>{tweet.likes_count}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
    backgroundColor: "white",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  tweetContent: {
    flex: 1,
    marginLeft: 15,
  },
  tweetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 4,
  },
  username: {
    color: "#657786",
    fontSize: 14,
  },
  tweetText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  tweetActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 4,
    color: "#657786",
    fontSize: 12,
  },
});
