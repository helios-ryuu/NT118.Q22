import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { colors, fonts, text, spacing } from "@/constants/theme";

export default function PasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!password.trim()) { setError("Vui lòng nhập mật khẩu"); return; }
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
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Text style={s.title}>Chào mừng trở lại</Text>
          <Text style={s.subtitle}>{email}</Text>
        </View>
        <Input label="Mật khẩu" placeholder="Nhập mật khẩu" value={password} onChangeText={t => { setPassword(t); setError(""); }} secureTextEntry error={error} autoFocus />
        <Button title={loading ? "Đang đăng nhập..." : "Đăng nhập"} onPress={submit} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: "center", padding: spacing[6] },
  header: { marginBottom: spacing[6] },
  title: { fontSize: text.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[2] },
  subtitle: { fontSize: text.md, fontFamily: fonts.regular, color: colors.textSecondary },
});
