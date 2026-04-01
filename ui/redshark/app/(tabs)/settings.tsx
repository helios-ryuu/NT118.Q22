// Tab Cai dat — MVP toi gian cho tai khoan
import { useContext } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/common/Avatar";
import { AuthContext } from "@/contexts/AuthContext";
import { colors, borderRadius, fonts, fontSize, spacing } from "@/constants/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, deleteAccount } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Xoá tài khoản",
      "Hành động này không thể khôi phục. Toàn bộ dữ liệu sẽ bị xoá vĩnh viễn.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
            } catch {
              Alert.alert("Lỗi", "Không thể xoá tài khoản");
            }
          },
        },
      ],
    );
  };

  if (!user) return null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing[6] }]}
    >
      <View style={[styles.headerSticky, { paddingTop: insets.top + spacing[3] }]}> 
        <Text style={styles.heading}>Cài đặt</Text>
      </View>

      {/* Section Tai khoan */}
      <Text style={styles.sectionLabel}>TÀI KHOẢN</Text>
      <Pressable style={styles.profileRow} onPress={() => router.push("/profile/edit")}>
        <Avatar uri={user.avatar} name={user.name} size={48} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileUsername}>@{user.username}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>

      {/* Dang xuat & Xoa tai khoan */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>

      <Pressable style={styles.deleteBtn} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Xoá tài khoản</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[4] },
  headerSticky: {
    backgroundColor: "transparent",
    marginHorizontal: -spacing[4],
    paddingHorizontal: spacing[4],
    zIndex: 0,
  },
  heading: { fontSize: fontSize.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[5] },
  sectionLabel: {
    fontSize: fontSize.xs, fontFamily: fonts.semiBold,
    color: colors.textSecondary, marginBottom: spacing[2],
    letterSpacing: 0.8,
  },
  profileRow: {
    flexDirection: "row", alignItems: "center", gap: spacing[3],
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing[4],
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: fontSize.md, fontFamily: fonts.semiBold, color: colors.text },
  profileUsername: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textSecondary },
  arrow: { fontSize: fontSize.lg, color: colors.textSecondary },
  logoutBtn: {
    marginTop: spacing[6], paddingVertical: spacing[3],
    borderRadius: borderRadius.md, borderWidth: 1,
    borderColor: colors.error, alignItems: "center",
  },
  logoutText: { fontSize: fontSize.md, fontFamily: fonts.medium, color: colors.error },
  deleteBtn: {
    marginTop: spacing[3], paddingVertical: spacing[3],
    borderRadius: borderRadius.md, alignItems: "center",
  },
  deleteText: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textSecondary },
});
