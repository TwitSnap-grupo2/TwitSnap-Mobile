import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

export default function EditProfileScreen() {
    const colorScheme = useColorScheme();
    return (
        <SafeAreaView className='flex-1 bg-white dark:bg-gray-800'>
        <View className='items-center'>
            <Image source={{uri:"https://www.clarin.com/2024/09/11/mQgzER_Lh_360x240__1.jpg" }} className="rounded-full h-40 w-40"/>  
        </View>
        <View className='items-center'>
            <TextInput
                        placeholder='Nombre de usuario'
                        placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
                        id="username"
                        className='bg-gray-100 dark:bg-gray-700 text-dark dark:text-white p-4 mb-4 rounded-full'
                    /> 
        </View>
        <View className='items-center'>
                <TouchableOpacity>  
                        <Text className='bg-blue-500 text-white text-center font-bold w-40 p-4 rounded-full '>
                            Guardar
                        </Text>
                    </TouchableOpacity>

        </View>
      

        </SafeAreaView>

    );
}