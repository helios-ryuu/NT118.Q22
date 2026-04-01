// Man hinh nhap mat khau — cho tai khoan da ton tai
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

export default function PasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Chào mừng trở lại</Text>
          <Text style={styles.subtitle}>{email}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={(t) => { setPassword(t); setError(""); }}
            secureTextEntry
            error={error}
            autoFocus
          />
          <Button
            title={loading ? "Đang đăng nhập..." : "Đăng nhập"}
            onPress={handleLogin}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing[6],
  },
  header: {
    marginBottom: spacing[7],
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: fontSize.md,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing[3],
  },
});
