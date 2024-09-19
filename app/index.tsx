import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const topics = [
  'Technology', 'Sports', 'Politics', 'Entertainment', 'Science',
  'Health', 'Business', 'Travel', 'Food', 'Fashion', 'Art', 'Music',
  'Education', 'Environment', 'Gaming'
];

export default function TopicSelectionScreen({ navigation }) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prevTopics =>
      prevTopics.includes(topic)
        ? prevTopics.filter(t => t !== topic)
        : [...prevTopics, topic]
    );
  };

  const handleContinue = () => {
    console.log('Selected topics:', selectedTopics);
    // navigation.navigate('NextScreen', { selectedTopics });
  };

  const renderTopic = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.topicButton,
        selectedTopics.includes(item) && styles.selectedTopic
      ]}
      onPress={() => toggleTopic(item)}
    >
      <Text style={[
        styles.topicText,
        selectedTopics.includes(item) && styles.selectedTopicText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose your interests</Text>
      <Text style={styles.subtitle}>Select at least 3 topics you'd like to see in your feed</Text>
      
      <FlatList
        data={topics}
        renderItem={renderTopic}
        keyExtractor={item => item}
        numColumns={2}
      />
      
      <View style={styles.footer}>
        
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedTopics.length < 3 && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={selectedTopics.length < 3}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  topicButton: {
    backgroundColor: '#D3D3D3',
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 30,
    margin: 5,
  },
  selectedTopic: {
    backgroundColor: '#1DA1F2',
  },
  topicText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  selectedTopicText: {
    color: '#fff',
  },
  footer: {
    marginTop: 20,
  },
  counter: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});