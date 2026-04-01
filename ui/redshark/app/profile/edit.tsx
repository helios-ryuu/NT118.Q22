// Chinh sua ho so — ten, bio va avatar
import { useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Avatar } from "@/components/common/Avatar";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import type { User } from "@/types/user";

export default function EditProfileScreen() {
  const { user, updateUser } = useContext(AuthContext);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatarUri, setAvatarUri] = useState(user?.avatar ?? null);
  const [error, setError] = useState("");

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        setError("Ảnh không được vượt quá 5MB");
        return;
      }
      setAvatarUri(asset.uri);
      setError("");
    }
  };

  const save = async () => {
    if (!name.trim()) {
      setError("Tên không được để trống");
      return;
    }
    if (!user) return;
    setSaving(true);
    try {
      // Cap nhat thong tin co ban
      await api.put(endpoints.users.byId(user.id), {
        name: name.trim(),
        bio: bio.trim() || null,
        avatar: avatarUri,
      });

      // Lay lai user moi nhat tu server
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <Pressable style={styles.avatarWrap} onPress={pickAvatar}>
        <Avatar uri={avatarUri} name={name || user.email} size={96} />
        <Text style={styles.changePhoto}>Đổi ảnh</Text>
      </Pressable>

      <Input label="Họ tên" value={name} onChangeText={setName} />
      <Input
        label="Giới thiệu"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={3}
        style={styles.bioInput}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <Button title={saving ? "Đang lưu..." : "Lưu thay đổi"} onPress={save} />
        <Button title="Hủy" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: spacing[5],
  },
  changePhoto: {
    fontSize: fontSize.sm,
    fontFamily: fonts.medium,
    color: colors.primary,
    marginTop: spacing[2],
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  error: {
    fontSize: fontSize.xs,
    fontFamily: fonts.regular,
    color: colors.error,
    marginBottom: spacing[3],
  },
  actions: {
    gap: spacing[3],
    marginTop: spacing[4],
  },
});
