import { useContext, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@/contexts/AuthContext";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { User } from "@/types/user";

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
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
      <Pressable className="items-center mb-5 gap-2" onPress={pickAvatar}>
        <Avatar uri={avatarUri} name={name || user.email} size={96} />
        <Text className="text-sm font-lx-md text-primary">Đổi ảnh</Text>
      </Pressable>
      <Input label="Họ tên" value={name} onChangeText={setName} />
      <Input label="Giới thiệu" value={bio} onChangeText={setBio} multiline numberOfLines={3} style={{ height: 80, textAlignVertical: "top" }} />
      {error ? <Text className="text-xs font-lx text-error mb-3">{error}</Text> : null}
      <View className="gap-3 mt-4">
        <Button title={saving ? "Đang lưu..." : "Lưu thay đổi"} onPress={save} />
        <Button title="Hủy" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}
