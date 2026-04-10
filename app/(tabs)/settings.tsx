import { useContext } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Avatar } from "@/components/Avatar";
import { AuthContext } from "@/contexts/AuthContext";

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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-lx-bold text-foreground mb-5">Cài đặt</Text>

        <Pressable className="flex-row items-center gap-3 bg-surface rounded-xl p-4 mb-6" onPress={() => router.push("/profile/edit")}>
          <Avatar uri={user.avatarUrl} name={user.displayName ?? user.username} size={48} />
          <View className="flex-1">
            <Text className="text-base font-lx-semi text-foreground">{user.displayName ?? user.username}</Text>
            <Text className="text-sm font-lx text-muted">@{user.username}</Text>
          </View>
          <Text className="text-xl text-muted">›</Text>
        </Pressable>

        <Pressable className="py-3 rounded-xl border border-error items-center mb-3" onPress={confirmLogout}>
          <Text className="text-base font-lx-md text-error">Đăng xuất</Text>
        </Pressable>

        <Pressable className="py-3 items-center" onPress={confirmDelete}>
          <Text className="text-sm font-lx text-muted">Xoá tài khoản</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
