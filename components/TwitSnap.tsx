import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';


export default function TweetComponent({ tweet = {
  avatar: 'https://www.clarin.com/2024/09/11/mQgzER_Lh_360x240__1.jpg',
  name: 'Palito',
  username: 'palito',
  content: 'Que onda la banda',
  likes: 42,
  retweets: 7,
  comments: 3,
} }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: tweet.avatar }} style={styles.avatar} />
      <View style={styles.tweetContent}>
        <View style={styles.tweetHeader}>
          <Text style={styles.name}>{tweet.name}</Text>
          <Text style={styles.username}>@{tweet.username}</Text>
        </View>
        <Text style={styles.tweetText}>{tweet.content}</Text>
        <View style={styles.tweetActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={16} color="#657786" />
            <Text style={styles.actionText}>{tweet.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="repeat" size={16} color="#657786" />
            <Text style={styles.actionText}>{tweet.retweets}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart" size={16} color="#657786" />
            <Text style={styles.actionText}>{tweet.likes}</Text>
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