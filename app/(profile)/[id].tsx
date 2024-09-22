import BackHeader from "@/components/BackHeader";
import TweetComponent from "@/components/TwitSnap";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHomeScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    return (
        <SafeAreaView>
            <BackHeader />
            <View className="items-center mt-10">
                <Image
                    source={{ uri: "https://www.clarin.com/2024/09/11/mQgzER_Lh_360x240__1.jpg" }}
                    className="h-24 w-24 rounded-full border-2 border-gray-300"
                />
            </View>

            <View className="flex-row justify-between items-center mt-4 px-6">
                <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-900">Palito</Text>
                    <Text className="text-md text-gray-500">{id}</Text>

                    <View className="flex-row space-x-4 mt-2">
                        <Text className="text-sm text-gray-600">
                            <Text className="font-semibold">0</Text> Following
                        </Text>
                        <Text className="text-sm text-gray-600">
                            <Text className="font-semibold">0</Text> Followers
                        </Text>
                    </View>
                </View>

                <View className="ml-4">
                    <TouchableOpacity onPress={() => router.push("/(profile)/editprofile")}>
                        <Text className="bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-full shadow-md">
                            Editar Perfil
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={[1, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]}
                renderItem={({ item }) => <TweetComponent />}

            />

        </SafeAreaView>

    );
}