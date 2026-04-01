// Tab Van de — danh sach van de cua ban, mot list don gian
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IssueCard } from "@/components/issue/IssueCard";
import { EmptyState } from "@/components/common/EmptyState";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import type { Issue } from "@/types/issue";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

export default function IssuesScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const all = await api.get<Issue[]>(endpoints.issues.list);
      setIssues(all.filter((i) => i.authorId === user?.id));
    } catch (e) {
      console.error("[Issues] load:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, user?.id]);

  useEffect(() => { load(); }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const sorted = [...issues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={[styles.headerSticky, { paddingTop: insets.top + spacing[3] }]}> 
          <Text style={styles.heading}>Vấn đề của tôi</Text>
        </View>

        {sorted.length === 0 ? (
          <EmptyState icon="📋" title="Chưa có vấn đề nào" message="Nhấn + để tạo vấn đề mới" />
        ) : (
          sorted.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        )}
      </ScrollView>

      {/* FAB tao moi */}
      <Pressable
        style={[styles.fab, { bottom: insets.bottom + spacing[5] }]}
        onPress={() => router.push("/issue/create")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  content: { padding: spacing[4] },
  headerSticky: {
    backgroundColor: "transparent",
    marginHorizontal: -spacing[4],
    paddingHorizontal: spacing[4],
    zIndex: 0,
  },
  heading: { fontSize: fontSize.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[4] },
  fab: {
    position: "absolute",
    right: spacing[5],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabIcon: { fontSize: 28, color: colors.surface, lineHeight: 32 },
});
