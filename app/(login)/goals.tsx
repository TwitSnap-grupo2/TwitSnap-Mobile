import { useState } from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView, Text, View } from "react-native";

export default function GoalsScreen() {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const toggleGoal = (goal: string) => {
        setSelectedGoals((prevGoals) =>
            prevGoals.includes(goal)
                ? []
                : [goal]
        );
    }

    const renderGoal = ({ item }: { item: string }) => (
        <TouchableOpacity
        className={`p-4 m-2 flex-1 rounded-lg ${selectedGoals.includes(item) ? 'bg-blue-500' : 'bg-gray-300'}`}
        onPress={() => toggleGoal(item)}
        >
        <Text className={`${selectedGoals.includes(item) ? 'text-white' : 'text-black'}`}>{item}</Text>
        </TouchableOpacity>
    );
    return (
        <SafeAreaView className="flex-1 p-12">
            <Text className="text-4xl font-bold">What do you plan to use TwitSnap for?</Text>
            <FlatList
                data={[
                    "Meet new people",
                    "Stay in touch with friends",
                    "Grow my professional network",
                    "Find a job",
                    "Learn new things",
                    "Stay updated on current events",
                    "Find a date",
                    "Other"
                ]}
                renderItem={renderGoal}
                keyExtractor={item => item}
           />
           <View>
            <TouchableOpacity
            className={`rounded-lg p-4 m-2 align-center  ${selectedGoals.length == 1 ? 'bg-blue-500' : 'bg-gray-300'}`} 
            >
                <Text className="text-black font-bold self-center text-white">Continue</Text>
            </TouchableOpacity>
           </View>

            
        </SafeAreaView>
    );
}