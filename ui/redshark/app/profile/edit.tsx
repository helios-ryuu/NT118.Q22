import { useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@/contexts/AuthContext";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { User } from "@/types/user";
import { colors, fonts, text, spacing } from "@/constants/theme";

export default function EditProfileScreen() {
  const { user, updateUser } = useContext(AuthContext);
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatarUri, setAvatarUri] = useState(user?.avatar ?? null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (res.canceled) return;
    const asset = res.assets[0];
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) { setError("Ảnh không được vượt quá 5MB"); return; }
    setAvatarUri(asset.uri);
    setError("");
  };

  const save = async () => {
    if (!name.trim()) { setError("Tên không được để trống"); return; }
    if (!user) return;
    setSaving(true);
    try {
      await api.put(endpoints.users.byId(user.id), { name: name.trim(), bio: bio.trim() || null, avatar: avatarUri });
      const refreshed = await api.get<User>(endpoints.users.byId(user.id));
      await updateUser(refreshed);
      router.back();
    } catch {
      setError("Lưu thất bại, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Pressable style={s.avatarWrap} onPress={pickAvatar}>
        <Avatar uri={avatarUri} name={name || user.email} size={96} />
        <Text style={s.changePhoto}>Đổi ảnh</Text>
      </Pressable>
      <Input label="Họ tên" value={name} onChangeText={setName} />
      <Input label="Giới thiệu" value={bio} onChangeText={setBio} multiline numberOfLines={3} style={s.bio} />
      {error ? <Text style={s.error}>{error}</Text> : null}
      <View style={s.actions}>
        <Button title={saving ? "Đang lưu..." : "Lưu thay đổi"} onPress={save} />
        <Button title="Hủy" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[5], paddingBottom: spacing[8] },
  avatarWrap: { alignItems: "center", marginBottom: spacing[5], gap: spacing[2] },
  changePhoto: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.primary },
  bio: { height: 80, textAlignVertical: "top" },
  error: { fontSize: text.xs, fontFamily: fonts.regular, color: colors.error, marginBottom: spacing[3] },
  actions: { gap: spacing[3], marginTop: spacing[4] },
});
