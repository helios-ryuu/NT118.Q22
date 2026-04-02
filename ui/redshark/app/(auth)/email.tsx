import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen() {
  const { checkEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = EMAIL_RE.test(email.trim());

  const next = async () => {
    if (!valid) {
      setError("Email không đúng định dạng");
      return;
    }
    setLoading(true);
    try {
      const exists = await checkEmail(email.trim());
      router.push(exists
        ? { pathname: "/(auth)/password", params: { email: email.trim() } }
        : { pathname: "/(auth)/register", params: { email: email.trim() } }
      );
    } catch {
      setError("Không thể kiểm tra email. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }} keyboardShouldPersistTaps="handled">
        <View className="mb-6">
          <Text className="text-2xl font-lx-bold text-foreground mb-2">Nhập email của bạn</Text>
          <Text className="text-sm font-lx text-muted">Chúng tôi sẽ kiểm tra tài khoản của bạn</Text>
        </View>
        <Input
          label="Email"
          placeholder="email@uit.edu.vn"
          value={email}
          onChangeText={t => {
            setEmail(t);
            if (error) setError("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
          error={error}
        />
        <Button title={loading ? "Đang kiểm tra..." : "Tiếp tục"} onPress={next} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
