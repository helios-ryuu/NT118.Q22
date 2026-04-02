import { useContext } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Avatar } from "@/components/Avatar";
import { AuthContext } from "@/contexts/AuthContext";
import { colors, fonts, text, radius, spacing } from "@/constants/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout, deleteAccount } = useContext(AuthContext);

  const confirmLogout = () =>
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: logout },
    ]);

  const confirmDelete = () =>
    Alert.alert("Xoá tài khoản", "Hành động này không thể khôi phục.", [
      { text: "Hủy", style: "cancel" },
      { text: "Xoá", style: "destructive", onPress: async () => {
        try { await deleteAccount(); } catch { Alert.alert("Lỗi", "Không thể xoá tài khoản"); }
      }},
    ]);

  if (!user) return null;

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.heading}>Cài đặt</Text>

        <Pressable style={s.profile} onPress={() => router.push("/profile/edit")}>
          <Avatar uri={user.avatar} name={user.name} size={48} />
          <View style={s.info}>
            <Text style={s.name}>{user.name}</Text>
            <Text style={s.username}>@{user.username}</Text>
          </View>
          <Text style={s.arrow}>›</Text>
        </Pressable>

        <Pressable style={s.logoutBtn} onPress={confirmLogout}>
          <Text style={s.logoutText}>Đăng xuất</Text>
        </Pressable>

        <Pressable style={s.deleteBtn} onPress={confirmDelete}>
          <Text style={s.deleteText}>Xoá tài khoản</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[4] },
  heading: { fontSize: text.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[5] },
  profile: { flexDirection: "row", alignItems: "center", gap: spacing[3], backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing[4], marginBottom: spacing[6] },
  info: { flex: 1 },
  name: { fontSize: text.md, fontFamily: fonts.semiBold, color: colors.text },
  username: { fontSize: text.sm, fontFamily: fonts.regular, color: colors.textSecondary },
  arrow: { fontSize: text.lg, color: colors.textSecondary },
  logoutBtn: { paddingVertical: spacing[3], borderRadius: radius.md, borderWidth: 1, borderColor: colors.error, alignItems: "center", marginBottom: spacing[3] },
  logoutText: { fontSize: text.md, fontFamily: fonts.medium, color: colors.error },
  deleteBtn: { paddingVertical: spacing[3], alignItems: "center" },
  deleteText: { fontSize: text.sm, fontFamily: fonts.regular, color: colors.textSecondary },
});
