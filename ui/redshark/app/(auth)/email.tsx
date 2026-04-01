// Man hinh nhap email — kiem tra dinh dang va tai khoan ton tai hay khong
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen() {
  const { checkEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiem tra dinh dang email khi nguoi dung nhap
  const isValid = EMAIL_REGEX.test(email.trim());

  const handleChange = (text: string) => {
    setEmail(text);
    if (error) {
      // Xoa loi khi nguoi dung bat dau sua
      setError(EMAIL_REGEX.test(text.trim()) ? "" : "Email không đúng định dạng");
    }
  };

  const handleBlur = () => {
    if (email.trim() && !isValid) {
      setError("Email không đúng định dạng");
    } else {
      setError("");
    }
  };

  const handleContinue = async () => {
    if (!isValid) return;

    setLoading(true);
    try {
      const exists = await checkEmail(email.trim());
      if (exists) {
        // Tai khoan da ton tai → man hinh nhap mat khau
        router.push({ pathname: "/(auth)/password", params: { email: email.trim() } });
      } else {
        // Tai khoan moi → man hinh hoan thien ho so
        router.push({ pathname: "/(auth)/register", params: { email: email.trim() } });
      }
    } catch {
      setError("Không thể kiểm tra email. Vui lòng thử lại.");
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
          <Text style={styles.title}>Nhập email của bạn</Text>
          <Text style={styles.subtitle}>
            Chúng tôi sẽ kiểm tra xem bạn đã có tài khoản chưa
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="email@uit.edu.vn"
            value={email}
            onChangeText={handleChange}
            onBlur={handleBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
            error={error}
          />

          {/* Nut "Tiep tuc" chi hien khi email hop le */}
          {isValid && (
            <Button
              title={loading ? "Đang kiểm tra..." : "Tiếp tục"}
              onPress={handleContinue}
              disabled={loading}
            />
          )}
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
    fontSize: fontSize.sm,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing[3],
  },
});
