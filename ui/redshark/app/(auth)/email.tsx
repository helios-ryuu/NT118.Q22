import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { colors, fonts, text, spacing } from "@/constants/theme";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen() {
  const { checkEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = EMAIL_RE.test(email.trim());

  const next = async () => {
    if (!valid) return;
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
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Text style={s.title}>Nhập email của bạn</Text>
          <Text style={s.subtitle}>Chúng tôi sẽ kiểm tra tài khoản của bạn</Text>
        </View>
        <Input
          label="Email"
          placeholder="email@uit.edu.vn"
          value={email}
          onChangeText={t => { setEmail(t); setError(""); }}
          onBlur={() => { if (email.trim() && !valid) setError("Email không đúng định dạng"); }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
          error={error}
        />
        {valid && <Button title={loading ? "Đang kiểm tra..." : "Tiếp tục"} onPress={next} disabled={loading} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: "center", padding: spacing[6] },
  header: { marginBottom: spacing[6] },
  title: { fontSize: text.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[2] },
  subtitle: { fontSize: text.sm, fontFamily: fonts.regular, color: colors.textSecondary },
});
