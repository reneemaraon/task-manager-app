import { TaskData } from "@/services/tasks";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const TaskStatus = ({ status }: { status: string }) => {
  let statusColor = "#ffedd5";
  let statusTextColor = "#c2410c";
  if (status === "In Progress") {
    statusColor = "#bae6fd";
    statusTextColor = "#075985";
  } else if (status === "Done") {
    statusColor = "#dcfce7";
    statusTextColor = "#14532d";
  }

  return (
    <View
      className={`relative border-2 flex-row items-center justify-center rounded-full`}
      style={{
        backgroundColor: statusColor,
        borderColor: statusTextColor,
        borderWidth: 0.5,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
      }}
    >
      <View>
        <Text style={{ color: statusTextColor }} className="text-sm font-bold">
          {status}
        </Text>
      </View>
    </View>
  );
};

const TaskItem = ({ task }: { task: TaskData }) => {
  const handlePress = () => {
    router.push(`/tasks/edit?id=${task.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex flex-col rounded-lg border border-slate-200 bg-white w-full"
    >
      <View className="flex flex-col gap-2 p-3 w-full">
        <View className="flex flex-row justify-between">
          <TaskStatus status={task.status} />
        </View>
        <View className="flex flex-col gap-0.5 ">
          <Text className="text-lg font-bold">{task.title}</Text>
          <Text className="text-sm font-medium text-slate-900">
            {task.description}
          </Text>
        </View>
        <View>
          <View className="flex flex-row items-center justify-between gap-3 w-full">
            <Text className="text-sm text-slate-900">
              Assignee:{" "}
              <Text className="font-bold text-blue-500">
                {task.assigned_user?.name}
              </Text>
            </Text>
            <Text className="text-sm text-slate-900">
              Due Date:{" "}
              <Text className="font-bold text-blue-500">
                {new Date(task.due_date).toLocaleDateString()}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TaskItem;
