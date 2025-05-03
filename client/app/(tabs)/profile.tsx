import { View, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 bg-white p-6">
      <View className="space-y-4">
        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="text-gray-500">Name</Text>
          <Text className="text-lg font-semibold">{user?.name}</Text>
        </View>

        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="text-gray-500">Email</Text>
          <Text className="text-lg font-semibold">{user?.email}</Text>
        </View>

        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="text-gray-500">User ID</Text>
          <Text className="text-lg font-semibold">{user?.id}</Text>
        </View>
        <View className="mt-8">
          <View className="bg-red-500 p-4 rounded-lg">
            <Text
              className="text-white text-center text-lg font-semibold"
              onPress={logout}
            >
              Logout
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
