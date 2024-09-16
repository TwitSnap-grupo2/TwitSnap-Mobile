import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHomeScreen() {
    return (
        <SafeAreaView className='flex-1 bg-white dark:bg-gray-800'>
        <View className='items-center'>
            <Image
                source={require('@/assets/images/twitsnap-logo.webp')}
                className="h-20 w-20 rounded-full"
            />
        </View>

        <View className='px-9'>
            <Text className="text-3xl"> Palito</Text>
            <Text className="text-lg"> @palito</Text>
        </View>
        <View className='px-9'>
            <Text className="text-lg"> 0 Following</Text>
            <Text className="text-lg"> 0 Followers</Text>
        </View>
        <View className='px-9'>
        <View>
                <TouchableOpacity className='px-20'>
                    <Text className='bg-blue-500 text-white text-center font-bold p-4 rounded-full'>
                        Editar Perfil
                    </Text>
                </TouchableOpacity>
        </View>      
        </View>
    </SafeAreaView>

    );
}