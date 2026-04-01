// Trang chu — danh sach van de mo dang, toi gian mot list
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, type AppStateStatus, ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/common/Avatar";
import { IssueCard } from "@/components/issue/IssueCard";
import { EmptyState } from "@/components/common/EmptyState";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import type { Issue } from "@/types/issue";
import { borderRadius, colors, fonts, fontSize, spacing } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isFocused = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  const load = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    try {
      const all = await api.get<Issue[]>(endpoints.issues.list);
      setIssues(all.filter((i) => i.status === "open" && i.authorId !== user?.id));
    } catch (e) {
      console.error("[Home] load issues:", e);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, [token, user?.id]);

  // Giu ref de AppState handler luon goi load moi nhat
  const loadRef = useRef(load);
  useEffect(() => { loadRef.current = load; }, [load]);

  // Reload khi tab/screen duoc focus (chuyen tab, quay lai tu man hinh khac)
  useFocusEffect(
    useCallback(() => {
      isFocused.current = true;
      load();
      return () => { isFocused.current = false; };
    }, [load])
  );

  // Reload khi app quay lai foreground (tat app mo lai)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && next === "active" && isFocused.current) {
        loadRef.current(true);
      }
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, []);

  const onRefresh = () => { setRefreshing(true); load(); };

  const sorted = useMemo(
    () => [...issues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [issues],
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return sorted.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [sorted, searchQuery]);

  const displayIssues = searchResults ?? sorted;

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing[4] },
      ]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={[styles.headerSticky, { paddingTop: insets.top + spacing[3] }]}> 
        <View style={styles.header}>
          <Text style={styles.greeting}> 
            Xin chào, {user?.name?.split(" ").pop() ?? "bạn"}!
          </Text>
          <View>
            <Pressable onPress={() => router.push("/profile/edit")}>
              <Avatar uri={user?.avatar ?? null} name={user?.name ?? ""} size={36} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm kiếm vấn đề..."
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <Text style={styles.sectionTitle}>
        {searchQuery.trim() ? `${displayIssues.length} kết quả` : "Danh sách vấn đề"}
      </Text>
      {displayIssues.length === 0 ? (
        <EmptyState
          icon={searchQuery.trim() ? "🔍" : "📭"}
          title={searchQuery.trim() ? "Không tìm thấy" : "Chưa có vấn đề phù hợp"}
          message={searchQuery.trim() ? "Thử từ khoá khác" : "Hãy quay lại sau"}
        />
      ) : (
        displayIssues.map((i) => <IssueCard key={i.id} issue={i} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing[4] },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  headerSticky: {
    backgroundColor: "transparent",
    zIndex: 0,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[3] },
  searchWrap: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[4],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  searchInput: {
    fontSize: fontSize.sm,
    fontFamily: fonts.regular,
    color: colors.text,
    padding: 0,
  },
  greeting: { fontSize: fontSize.lg, fontFamily: fonts.bold, color: colors.text },
  sectionTitle: { fontSize: fontSize.md, fontFamily: fonts.semiBold, color: colors.text, marginBottom: spacing[3] },
});
