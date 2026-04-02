import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";

export default function PasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    setLoading(true);
    try {
      await login(email ?? "", password);
      router.replace("/(tabs)");
    } catch {
      setError("Mật khẩu không đúng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }} keyboardShouldPersistTaps="handled">
        <View className="mb-6">
          <Text className="text-2xl font-lx-bold text-foreground mb-2">Chào mừng trở lại</Text>
          <Text className="text-base font-lx text-muted">{email}</Text>
        </View>
        <Input
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={t => {
            setPassword(t);
            if (error) setError("");
          }}
          secureTextEntry
          error={error}
          autoFocus
        />
        <Button title={loading ? "Đang đăng nhập..." : "Đăng nhập"} onPress={submit} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
