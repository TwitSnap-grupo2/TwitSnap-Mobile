import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Avatar, Button, Card, Paragraph, FAB } from 'react-native-paper';
import { styled } from "nativewind"; // Importar para aplicar tailwind
import { useRouter } from 'expo-router';
import TweetComponent from "@/components/TwitSnap";
import { User } from '@/types/User';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const FeedScreen = () => {
    const [tweets, setTweets] = useState([]);
    const [user, setUser] = useState<User>();
    const dummyData = [
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
        { avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg", name: 'Messi', username: 'messi', content: 'Gol', likes: 100, retweets: 50, comments: 10 },
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
        setUser({ id: "1", name: 'Messi', username: 'messi', avatar: 'https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg', followers: 100, following: 50 });
    }, []);

    return (
        <StyledView className="flex-1 bg-white">
            <StyledScrollView className="px-4 py-2">
                <StyledView className="flex flex-row space-x-28  my-4">
                    {/* TODO: crear el hamburger */}
                    <Avatar.Icon
                        size={50}
                        icon="account"
                        onTouchEnd={() => {
                            if (user?.id) {
                                router.push({
                                    // @ts-ignore
                                    pathname: "/(profile)/[id]",
                                    params: { id: user.id },
                                });
                            }
                        }}
                    />

                    <Avatar.Image size={50} source={require('@/assets/images/twitsnap-logo.webp')} />
                </StyledView>

                {dummyData.map((tweet, index) => (
                    <TweetComponent key={index} tweet={tweet} />
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
