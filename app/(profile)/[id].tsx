import BackHeader from "@/components/BackHeader";
import TweetComponent from "@/components/TwitSnap";
import { UserContext } from "@/context/context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Tweet } from "@/types/tweets";

export default function ProfileHomeScreen() {
    const { id } = useLocalSearchParams();
    const userContext = useContext(UserContext);
    const user = userContext ? userContext.user : null;
    const router = useRouter();
    const dummyData = [
        {
            avatar: user?.avatar,
            name: user?.name,
            username: user?.user,
            message: 'Que onda la banda',
            likes: 42,
            retweets: 7,
            comments: 3,
        },
        {
            avatar: user?.avatar,
            name: user?.name,
            username: user?.user, message: 'prueba', likes: 100, retweets: 50, comments: 10
        },
    ];

    return (
        <SafeAreaView>
            <BackHeader />
            <View className="items-center mt-10">
                <Image
                    source={{ uri: user?.avatar }}
                    className="h-24 w-24 rounded-full border-2 border-gray-300"
                />
            </View>

            <View className="flex-row justify-between items-center mt-4 px-6">
                <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-900">{user?.name}</Text>
                    <Text className="text-md text-gray-500">{user?.user}</Text>

                    <View className="flex-row space-x-4 mt-2">
                        <Text className="text-sm text-gray-600">
                            <Text className="font-semibold">{user?.following}</Text> Following
                        </Text>
                        <Text className="text-sm text-gray-600">
                            <Text className="font-semibold">{user?.followers}</Text> Followers
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

            {dummyData.map((tweet, index) => (
                // @ts-ignore
                <TweetComponent key={index} tweet={tweet} />
            ))}

        </SafeAreaView>

    );
}