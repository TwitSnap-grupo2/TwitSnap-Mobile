import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Avatar, Button, Card, Paragraph, FAB } from 'react-native-paper';
import { styled } from "nativewind"; // Importar para aplicar tailwind
import { useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const FeedScreen = () => {
    const [tweets, setTweets] = useState([]);
    const dummyData = [
        { author: { name: 'Messi', username: 'messi' }, content: 'Gol', likes: 100 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
        { author: { name: 'Messi', username: 'messi' }, content: 'Abro hilo 🧵', likes: 10 },
    ];
    const router = useRouter();

    useEffect(() => {
        // const fetchTweets = async () => {
        //   // Aquí harías tu fetch a la API
        //   const response = await fetch('https://example.com/api/tweets');
        //   const data = await response.json();
        //   setTweets(data);
        // };

        // fetchTweets();
    }, []);

    return (
        <StyledView className="flex-1 bg-white">
            <StyledScrollView className="px-4 py-2">
                <StyledView className="flex flex-row space-x-28  my-4">
                    {/* TODO: crear el hamburger */}
                    <Avatar.Icon size={50} icon="account" onTouchEnd={() => { router.push("/(feed)/search") }} />
                    <Avatar.Image size={50} source={require('@/assets/images/twitsnap-logo.webp')} />
                </StyledView>

                {dummyData.map((tweet, index) => (
                    <Card key={index} className="mb-4">
                        <Card.Title
                            title={tweet.author.name}
                            subtitle={`@${tweet.author.username}`}
                            left={(props) => <Avatar.Icon {...props} icon="account" />}
                        />
                        <Card.Content>
                            <Paragraph>{tweet.content}</Paragraph>
                        </Card.Content>
                        <Card.Actions>
                            <Button icon="heart-outline">{tweet.likes} mil</Button>
                        </Card.Actions>
                    </Card>
                ))}
            </StyledScrollView>

            <FAB
                className="absolute bottom-4 right-4"
                icon="plus"
                onPress={() => {
                    // Acción cuando se presiona el botón de crear nuevo tweet
                }}
            />
        </StyledView>
    );
};

export default FeedScreen;
