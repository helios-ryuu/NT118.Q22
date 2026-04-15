import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
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
      // AuthGate tự navigate khi user state thay đổi
    } catch {
      setError("Mật khẩu không đúng. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }} keyboardShouldPersistTaps="handled">
        <View className="items-center mb-10">
          <Image
            source={require("@/assets/images/logo_text_vertical.png")}
            style={{ width: 140, height: 140 }}
            resizeMode="contain"
          />
        </View>
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
