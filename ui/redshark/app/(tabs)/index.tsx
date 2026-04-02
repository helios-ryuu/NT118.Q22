import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, AppState, type AppStateStatus, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { IssueCard } from "@/components/IssueCard";
import { Avatar } from "@/components/Avatar";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import type { Issue } from "@/types/issue";
import { colors, fonts, text, radius, spacing } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  const focused = useRef(false);
  const appState = useRef(AppState.currentState);

  const load = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    try {
      const all = await api.get<Issue[]>(endpoints.issues.list);
      setIssues(all.filter(i => i.status === "open" && i.authorId !== user?.id));
    } catch (e) {
      console.error("[Home]", e);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, [token, user?.id]);

  const loadRef = useRef(load);
  useEffect(() => { loadRef.current = load; }, [load]);

  useFocusEffect(useCallback(() => {
    focused.current = true;
    load();
    return () => { focused.current = false; };
  }, [load]));

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === "active" && focused.current) {
        loadRef.current(true);
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  const display = useMemo(() => {
    const sorted = [...issues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [issues, query]);

  if (loading) {
    return <View style={s.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <FlatList
        data={display}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <IssueCard issue={item} />}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            <View style={s.header}>
              <Text style={s.greeting}>Xin chào, {user?.name?.split(" ").pop() ?? "bạn"}!</Text>
              <Pressable onPress={() => router.push("/profile/edit")}>
                <Avatar uri={user?.avatar} name={user?.name ?? ""} size={36} />
              </Pressable>
            </View>
            <View style={s.search}>
              <TextInput
                style={s.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Tìm kiếm vấn đề..."
                placeholderTextColor={colors.textSecondary}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>
            <Text style={s.section}>
              {query.trim() ? `${display.length} kết quả` : "Danh sách vấn đề"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={s.empty}>{query.trim() ? "Không tìm thấy" : "Chưa có vấn đề phù hợp"}</Text>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: spacing[4] },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[4] },
  greeting: { fontSize: text.lg, fontFamily: fonts.bold, color: colors.text },
  search: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing[3], paddingVertical: spacing[2], marginBottom: spacing[4] },
  searchInput: { fontSize: text.sm, fontFamily: fonts.regular, color: colors.text, padding: 0 },
  section: { fontSize: text.md, fontFamily: fonts.semiBold, color: colors.text, marginBottom: spacing[3] },
  empty: { textAlign: "center", color: colors.textSecondary, fontFamily: fonts.regular, fontSize: text.md, marginTop: spacing[8] },
});
