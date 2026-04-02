import { useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, type TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { colors, fonts, text, spacing } from "@/constants/theme";

const USERNAME_RE = /^[a-zA-Z0-9._]+$/;
const validPw = (p: string) => p.length >= 8 && /[a-zA-Z]/.test(p) && /[0-9]/.test(p) && /^[a-zA-Z0-9]+$/.test(p);

export default function RegisterScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { register } = useAuth();
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initials = (email ?? "").split("@")[0].slice(0, 2).toUpperCase();
  const err = (k: string, v: string) => setErrors(e => ({ ...e, [k]: v }));

  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (res.canceled) return;
    const asset = res.assets[0];
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) { err("avatar", "Ảnh không được vượt quá 5MB"); return; }
    setAvatarUri(asset.uri);
    err("avatar", "");
  };

  const birthday = () => {
    const d = parseInt(day), m = parseInt(month), y = parseInt(year);
    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) return null;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!birthday()) e.birthday = "Ngày sinh không hợp lệ";
    if (!username.trim()) e.username = "Vui lòng nhập username";
    else if (!USERNAME_RE.test(username)) e.username = "Chỉ chấp nhận chữ, số, dấu chấm và gạch dưới";
    if (!validPw(password)) e.password = "Tối thiểu 8 ký tự, gồm ít nhất 1 chữ và 1 số";
    if (password !== confirm) e.confirm = "Mật khẩu xác nhận không khớp";
    if (Object.values(e).some(Boolean)) { setErrors(e); return; }

    setLoading(true);
    try {
      await register({ email: email ?? "", name: name.trim(), username: username.trim(), birthday: birthday() ?? "", password, avatarUri });
      router.replace("/(tabs)");
    } catch {
      err("form", "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Hoàn thiện tài khoản</Text>

        <Pressable style={s.avatarWrap} onPress={pickAvatar}>
          {avatarUri
            ? <Image source={{ uri: avatarUri }} style={s.avatar} />
            : <View style={s.avatarFallback}><Text style={s.initials}>{initials}</Text></View>
          }
          <Text style={s.changePhoto}>Tải ảnh đại diện</Text>
          {errors.avatar ? <Text style={s.errText}>{errors.avatar}</Text> : null}
        </Pressable>

        <Input label="Họ và tên" placeholder="Nguyễn Văn A" value={name} onChangeText={t => { setName(t); err("name", ""); }} error={errors.name} />

        <View style={s.dateWrap}>
          <Text style={s.dateLabel}>Ngày sinh</Text>
          <View style={s.dateRow}>
            <Input style={s.dateField} placeholder="DD" value={day} onChangeText={t => { const v = t.replace(/\D/g, "").slice(0, 2); setDay(v); if (v.length === 2) monthRef.current?.focus(); }} keyboardType="number-pad" maxLength={2} />
            <Text style={s.sep}>/</Text>
            <Input ref={monthRef} style={s.dateField} placeholder="MM" value={month} onChangeText={t => { const v = t.replace(/\D/g, "").slice(0, 2); setMonth(v); if (v.length === 2) yearRef.current?.focus(); }} keyboardType="number-pad" maxLength={2} />
            <Text style={s.sep}>/</Text>
            <Input ref={yearRef} style={[s.dateField, s.yearField]} placeholder="YYYY" value={year} onChangeText={t => setYear(t.replace(/\D/g, "").slice(0, 4))} keyboardType="number-pad" maxLength={4} />
          </View>
          {errors.birthday ? <Text style={s.errText}>{errors.birthday}</Text> : null}
        </View>

        <Input label="Username" placeholder="username_cua_ban" value={username} onChangeText={t => { setUsername(t); err("username", ""); }} autoCapitalize="none" error={errors.username} />
        <Input label="Mật khẩu" placeholder="Tối thiểu 8 ký tự, gồm chữ và số" value={password} onChangeText={t => { setPassword(t); err("password", ""); }} secureTextEntry error={errors.password} />
        <Input label="Nhập lại mật khẩu" placeholder="Xác nhận mật khẩu" value={confirm} onChangeText={t => { setConfirm(t); err("confirm", ""); }} secureTextEntry error={errors.confirm} />

        {errors.form ? <Text style={s.errText}>{errors.form}</Text> : null}
        <Button title={loading ? "Đang xử lý..." : "Hoàn tất và tiếp tục"} onPress={submit} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: spacing[5] },
  title: { fontSize: text.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[5] },
  avatarWrap: { alignItems: "center", marginBottom: spacing[5], gap: spacing[2] },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarFallback: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  initials: { fontSize: text.xxl, fontFamily: fonts.bold, color: colors.primary },
  changePhoto: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.primary },
  dateWrap: { marginBottom: spacing[3] },
  dateLabel: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.text, marginBottom: spacing[1] },
  dateRow: { flexDirection: "row", alignItems: "center", gap: spacing[1] },
  dateField: { flex: 1, textAlign: "center", marginBottom: 0 },
  yearField: { flex: 1.5 },
  sep: { fontSize: text.lg, color: colors.textSecondary },
  errText: { fontSize: text.xs, color: colors.error, fontFamily: fonts.regular },
});
