import { useContext, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@/contexts/AuthContext";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { SkillSelect } from "@/components/SkillSelect";
import { uploadAvatarToR2 } from "@/services/r2";

export default function EditProfileScreen() {
  const { user, updateUser } = useContext(AuthContext);
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUrl ?? null);
  const [skillIds, setSkillIds] = useState<number[]>(user?.skillIds ?? []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (res.canceled) return;
    const asset = res.assets[0];
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      setError("Ảnh không được vượt quá 5MB");
      return;
    }
    setAvatarUri(asset.uri);
    setError("");
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      let finalAvatarUrl = avatarUri;

      // Nếu URI là local file (chưa upload), upload lên R2
      if (avatarUri && avatarUri.startsWith("file://")) {
        setUploading(true);
        finalAvatarUrl = await uploadAvatarToR2(avatarUri, user.id);
        setUploading(false);
      }

      await updateUser({
        displayName: displayName.trim() || null,
        avatarUrl: finalAvatarUrl,
        skillIds,
      });
      router.back();
    } catch {
      setError("Lưu thất bại, vui lòng thử lại");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
      <Pressable className="items-center mb-5 gap-2" onPress={pickAvatar}>
        <Avatar uri={avatarUri} name={displayName || user.username} size={96} />
        <Text className="text-sm font-lx-md text-primary">Đổi ảnh</Text>
      </Pressable>

      <Input
        label="Tên hiển thị"
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Tên của bạn"
      />

      <SkillSelect selected={skillIds} onChange={setSkillIds} />

      {uploading && (
        <View className="flex-row items-center gap-2 mb-3">
          <ActivityIndicator size="small" color="#0066FF" />
          <Text className="text-sm font-lx text-muted">Đang tải ảnh lên...</Text>
        </View>
      )}

      {error ? <Text className="text-xs font-lx text-error mb-3">{error}</Text> : null}

      <View className="gap-3 mt-4">
        <Button title={saving ? "Đang lưu..." : "Lưu thay đổi"} onPress={save} disabled={saving} />
        <Button title="Hủy" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}
