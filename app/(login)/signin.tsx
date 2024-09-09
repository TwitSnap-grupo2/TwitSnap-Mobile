import { Link } from 'expo-router';
import { View, Text, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignInScreen() {
    const colorScheme = useColorScheme();
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
                {/* TODO: agregar accion para enviar el form */}
                <TouchableOpacity className='mb-4'>
                    <Text className='bg-blue-500 text-white text-center font-bold p-4 rounded-full'>
                        Iniciar sesión
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
