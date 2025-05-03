import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput } from "../../components/ui/TextInput";
import { SearchSelect, SelectOption } from "@/components/ui/SearchSelect";
import { useTasks } from "@/context/TasksContext";
import { DatePicker } from "@/components/ui/DatePicker";
import { router } from "expo-router";

const statusOptions = [
  { label: "To Do", value: "to_do" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

interface Assignee {
  id: number;
  name: string;
}

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [asignee, setAsignee] = useState<Assignee>({ id: 0, name: "" });
  const [status, setStatus] = useState<SelectOption>({
    label: "To Do",
    value: "to_do",
  });
  const [dueDate, setDueDate] = useState(new Date().toISOString());
  const { users, searchUsers, createTask, isLoading, error } = useTasks();

  useEffect(() => {
    searchUsers(asignee?.name || "");
  }, []);

  const onSelectAsignee = (option: SelectOption) => {
    setAsignee({ id: option.value, name: option.label });
  };

  const onSearchSelectInputChange = (text: string) => {
    setAsignee({ id: 0, name: text });
    searchUsers(text);
  };

  const handleCreateTask = async () => {
    const success = await createTask({
      title,
      description,
      assignedUserId: asignee?.id,
      dueDate,
      status: status.label,
    });

    if (success) {
      router.push("/");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex flex-col justify-center h-full gap-2 px-8">
        <View className="flex flex-col gap-8">
          <View>
            <Text className="text-3xl font-bold mb-4 text-center">
              Create Task
            </Text>
            <Text className="text-gray-500 text-center mb-4">
              Create a new task
            </Text>
          </View>

          <View className="flex flex-col gap-3">
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="words"
            />

            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <SearchSelect
              placeholder="Asignee"
              value={asignee?.name}
              onChangeText={onSearchSelectInputChange}
              selectOptions={users.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              onSelect={onSelectAsignee}
            />

            <SearchSelect
              placeholder="Status"
              value={status?.label}
              onChangeText={onSearchSelectInputChange}
              selectOptions={statusOptions}
              onSelect={(option) => setStatus(option)}
            />

            <DatePicker dueDate={dueDate} setDueDate={setDueDate} />
          </View>

          <TouchableOpacity
            onPress={handleCreateTask}
            disabled={isLoading}
            className={`bg-blue-500 py-3 rounded-lg ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Create Task
              </Text>
            )}
          </TouchableOpacity>

          {error && (
            <View className="bg-red-100 p-3 rounded-lg">
              <Text className="text-red-500 text-center">{error}</Text>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
