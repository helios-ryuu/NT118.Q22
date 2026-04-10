import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";

const USERNAME_RE = /^[a-zA-Z0-9._]+$/;
const validPw = (p: string) => p.length >= 8 && /[a-zA-Z]/.test(p) && /[0-9]/.test(p) && /^[a-zA-Z0-9]+$/.test(p);

export default function RegisterScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { register } = useAuth();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
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
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      err("avatar", "Ảnh không được vượt quá 5MB");
      return;
    }
    setAvatarUri(asset.uri);
    err("avatar", "");
  };

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!displayName.trim()) e.displayName = "Vui lòng nhập họ tên";
    if (!username.trim()) e.username = "Vui lòng nhập username";
    else if (!USERNAME_RE.test(username)) e.username = "Chỉ chấp nhận chữ, số, dấu chấm và gạch dưới";
    if (!validPw(password)) e.password = "Tối thiểu 8 ký tự, gồm ít nhất 1 chữ và 1 số";
    if (password !== confirm) e.confirm = "Mật khẩu xác nhận không khớp";
    if (Object.values(e).some(Boolean)) { setErrors(e); return; }

    setLoading(true);
    try {
      await register({
        email: email ?? "",
        displayName: displayName.trim(),
        username: username.trim(),
        password,
      });
      router.replace("/(tabs)");
    } catch {
      err("form", "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }} keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-lx-bold text-foreground mb-5">Hoàn thiện tài khoản</Text>

        <Pressable className="items-center mb-5 gap-2" onPress={pickAvatar}>
          {avatarUri
            ? <Image source={{ uri: avatarUri }} style={{ width: 96, height: 96, borderRadius: 48 }} />
            : <View className="w-24 h-24 rounded-full bg-primary-light items-center justify-center">
                <Text className="text-[32px] font-lx-bold text-primary">{initials}</Text>
              </View>
          }
          <Text className="text-sm font-lx-md text-primary">Tải ảnh đại diện</Text>
          {errors.avatar ? <Text className="text-xs text-error font-lx">{errors.avatar}</Text> : null}
        </Pressable>

        <Input
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          value={displayName}
          onChangeText={t => { setDisplayName(t); if (errors.displayName) err("displayName", ""); }}
          error={errors.displayName}
        />

        <Input
          label="Username"
          placeholder="username_cua_ban"
          value={username}
          onChangeText={t => { setUsername(t); if (errors.username) err("username", ""); }}
          autoCapitalize="none"
          error={errors.username}
        />

        <Input
          label="Mật khẩu"
          placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
          value={password}
          onChangeText={t => { setPassword(t); if (errors.password) err("password", ""); }}
          secureTextEntry
          error={errors.password}
        />

        <Input
          label="Nhập lại mật khẩu"
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          onChangeText={t => { setConfirm(t); if (errors.confirm || errors.form) { err("confirm", ""); err("form", ""); } }}
          secureTextEntry
          error={errors.confirm}
        />

        {errors.form ? <Text className="text-xs text-error font-lx mb-2">{errors.form}</Text> : null}
        <Button title={loading ? "Đang xử lý..." : "Hoàn tất và tiếp tục"} onPress={submit} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
