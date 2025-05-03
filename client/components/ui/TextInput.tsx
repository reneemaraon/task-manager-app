import { TextInput as RNTextInput, TextInputProps } from "react-native";

interface CustomTextInputProps extends TextInputProps {
  error?: boolean;
}

export function TextInput({
  className = "",
  error,
  ...props
}: CustomTextInputProps) {
  return (
    <RNTextInput
      className={`bg-gray-100 px-4 py-3 rounded-lg ${
        error ? "border border-red-500" : ""
      } ${className}`}
      {...props}
    />
  );
}
