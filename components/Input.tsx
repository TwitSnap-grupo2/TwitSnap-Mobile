import { useColorScheme } from "@/hooks/useColorScheme";
import { TextInput, Text, View, ColorSchemeName } from "react-native";

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
  return (
    <View>
      <TextInput
        placeholder={props.placeholder}
        id={props.name}
        onChangeText={props.onChangeText}
        value={props.value}
        onBlur={props.onBlur}
        placeholderTextColor={
          props.errorMessage && props.isTouched
            ? "#FF0000"
            : colorScheme === "dark"
            ? "#ccc"
            : "#888"
        }
        className={`p-3 rounded-lg border ${
          props.errorMessage && props.isTouched
            ? "border-red-500 bg-red-50 text-red-600" // Red border, light red background, and red text color for errors
            : "border-transparent bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        }  rounded-full`}
      />
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
