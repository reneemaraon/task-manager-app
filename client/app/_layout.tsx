import { Redirect, Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { TasksProvider } from "@/context/TasksContext";
import { View, ActivityIndicator } from "react-native";
import "./globals.css";

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TasksProvider>
        <RootLayoutNav />
      </TasksProvider>
    </AuthProvider>
  );
}
