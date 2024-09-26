import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Button, Card, Paragraph, FAB, ActivityIndicator } from 'react-native-paper';
import { styled } from "nativewind"; // Importar para aplicar tailwind
import { useRouter } from 'expo-router';
import TweetComponent from "@/components/TwitSnap";
import { User } from '@/types/User';
import { UserContext } from '@/context/context';
import { auth } from '@/services/config';

const FeedScreen = () => {
    const [tweets, setTweets] = useState([]);
    const [usuario, setUser] = useState<User | null | undefined>();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const userContext = useContext(UserContext);
    const user = userContext ? userContext.user : null;
    const router = useRouter();

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
            fetchTweets();
        }, 2000);
    }, []);

    const fetchTweets = async () => {
        const token = await auth.currentUser?.getIdToken();

        const response = await fetch('https://api-gateway-ccbe.onrender.com/twits/',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
        if (response.status === 200) {
            const data = await response.json();
            setTweets(data);

        } else {
            alert('Error al obtener los twits ' + response.status);
        }

    };

    useEffect(() => {
        fetchTweets();
        setUser(user);
    }, []);

    useEffect(() => {
        if (user && tweets.length > 0) {
            setLoading(false);
        }
    }, [user, tweets]);

    if (loading) {
        return (
            <ActivityIndicator />
        );
    }

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="px-4 py-2"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Sección del encabezado con los Avatares */}
                <View className="flex flex-row space-x-28 my-4">
                    <Avatar.Image
                        size={50}
                        source={{ uri: usuario?.avatar }}
                        onTouchEnd={() => {
                            router.push({
                                pathname: "/(profile)/[id]",
                                // @ts-ignore
                                params: { id: usuario?.id },
                            });
                        }}
                    />
                    <Avatar.Image size={50} source={require('@/assets/images/twitsnap-logo.webp')} />
                </View>

                {/* Renderizar los tweets */}
                {tweets.map((tweet, index) => (
                    <TweetComponent key={index} tweet={tweet} />
                ))}
            </ScrollView>

            {/* Botón flotante */}
            <FAB
                className="absolute bottom-4 right-4"
                icon="plus"
                onPress={() => {
                    router.push('/(feed)/createTwit');
                }}
            />
        </View>
    );
};

export default FeedScreen;
