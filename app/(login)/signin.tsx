import { Link, router, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useContext } from 'react';
import { UserContext } from '@/context/context';
import { User } from '@/types/User';

export default function SignInScreen() {
    const colorScheme = useColorScheme();
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error("UserContext is null");
    }

    const { saveUser } = userContext;
    const router = useRouter();

    const handleLogin = async () => {
        const id = "670cb959-521b-4a3c-ba6a-1202accd452d";
        const response = await fetch(`https://api-gateway-ccbe.onrender.com/users/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            const user = {
                id: data.id,
                name: data.name,
                user: data.user,
                avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg",
                followers: data.followers.length,
                following: 0,
            };
            saveUser(user);
            alert('Usuario logueado correctamente');
        } else {
            alert('Error al loguear el usuario ' + response.status);
        }
        router.replace('/(feed)');
    };

    return (
        <SafeAreaView className='flex-1 bg-white dark:bg-gray-800 justify-center'>
            <View className='items-center'>
                <Image
                    source={require('@/assets/images/twitsnap-logo.webp')}
                    className="h-64 w-64 rounded-full mb-12"
                />
                <Text className='text-4xl text-black dark:text-white font-bold mb-6'>Iniciar sesión</Text>
            </View>

            <View className='px-8'>
                <TextInput
                    placeholder='Nombre de usuario'
                    placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    id="username"
                    className='bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full'
                />
                <TextInput
                    placeholder='Contraseña'
                    placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    secureTextEntry={true}
                    id="password"
                    className='bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full'
                />
            </View>

            <View className='px-8'>
                <TouchableOpacity className='mb-4' onPress={handleLogin}>
                    <Text className='bg-blue-500 text-white text-center font-bold p-4 rounded-full'>
                        Iniciar sesión
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
