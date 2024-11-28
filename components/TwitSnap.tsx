import { Tweet } from "@/types/tweets";
import { Avatar, IconButton, Menu } from "react-native-paper";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { fetch_to } from "@/utils/fetch";
import { useContext, useState } from "react";
import { UserContext } from "@/context/context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import SnackBarComponent from "./Snackbar";

export default function TweetComponent({
  initialTweet,
  shareTweet,
  deleteTweet,
  editTweet,
  isResponse,
  favTweet,
}: {
  initialTweet: Tweet;
  deleteTweet?: (tweetId: string) => void;
  editTweet?: (message: string, tweetId: string) => void;
  shareTweet: () => void;
  isResponse?: boolean;
  favTweet?: (fav: boolean) => void;
}) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  if (!userContext.user) {
    throw new Error("UserContext.user is null");
  }
  const user = userContext.user;
  const [tweet, setTweet] = useState<Tweet>(initialTweet);

  async function handleShare() {
    const actual_shared = tweet.sharedByMe;
    const updatedTweet = {
      ...tweet,
      sharedByMe: !actual_shared,
      sharesCount: actual_shared
        ? (parseInt(tweet.sharesCount) + -1).toString()
        : (parseInt(tweet.sharesCount) + 1).toString(),
    };
    setTweet(updatedTweet);
    shareTweet();

    if (actual_shared) {
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${tweet.id}/share?unsharedBy=${user?.id}`,
        "DELETE"
      );

      if (response.status != 204) {
        console.error("Error al quitar share al tweet", response.status);
      }
      return;
    } else {
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${tweet.id}/share`,
        "POST",
        {
          sharedBy: user?.id,
        }
      );

      if (response.status != 201) {
        console.error("Error al dar share al tweet", response.status);
      }
    }
  }

  async function handleLike() {
    const actual_liked = tweet.likedByMe;
    const updatedTweet = {
      ...tweet,
      likedByMe: !actual_liked,
      likesCount: actual_liked
        ? (parseInt(tweet.likesCount) + -1).toString()
        : (parseInt(tweet.likesCount) + 1).toString(),
    };
    setTweet(updatedTweet);

    if (actual_liked) {
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${tweet.id}/like?unlikedBy=${user?.id}`,
        "DELETE"
      );

      if (response.status != 204) {
        console.error("Error al quitar like al tweet", response.status);
      }
      return;
    } else {
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${tweet.id}/like`,
        "POST",
        {
          likedBy: user?.id,
        }
      );

      if (response.status != 201) {
        console.error(
          "Error al dar like al tweet",
          response.status + " " + response.statusText
        );
      }
    }
  }

  function handleViewTwit() {
    router.push({
      pathname: "/(twit)/[id]",
      params: {
        id: tweet.id,
        twit: JSON.stringify(tweet),
      },
    });
  }

  function handleAvatarPress() {
    router.push({
      pathname: "/(profile)/[id]",
      params: {
        id: tweet?.createdBy,
        initialFollowed: user.followeds.includes(tweet.createdBy) ? "1" : "0",
      },
    });
  }

  const handleEdit = () => {
    setMenuVisible(false);
    if (!editTweet) {
      return;
    }
    editTweet(tweet.message, tweet.id);
  };

  const handleDelete = async () => {
    setMenuVisible(false);
    if (!deleteTweet) {
      return;
    }
    deleteTweet(tweet.id);
  };

  async function handleFavourite() {
    const actual_favourite = tweet.favourite;
    const updatedTweet = {
      ...tweet,
      favourite: !actual_favourite,
    };
    setTweet(updatedTweet);

    const updatedUser = {
      ...user,
      favourites: actual_favourite
        ? user.favourites.filter((fav) => fav !== tweet.id)
        : user.favourites.concat(tweet.id),
    };
    userContext?.saveUser(updatedUser);

    if (actual_favourite) {
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${tweet.id}/favourite?userId=${user.id}`,
        "DELETE"
      );

      if (response.status != 204) {
        console.error("Error al quitar favorito al tweet", response.status);
      }
      favTweet ? favTweet(false) : null;
    } else {
      const response = await fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${tweet.id}/favourite`,
        "POST",
        {
          userId: user.id,
        }
      );

      if (response.status != 201) {
        console.error("Error al dar favorito al tweet", response.status);
      }

      favTweet ? favTweet(true) : null;
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handleViewTwit}>
      <View className="flex-row pb-4 mb-2 bg-white dark:bg-black border-slate-400 border-b-2">
        {isResponse && (
          <View
            style={{
              position: "absolute",
              top: 50,
              left: 25,
              width: 3,
              height: "55%",
              backgroundColor: "#ddd",
            }}
          />
        )}

        <TouchableWithoutFeedback onPress={handleAvatarPress}>
          <Avatar.Image
            size={50}
            source={{
              uri:
                tweet.avatar || `https://robohash.org/${tweet.createdBy}.png`,
            }}
          />
        </TouchableWithoutFeedback>

        <View style={styles.tweetContent}>
          {tweet.sharedBy != null && (
            <View style={styles.tweetHeader}>
              <Text style={styles.username}>
                re-snapeado por {tweet.sharedBy}
              </Text>
            </View>
          )}
          <View className="space-x-50" style={styles.tweetHeader}>
            <View>
              <Text className="dark:text-gray-200" style={styles.name}>
                {tweet.name}
              </Text>

              <Text style={styles.username}>@{tweet.username}</Text>
            </View>

            {tweet.createdBy === user.id && (
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableWithoutFeedback>
                    <IconButton
                      icon="dots-vertical" // Ícono de tres puntos
                      size={24}
                      onPress={() => setMenuVisible(true)}
                    />
                  </TouchableWithoutFeedback>
                }
              >
                <View>
                  <Menu.Item onPress={handleEdit} title="Editar" />
                  <Menu.Item onPress={handleDelete} title="Eliminar" />
                </View>
              </Menu>
            )}
          </View>

          <Text className="dark:text-gray-200" style={styles.tweetText}>
            {tweet.message}
          </Text>
          <View style={styles.tweetActions}>
            <TouchableWithoutFeedback style={styles.actionButton}>
              <Icon name="share" size={16} color="#657786" />
              <Text style={styles.actionText}>{tweet.repliesCount}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Icon
                name="repeat"
                size={16}
                color={tweet.sharedByMe ? "#1DA1F2" : "#657786"}
              />
              <Text style={styles.actionText}>{tweet.sharesCount}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.actionButton}
              onPress={handleLike}
            >
              <Icon
                name="heart"
                size={16}
                color={tweet.likedByMe ? "#EE0000" : "#657786"}
              />
              <Text style={styles.actionText}>{tweet.likesCount}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.actionButton}
              onPress={handleFavourite}
            >
              <Icon
                name="bookmark"
                size={16}
                color={tweet.favourite ? "#1DA1F2" : "#657786"}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    // padding: 12,
    // borderBottomWidth: 0.5,
    // borderBottomColor: "#E1E8ED",
    // backgroundColor: "white",
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
