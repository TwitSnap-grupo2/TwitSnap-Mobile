import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
const { width } = Dimensions.get("window");

const tabs = ["Search", "Recommendations"];

export default function TabNavigation() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState("Search");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === "dark" ? "black" : "white" },
      ]}
    >
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1DA1F2",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#687684",
  },
  activeTabText: {
    color: "#1DA1F2",
  },
});
