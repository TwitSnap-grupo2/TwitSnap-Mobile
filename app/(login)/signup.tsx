import { View, Text, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { UserContext } from '@/context/context';

export default function SignUpScreen() {
    const colorScheme = useColorScheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error("UserContext is null");
    }

    const { saveUser } = userContext;


    async function handleSignUp() {
        try {
            await fetch('https://api-gateway-ccbe.onrender.com/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // @ts-ignore
                    email: email,
                    // @ts-ignore
                    password: password,
                    // @ts-ignore
                    user: username,
                    // @ts-ignore
                    name: name,
                })
            }).then(response => {
                if (response.status === 201) {
                    //guardo al usuario en el contexto
                    response.json().then(data => {
                        saveUser({
                            id: data.id,
                            name: data.name,
                            username: data.user,
                            avatar: "https://media.diariopopular.com.ar/p/3652d6f7d60de6f88670130b02610406/adjuntos/143/imagenes/006/926/0006926517/messijpg.jpg",
                            followers: data.followers.length,
                            following: 0,
                        });
                        alert('Usuario creado correctamente');
                        router.replace('/(feed)');
                    });

                } else {
                    alert('Error al crear el usuario ' + response.status);
                }
            }
            );
        } catch (error) {
            console.error("failed to sign up:", error);
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-white dark:bg-gray-800 justify-center'>
            <View className='items-center'>
                <Image
                    source={require('@/assets/images/twitsnap-logo.webp')}
                    className="h-64 w-64 rounded-full mb-12"
                />
                <Text className='text-4xl text-black dark:text-white font-bold mb-6'>Registrarse</Text>
            </View>

            <View className='px-8'>
                <TextInput
                    placeholder='Email'
                    keyboardType='email-address'
                    placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    id="email"
                    onChangeText={setEmail}
                    className='bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full'
                />
                <TextInput
                    placeholder='Contraseña'
                    placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    secureTextEntry={true}
                    id="password"
                    onChangeText={setPassword}
                    className='bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full'
                />
                <TextInput
                    placeholder='Nombre'
                    placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    id="name"
                    onChangeText={setName}
                    className='bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full'
                />
                <TextInput
                    placeholder='Nombre de usuario'
                    placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    id="username"
                    onChangeText={setUsername}
                    className='bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full'
                />
            </View>


            {errorMessage ? <Text className='text-red-700 mb-12'>{errorMessage}</Text> : null}

            <View className='px-8'>
                <TouchableOpacity className='mb-4' onPress={handleSignUp}>
                    <Text className='bg-blue-500 text-white text-center font-bold p-4 rounded-full'>
                        Registrarse
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
