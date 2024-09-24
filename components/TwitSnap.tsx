import { Tweet } from "@/types/tweets";
import { Avatar } from 'react-native-paper';
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";


export default function TweetComponent({ tweet }: { tweet: Tweet }) {
  const router = useRouter();
  return (

    <View style={styles.container}>
      <Avatar.Image
        size={50}
        source={{ uri: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg" }}
        onTouchEnd={() => {
          router.push({
            pathname: "/(profile)/[id]",
            // @ts-ignore
            params: { id: tweet?.createdBy },
          });
        }}
      />

      {/* <Image source={{ uri: tweet.avatar }} style={styles.avatar} /> */}
      <View style={styles.tweetContent}>
        <View style={styles.tweetHeader}>
          <Text style={styles.name}>prueba</Text>

          {/* <Text style={styles.name}>{tweet.name}</Text> */}
          <Text style={styles.username}>@hola</Text>
          {/* <Text style={styles.username}>@{tweet.username}</Text> */}
        </View>
        <Text style={styles.tweetText}>{tweet.message}</Text>
        <View style={styles.tweetActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={16} color="#657786" />
            <Text style={styles.actionText}>10</Text>

            {/* <Text style={styles.actionText}>{tweet.comments}</Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="repeat" size={16} color="#657786" />
            <Text style={styles.actionText}>2</Text>

            {/* <Text style={styles.actionText}>{tweet.retweets}</Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart" size={16} color="#657786" />
            <Text style={styles.actionText}>43</Text>
            {/* <Text style={styles.actionText}>{tweet.likes}</Text> */}
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    backgroundColor: 'white',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 4,
  },
  username: {
    color: '#657786',
    fontSize: 14,
  },
  tweetText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  tweetActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    color: '#657786',
    fontSize: 12,
  },
});