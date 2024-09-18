import { Image, SafeAreaView, Text,TouchableOpacity, useColorScheme, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function EditProfileScreen() {
    const colorScheme = useColorScheme();
    return (
        <SafeAreaView className='flex-1 bg-white dark:bg-gray-800'>
        <View className='items-center'>
            <Image source={{uri:"https://www.clarin.com/2024/09/11/mQgzER_Lh_360x240__1.jpg" }} className="rounded-full h-40 w-40"/>  
        </View>
        <View className=''>
            <TextInput
                        dense
                        mode="outlined"
                        label="username"
                    /> 
        </View>
        <View className='items-center p-4'>
                <TouchableOpacity>  
                        <Text className='bg-blue-500 text-white text-center font-bold w-40 p-4 rounded-full '>
                            Guardar
                        </Text>
                    </TouchableOpacity>

        </View>
      

        </SafeAreaView>

    );
}