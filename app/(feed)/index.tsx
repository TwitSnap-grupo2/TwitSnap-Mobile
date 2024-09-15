import { useRouter } from 'expo-router';
import { View, Text, Image, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { User } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function FeedScreen() {
    const [userInfo, setUserInfo] = useState<User | null>();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const value = await AsyncStorage.getItem('user');
                setUserInfo(value ? JSON.parse(value) : null);
                console.log(value ? JSON.parse(value) : null);
            } catch (e) {
                // Maneja errores aquí
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView className='flex-1 bg-white dark:bg-gray-800 justify-center'>
            <View className='items-center'>
                <Image
                    source={require('@/assets/images/twitsnap-logo.webp')}
                    className="h-64 w-64 rounded-full mb-12"
                />
                <Text className='text-4xl text-black dark:text-white font-bold mb-6'>Hola!</Text>
                <Text className='text-lg text-gray-500 text-center'>
                    Bienvenido a TwitSnap,
                </Text>
                <Text className='text-lg text-gray-500 text-center mb-6'>
                    la conexión al mundo
                </Text>
            </View>

        </SafeAreaView>
    );
}
