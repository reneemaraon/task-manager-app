import {
  TextInput as RNTextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useState, useRef } from "react";
export interface SelectOption {
  label: string;
  value: any;
}

interface SearchSelectProps extends TextInputProps {
  error?: boolean;
  selectOptions: SelectOption[];
  onSelect: (option: SelectOption) => void;
}

export function SearchSelect({
  className = "",
  error,
  selectOptions = [],
  onSelect,
  ...props
}: SearchSelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<RNTextInput>(null); // Create a ref for the input

  const forceBlur = () => {
    inputRef.current?.blur(); // Call blur on the input ref
  };

  const onOptionSelect = (option: SelectOption) => {
    onSelect?.(option);
    setIsFocused(false);
    forceBlur();
  };

  return (
    <View>
      <RNTextInput
        className={`bg-gray-100 px-4 py-3 rounded-lg ${
          error ? "border border-red-500" : ""
        } ${className}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        {...props}
      />
      {isFocused && (
        <View className="z-[100] overflow-scroll absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto">
          {selectOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
              onPress={() => onOptionSelect(option)}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
