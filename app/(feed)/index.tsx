import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Avatar, Button, Card, Paragraph, FAB, ActivityIndicator } from 'react-native-paper';
import { styled } from "nativewind"; // Importar para aplicar tailwind
import { useRouter } from 'expo-router';
import TweetComponent from "@/components/TwitSnap";
import { User } from '@/types/User';
import { UserContext } from '@/context/context';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const FeedScreen = () => {
    const [tweets, setTweets] = useState([]);
    const [usuario, setUser] = useState<User | null | undefined>();
    const [loading, setLoading] = useState(true);
    const userContext = useContext(UserContext);
    const user = userContext ? userContext.user : null;
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
        setUser(user);
    }, []);

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <ActivityIndicator />
        );
    }

    return (
        <StyledView className="flex-1 bg-white">
            <StyledScrollView className="px-4 py-2">
                <StyledView className="flex flex-row space-x-28  my-4">
                    {/* TODO: crear el hamburger */}
                    <Avatar.Image
                        size={50}
                        source={{ uri: usuario?.avatar }}
                        onTouchEnd={() => {
                            router.push({
                                // @ts-ignore
                                pathname: "/(profile)/[id]",
                                // @ts-ignore
                                params: { id: usuario?.id },
                            });
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
                    //@ts-ignore
                    router.push('/(feed)/createTwit');
                }}
            />
        </StyledView>
    );
};

export default FeedScreen;
