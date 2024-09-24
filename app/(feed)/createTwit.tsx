import { TextInput, Button, Avatar, IconButton } from 'react-native-paper';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { UserContext } from '@/context/context';

const CreateTweetScreen = () => {
    const [tweet, setTweet] = useState('');
    const router = useRouter();
    const userContext = useContext(UserContext);
    const user = userContext ? userContext.user : null;

    async function handleSubmit() {
        try {
            await fetch('https://api-gateway-ccbe.onrender.com/twits/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // @ts-ignore
                    message: tweet,
                    // @ts-ignore
                    createdBy: user.id,
                })
            }).then(response => {
                if (response.status === 201) {
                    alert('Twit creado correctamente');
                    router.back();

                } else {
                    alert('Error al crear el twit ' + response.status);

                }
            }
            );
        } catch (error) {
            console.error("failed to sign up:", error);
        }

        // Navegar de vuelta al feed después de crear el tweet
    };

    return (
        <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white dark:bg-black">
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                {/* Botón de cerrar */}
                <TouchableOpacity onPress={() => router.back()}>
                    <IconButton icon="close" size={24} />
                </TouchableOpacity>

                {/* Botón de publicar */}
                <TouchableOpacity onPress={handleSubmit} className='m-auto'>
                    <Button mode="contained" onPress={handleSubmit} style={{ backgroundColor: '#1DA1F2' }}>
                        Publicar
                    </Button>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingTop: 20 }}>
                {/* Avatar del usuario */}
                <Avatar.Image size={50} source={{ uri: user?.avatar || 'https://example.com/avatar.png' }} />

                {/* Input para el tweet */}
                <TextInput
                    placeholder="¿Qué está pasando?"
                    placeholderTextColor="#aaa"
                    multiline
                    value={tweet}
                    onChangeText={setTweet}
                    style={{
                        flex: 1,
                        marginLeft: 10,
                        color: 'white',
                        fontSize: 18,
                        backgroundColor: 'transparent',
                    }}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                />
            </View>

            {/* Barra inferior con íconos */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    borderTopWidth: 1,
                    borderTopColor: '#333',
                }}
            >
                {/* Íconos de la barra inferior */}
                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton icon="image" color="#1DA1F2" size={24} onPress={() => { }} />
                    <IconButton icon="gif" color="#1DA1F2" size={24} onPress={() => { }} />
                    <IconButton icon="poll" color="#1DA1F2" size={24} onPress={() => { }} />
                    <IconButton icon="map-marker" color="#1DA1F2" size={24} onPress={() => { }} />
                </View> */}

                {/* Opción de accesibilidad o más configuraciones */}
                {/* <TouchableOpacity onPress={() => { }}>
                    <Text style={{ color: '#1DA1F2' }}>Cualquier persona puede responder</Text>
                </TouchableOpacity> */}
            </View>
        </KeyboardAvoidingView>
    );
};

export default CreateTweetScreen;
