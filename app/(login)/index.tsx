import { Link, Stack, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();
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

            {/* TODO: agregar botones reales para iniciar con entidades federadas como Google, Facebook, etc. */}
            <View className='flex-row justify-center'>
                <TouchableOpacity className='mb-4' onPress={() => router.push('./(login)/signin')}>
                    <Text className='bg-red-500 text-white text-center font-bold p-4 rounded-full'>
                        Google
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className='mb-4' onPress={() => router.push('./(login)/signin')}>
                    <Text className='bg-blue-500 text-white text-center font-bold p-4 rounded-full'>
                        Microsoft
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
