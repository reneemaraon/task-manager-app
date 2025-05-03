import React, { useRef, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerProps {
  className?: string;
  error?: boolean;
  dueDate: string;
  setDueDate: (date: string) => void;
}
export function DatePicker({
  className,
  error,
  dueDate,
  setDueDate,
  ...props
}: DatePickerProps) {
  // Inside your component
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateInputRef = useRef<TextInput>(null);

  const forceBlur = () => {
    dateInputRef.current?.blur();
  };

  const onChange = (event: any, selectedDate: Date | undefined) => {
    if (event.type === "dismissed") {
      // User canceled the picker, do nothing or handle accordingly
      setShowDatePicker(false);
      forceBlur();
      return;
    }

    if (selectedDate && !isNaN(selectedDate.getTime())) {
      const currentDate = selectedDate || new Date();
      setDueDate(currentDate.toISOString());
    }
    setShowDatePicker(false);
    forceBlur();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className={`bg-gray-100 px-4 py-3 rounded-lg ${
          error ? "border border-red-500" : ""
        } ${className}`}
      >
        <Text>{new Date(dueDate).toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate ? new Date(dueDate) : new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}
