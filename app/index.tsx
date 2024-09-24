import { Link, Stack, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
// import statusCodes along with GoogleSignin
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
    GoogleSigninButton,
    User
} from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
    webClientId: '51208642510-ee5d1iurrlbvvrp8nqm6jvvishpk3708.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    offlineAccess: true,
    forceCodeForRefreshToken: true,
});

export default function HomeScreen() {
    const [isInProgress, setIsInProgress] = useState(false);
    const router = useRouter();

    const signInWithGoogle = async () => {
        try {
            setIsInProgress(true);
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                await AsyncStorage.setItem('user', JSON.stringify(response.data?.user));
                router.replace('./(feed)');
            } else {
                // sign in was cancelled by user
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // Android only, play services not available or outdated
                        break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
            }
        }
    };

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

            <View className='px-8'>
                <TouchableOpacity className='mb-4' onPress={() => router.push('./(login)/signin')}>
                    <Text className='bg-blue-500 text-white text-center font-bold p-4 rounded-full'>
                        Iniciar sesión
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity className='mb-6 border-opacity-100 border-black' onPress={() => router.push("./(login)/signup")}>
                    <Text className='bg-gray-100 dark:bg-white text-black text-center font-bold p-4 rounded-full'>
                        Registrarse
                    </Text>
                </TouchableOpacity>
            </View>

            <Text className='text-lg text-gray-500 text-center mb-6'>
                Unirse con
            </Text>

            <View className='flex-row justify-center'>
                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Icon}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signInWithGoogle}
                    disabled={isInProgress}
                />
                <TouchableOpacity className='mb-4' onPress={() => router.push('./(login)/signin')}>
                    <Text className='bg-blue-500 text-white text-center font-bold p-4 rounded-full'>
                        Microsoft
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
