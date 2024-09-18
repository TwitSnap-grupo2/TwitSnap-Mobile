import TweetComponent from "@/components/TwitSnap";
import { useRouter } from "expo-router";
import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHomeScreen() {
    const router = useRouter();
    return (
        <SafeAreaView>
        <View className='items-center mt-10'>
            <Image
                source={{uri: "https://www.clarin.com/2024/09/11/mQgzER_Lh_360x240__1.jpg"}}
                className="h-20 w-20 rounded-full"
            />
        </View>
        <View className='flex-row'>
            <View className='px-9 '>
                <Text className="text-3xl font-bold "> Palito</Text>
                <Text className="text-lg"> @palito</Text>
                <View className="flex-row">
                    <Text className="text-sm"> 0 Following</Text>
                    <Text className="text-sm px-2"> 0 Followers</Text>
                </View>
            </View>
            <View className='justify-center'>
                    <TouchableOpacity onPress={() => router.push("./(profile)/editprofile")}>
                        <Text className='bg-blue-500 text-white text-center font-bold p-4 rounded-full'>
                            Editar Perfil
                        </Text>
                    </TouchableOpacity>
            </View>
        </View>
        <TweetComponent />

    </SafeAreaView>

    );
}