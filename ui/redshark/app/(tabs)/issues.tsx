import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { IssueCard } from "@/components/IssueCard";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import type { Issue } from "@/types/issue";
import { colors, fonts, text, spacing } from "@/constants/theme";

export default function IssuesScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const all = await api.get<Issue[]>(endpoints.issues.list);
      setIssues([...all.filter(i => i.authorId === user?.id)].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (e) {
      console.error("[Issues]", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, user?.id]);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) {
    return <View style={s.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <FlatList
        data={issues}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <IssueCard issue={item} />}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
        ListHeaderComponent={<Text style={s.heading}>Vấn đề của tôi</Text>}
        ListEmptyComponent={<Text style={s.empty}>Chưa có vấn đề nào. Nhấn + để tạo mới.</Text>}
      />
      <Pressable style={s.fab} onPress={() => router.push("/issue/create")}>
        <Text style={s.fabIcon}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: spacing[4], paddingBottom: 100 },
  heading: { fontSize: text.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[4] },
  empty: { textAlign: "center", color: colors.textSecondary, fontFamily: fonts.regular, fontSize: text.md, marginTop: spacing[8] },
  fab: { position: "absolute", right: spacing[5], bottom: spacing[7], width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  fabIcon: { fontSize: 28, color: "#fff", lineHeight: 32 },
});
