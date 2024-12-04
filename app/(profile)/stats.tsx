import Loading from "@/components/Loading";
import { UserContext } from "@/context/context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { fetch_to } from "@/utils/fetch";
import { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { List } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface TwitSnapsStats {
  likesTotal: number;
  sharesTotal: number;
  repliesTotal: number;
  twitsTotal: number;
}
const data: TwitSnapsStats = {
  likesTotal: 10,
  sharesTotal: 20,
  repliesTotal: 40,
  twitsTotal: 100,
};

export default function StatsScreen() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is null");
  }
  const user = userContext.user;
  if (!user) {
    throw new Error("UserContext.user is null");
  }
  const [filter, setFilter] = useState("Total");
  const [stats, setStats] = useState<TwitSnapsStats | undefined>(undefined);
  const [accordionIsExpanded, setAccordionIsExpanded] = useState(false);
  const [expandedId, setExpandedId] = useState<string | number | undefined>(
    undefined
  );
  const colorScheme = useColorScheme();

  useEffect(() => {
    try {
      fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/stats/${user.id}`,
        "GET"
      ).then((res) => {
        res.json().then((r) => setStats(r));
      });
    } catch (err) {
      Alert.alert("There was an error fetching user stats");
    }
  });

  const handleFilter = (value: number) => {
    try {
      fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/stats/${user.id}${
          value === 0 ? `?limit=${value}` : ""
        }`,
        "GET"
      ).then((res) => {
        res.json().then((r) => {
          console.log("reS:", r);
          setStats(r);
        });
      });
    } catch (err) {
      Alert.alert("There was an error fetching user stats");
    }
  };

  if (!stats)
    return (
      <SafeAreaView>
        <Loading />
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex flex-1 gap-12 px-7">
      <View className="items-center mt-16">
        <Image
          source={{ uri: user?.avatar }}
          className="rounded-full h-20 w-20"
        />
      </View>

      {stats && (
        <View className="flex space-y-10">
          <View className="px-4 flex gap-4 font-semibold">
            <Text className="dark:text-white text-black text-center font-bold text-base mb-4">
              Mostrando estadisticas con filtro: {filter}
            </Text>
            <Text className="dark:text-white text-black">
              Numero de likes totales: {stats.likesTotal}
            </Text>
            <Text className="dark:text-white text-black">
              Numero de shares totales: {stats.sharesTotal}
            </Text>
            <Text className="dark:text-white text-black">
              Numero de respuestas totales: {stats.repliesTotal}
            </Text>
            <Text className="dark:text-white text-black">
              Numero de twits totales: {stats.twitsTotal}
            </Text>
          </View>
          <View
            className={`${
              accordionIsExpanded
                ? "rounded-none rounded-t-3xl rounded-b-3xl"
                : "rounded-full "
            } overflow-hidden mt-7`}
          >
            <List.AccordionGroup
              expandedId={expandedId}
              onAccordionPress={(newExpandedId: string | number) => {
                expandedId
                  ? setExpandedId(undefined)
                  : setExpandedId(newExpandedId);
                setAccordionIsExpanded(!accordionIsExpanded);
              }}
            >
              <List.Accordion
                style={{
                  paddingLeft: 10,
                  height: 60,
                  backgroundColor:
                    colorScheme === "dark" ? "#374151" : "#f3f4f6",
                }}
                title={"Seleccionar un filtro temporal"}
                titleStyle={{
                  color: colorScheme === "dark" ? "white" : "black",
                  fontSize: 15,
                }}
                id="1"
              >
                <ScrollView className="">
                  {
                    // @ts-ignore
                    <>
                      <List.Item
                        style={{
                          paddingLeft: 10,
                          backgroundColor:
                            colorScheme === "dark" ? "#374151" : "#f3f4f6",
                        }}
                        className={`dark:bg-gray-800`}
                        // @ts-ignore
                        key={"lastWeek"}
                        // @ts-ignore
                        title={"Ultimos 7 dias"}
                        // @ts-ignore
                        onPress={() => {
                          setFilter("Ultimos 7 dias");
                          handleFilter(7);
                        }}
                      />
                      <List.Item
                        style={{
                          paddingLeft: 10,
                        }}
                        className={`dark:bg-gray-700`}
                        // @ts-ignore
                        key={"lastMonth"}
                        // @ts-ignore
                        title={"Ultimo mes"}
                        // @ts-ignore
                        onPress={() => {
                          setFilter("Ultimo mes");
                          handleFilter(30);
                        }}
                      />
                      <List.Item
                        style={{
                          paddingLeft: 10,
                        }}
                        className={`dark:bg-gray-700`}
                        // @ts-ignore
                        key={"lastYear"}
                        // @ts-ignore
                        title={"Ultimo año"}
                        // @ts-ignore
                        onPress={() => {
                          setFilter("Ultimo año");
                          handleFilter(365);
                        }}
                      />
                      <List.Item
                        style={{
                          paddingLeft: 10,
                        }}
                        className={`dark:bg-gray-700`}
                        // @ts-ignore
                        key={"all"}
                        // @ts-ignore
                        title={"Total"}
                        // @ts-ignore
                        onPress={() => {
                          setFilter("Total");
                          handleFilter(0);
                        }}
                      />
                    </>
                  }
                </ScrollView>
              </List.Accordion>
            </List.AccordionGroup>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
