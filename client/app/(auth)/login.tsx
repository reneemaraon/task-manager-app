import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { TextInput } from "../../components/ui/TextInput";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/");
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  const handleRegister = () => {
    router.push("/register");
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
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-center mb-4">
              Sign in to continue
            </Text>
          </View>

          <View className="flex flex-col gap-3">
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`bg-blue-500 py-3 rounded-lg ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center space-x-1">
            <Text className="text-gray-500">Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text className="text-blue-500 font-semibold"> Sign Up</Text>
            </TouchableOpacity>
          </View>
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
