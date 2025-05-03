import { useEffect } from "react";
import {
  Button,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import TaskItem from "../../components/TaskItem";
import { useTasks } from "../../context/TasksContext";
import { useRouter } from "expo-router";

export default function Index() {
  const { tasks, isLoading, error, getTasks } = useTasks();
  const router = useRouter();

  useEffect(() => {
    getTasks();
  }, []);

  const handleAddTask = () => {
    router.push("/tasks/create");
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <Button title="Retry" onPress={getTasks} />
      </View>
    );
  }

  return (
    <View className="py-8 px-4 flex-1 bg-slate-100">
      <View className="flex-1 gap-2">
        <View className="flex flex-col gap-1">
          <Text className="text-2xl font-bold">Task Manager</Text>
          <Text className="text-gray-500">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} in total
          </Text>
        </View>
        <ScrollView className="flex-1">
          <View className="flex-1 py-3 gap-2">
            {tasks.length === 0 ? (
              <View className="flex-1 justify-center items-center py-8">
                <Text className="text-gray-500 text-center">
                  No tasks yet. Add your first task!
                </Text>
              </View>
            ) : (
              tasks.map((task) => <TaskItem key={task.id} task={task} />)
            )}
          </View>
        </ScrollView>
      </View>
      <View className="absolute bottom-4 left-4 right-4">
        <TouchableOpacity
          onPress={handleAddTask}
          className="bg-blue-500 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Add Task
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
