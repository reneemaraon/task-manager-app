import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput } from "../../components/ui/TextInput";
import { SearchSelect, SelectOption } from "@/components/ui/SearchSelect";
import { useTasks } from "@/context/TasksContext";
import { DatePicker } from "@/components/ui/DatePicker";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { TaskData } from "@/services/tasks";

const statusOptions = [
  { label: "To Do", value: "to_do" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

interface Assignee {
  id: number;
  name: string;
}

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [asignee, setAsignee] = useState<Assignee>({ id: 0, name: "" });
  const [task, setTask] = useState<TaskData | null>(null);
  const [status, setStatus] = useState<SelectOption>({
    label: "To Do",
    value: "to_do",
  });
  const [dueDate, setDueDate] = useState(new Date().toISOString());
  const {
    users,
    searchUsers,
    getTask,
    updateTask,
    isLoading,
    error,
    deleteTask,
  } = useTasks();

  const { user } = useAuth();

  useEffect(() => {
    searchUsers(asignee?.name || "");
  }, []);

  const fetchTask = async () => {
    const task = await getTask(id);
    if (task) {
      setTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setAsignee({ id: task.assigned_user_id, name: task.assigned_user?.name });
      setStatus(
        statusOptions.find((option) => option.label === task.status) || {
          label: "To Do",
          value: "to_do",
        }
      );
      setDueDate(new Date(task.due_date).toISOString());
    }
  };

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const onSelectAsignee = (option: SelectOption) => {
    setAsignee({ id: option.value, name: option.label });
  };

  const onSearchSelectInputChange = (text: string) => {
    setAsignee({ id: 0, name: text });
    searchUsers(text);
  };

  const handleCreateTask = async () => {
    const success = await updateTask(id, {
      title,
      description,
      assigned_user_id: asignee?.id,
      due_date: dueDate,
      status: status.label,
    });

    if (success) {
      router.push("/");
    }
  };

  const handleDeleteTask = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const success = await deleteTask(id);
            if (success) {
              router.push("/");
            }
          },
          style: "destructive",
        },
      ]
    );
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
              Task Details
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

          {user?.id === task?.user_id && (
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
                  Update Task
                </Text>
              )}
            </TouchableOpacity>
          )}
          {user?.id === task?.user_id && (
            <TouchableOpacity
              onPress={handleDeleteTask}
              disabled={isLoading}
              className={`bg-red-500 py-3 rounded-lg ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Delete Task
                </Text>
              )}
            </TouchableOpacity>
          )}

          {user?.id !== task?.user_id && (
            <Text>
              Assigned to you by{" "}
              <Text className="text-blue-500 font-bold">{task?.user.name}</Text>
            </Text>
          )}
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
