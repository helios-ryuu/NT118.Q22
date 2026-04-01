// Man hinh hoan thien tai khoan — avatar, ten, ngay sinh, username, mat khau
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  type TextInput,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

// Lay 2 ky tu dau cua phan truoc @ trong email lam initials
function getEmailInitials(email: string): string {
  const local = email.split("@")[0] ?? "";
  return local.slice(0, 2).toUpperCase();
}

// Username: chi cho phep chu, so, dau cham, gach duoi
const USERNAME_REGEX = /^[a-zA-Z0-9._]+$/;
// Mat khau: 8+ ky tu, chi chu va so, it nhat 1 chu va 1 so
const PASSWORD_HAS_LETTER = /[a-zA-Z]/;
const PASSWORD_HAS_NUMBER = /[0-9]/;
const PASSWORD_ONLY_ALNUM = /^[a-zA-Z0-9]+$/;

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

export default function RegisterScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { register } = useAuth();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Loi validation theo tung field
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initials = getEmailInitials(email ?? "");

  // Chon anh dai dien tu thu vien
  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_AVATAR_SIZE) {
      setErrors((prev) => ({ ...prev, avatar: "Ảnh đại diện không được vượt quá 5MB" }));
      return;
    }
    setErrors((prev) => ({ ...prev, avatar: "" }));
    setAvatarUri(asset.uri);
  };

  // Parse ngay sinh tu 3 field
  const parseBirthday = (): string | null => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
      return null;
    }
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  // Validate username khi nhap
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (text && !USERNAME_REGEX.test(text)) {
      setErrors((prev) => ({
        ...prev,
        username: "Chỉ chấp nhận chữ, số, dấu chấm và gạch dưới",
      }));
    } else {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  // Validate password khi nhap
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text && !validatePassword(text)) {
      setErrors((prev) => ({
        ...prev,
        password: "Tối thiểu 8 ký tự, gồm ít nhất 1 chữ và 1 số, chỉ chữ và số",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const validatePassword = (pw: string) =>
    pw.length >= 8 &&
    PASSWORD_HAS_LETTER.test(pw) &&
    PASSWORD_HAS_NUMBER.test(pw) &&
    PASSWORD_ONLY_ALNUM.test(pw);

  // Submit form
  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!parseBirthday()) newErrors.birthday = "Ngày sinh không hợp lệ";
    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập username";
    } else if (!USERNAME_REGEX.test(username)) {
      newErrors.username = "Chỉ chấp nhận chữ, số, dấu chấm và gạch dưới";
    }
    if (!validatePassword(password)) {
      newErrors.password =
        "Tối thiểu 8 ký tự, gồm ít nhất 1 chữ và 1 số, chỉ chữ và số";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email ?? "",
        name: name.trim(),
        username: username.trim(),
        birthday: parseBirthday() ?? "",
        password,
        avatarUri,
      });
      router.replace("/(tabs)");
    } catch {
      setErrors((prev) => ({ ...prev, form: "Đăng ký thất bại. Vui lòng thử lại." }));
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
        <Text style={styles.title}>Hoàn thiện tài khoản</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
          <Button title="Tải ảnh đại diện" variant="outline" onPress={pickAvatar} />
          {errors.avatar ? <Text style={styles.errorText}>{errors.avatar}</Text> : null}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={name}
            onChangeText={(t) => {
              setName(t);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            error={errors.name}
          />

          {/* Ngay sinh — 3 input nho: ngay, thang, nam */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Ngày sinh</Text>
            <View style={styles.dateRow}>
              <Input
                style={styles.dateInput}
                placeholder="DD"
                value={day}
                onChangeText={(t) => {
                  const v = t.replace(/\D/g, "").slice(0, 2);
                  setDay(v);
                  setErrors((prev) => ({ ...prev, birthday: "" }));
                  if (v.length === 2) monthRef.current?.focus();
                }}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.dateSep}>/</Text>
              <Input
                ref={monthRef}
                style={styles.dateInput}
                placeholder="MM"
                value={month}
                onChangeText={(t) => {
                  const v = t.replace(/\D/g, "").slice(0, 2);
                  setMonth(v);
                  setErrors((prev) => ({ ...prev, birthday: "" }));
                  if (v.length === 2) yearRef.current?.focus();
                }}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.dateSep}>/</Text>
              <Input
                ref={yearRef}
                style={[styles.dateInput, styles.yearInput]}
                placeholder="YYYY"
                value={year}
                onChangeText={(t) => {
                  setYear(t.replace(/\D/g, "").slice(0, 4));
                  setErrors((prev) => ({ ...prev, birthday: "" }));
                }}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
            {errors.birthday ? (
              <Text style={styles.errorText}>{errors.birthday}</Text>
            ) : null}
          </View>

          <Input
            label="Username"
            placeholder="username_cua_ban"
            value={username}
            onChangeText={handleUsernameChange}
            autoCapitalize="none"
            error={errors.username}
          />

          <Input
            label="Mật khẩu"
            placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            error={errors.password}
          />

          <Input
            label="Nhập lại mật khẩu"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            secureTextEntry
            error={errors.confirmPassword}
          />

          {errors.form ? <Text style={styles.errorText}>{errors.form}</Text> : null}

          <Button
            title={loading ? "Đang xử lý..." : "Hoàn tất và tiếp tục"}
            onPress={handleSubmit}
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
    padding: spacing[6],
    paddingTop: spacing[4],
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing[6],
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing[6],
    gap: spacing[3],
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: fontSize.xxl,
    fontFamily: fonts.bold,
    color: "#fff",
  },
  form: {
    gap: spacing[1],
  },
  fieldWrapper: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: spacing[1],
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  dateInput: {
    flex: 1,
    textAlign: "center",
  },
  yearInput: {
    flex: 1.5,
  },
  dateSep: {
    fontSize: fontSize.lg,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.regular,
    color: colors.error,
    marginTop: spacing[1],
  },
});
