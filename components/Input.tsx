import { useColorScheme } from "@/hooks/useColorScheme";
import { TextInput, Text, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

interface InputProps {
  name: string;
  placeholder: string;
  onChangeText: (e: any) => void;
  value: any;
  onBlur: (e: any) => void;
  errorMessage: string | undefined;
  isTouched: boolean | undefined;
}

const Input = (props: InputProps) => {
  const colorScheme = useColorScheme();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  return (
    <View>
      <View
        className={`flex flex-row align-text-middle rounded-full p-3 border-1 ${
          props.errorMessage && props.isTouched
            ? "border-red-500 bg-red-50 " // Red border, light red background, and red text color for errors
            : "border-transparent bg-gray-100 dark:bg-gray-700"
        }`}
      >
        <TextInput
          placeholder={props.placeholder}
          id={props.name}
          onChangeText={props.onChangeText}
          value={props.value}
          keyboardType={props.name == "email" ? "email-address" : "default"}
          autoCapitalize="none"
          onBlur={props.onBlur}
          secureTextEntry={props.name == "password" ? secureTextEntry : false}
          placeholderTextColor={
            props.errorMessage && props.isTouched
              ? "#FF0000"
              : colorScheme === "dark"
              ? "#ccc"
              : "#888"
          }
          className={`flex-1 px-4 ${
            props.errorMessage && props.isTouched
              ? "text-red-600"
              : "text-black dark:text-white"
          } `}
        />
        {props.name == "password" ? (
          <TouchableOpacity
            className="px-1 mt-1.5"
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            activeOpacity={0.6}
          >
            <Octicons
              name={secureTextEntry ? "eye" : "eye-closed"}
              size={20}
              color={props.errorMessage && props.isTouched ? "black" : "white"}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <View
        style={{
          minHeight: 15,
          marginLeft: 11,
          marginVertical: 1,
        }}
      >
        {props.errorMessage && props.isTouched ? (
          <Text className="mb-1 text-red-600 ">{props.errorMessage}</Text>
        ) : null}
      </View>
    </View>
  );
};
export default Input;
