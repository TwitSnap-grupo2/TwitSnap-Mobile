import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  value: string;
  onChangeText: (input: string) => void;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconStyle?: TextStyle;
  onPress?: ((e: NativeSyntheticEvent<NativeTouchEvent>) => void) | undefined;
  autoFocus?: boolean;
}

const TwitterSearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  setSearchQuery,
  containerStyle,
  inputStyle,
  iconStyle,
  onPress,
  autoFocus = false,
}: Props) => {
  //   const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      backgroundColor: getBackgroundColor({ autoFocus, isDarkMode }),
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 8,
      margin: 10,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginLeft: 8,
    },
    icon: {
      color: isDarkMode ? "#8899A6" : "#536471",
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {/* <Ionicons name="search" size={20} style={[styles.icon, iconStyle]} /> */}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Search TwitSnap"
        placeholderTextColor={isDarkMode ? "#8899A6" : "#536471"}
        value={value}
        onChangeText={onChangeText}
        onPress={onPress}
        autoFocus={autoFocus}
        // onSubmitEditing={handleSearch}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery("")}>
          <Ionicons
            name="close-circle"
            size={20}
            style={[styles.icon, iconStyle]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

function getBackgroundColor({
  autoFocus,
  isDarkMode,
}: {
  autoFocus: boolean;
  isDarkMode: boolean;
}): string {
  if (isDarkMode) {
    if (autoFocus) {
      return "#000";
    }
    return "#253341";
  }

  if (autoFocus) {
    return "#fff";
  }
  return "#EFF3F4";
}

export default TwitterSearchBar;
