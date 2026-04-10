import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, AppState, type AppStateStatus, FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { listOpenIssues } from "@dataconnect/generated";
import { IssueCard } from "@/components/IssueCard";
import { Avatar } from "@/components/Avatar";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Issue } from "@/types/issue";
import { colors } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const focused = useRef(false);
  const appState = useRef(AppState.currentState);

  const issuesQuery = useQuery({
    queryKey: queryKeys.issues.all,
    enabled: !!user,
    queryFn: async () => {
      const result = await listOpenIssues();
      return result.data.issues.map<Issue>(i => ({
        id: i.id,
        ideaId: i.idea.id,
        title: i.title,
        content: i.content,
        status: i.status as Issue["status"],
        authorId: i.author.id,
        authorDisplayName: i.author.displayName ?? null,
        authorAvatarUrl: i.author.avatarUrl ?? null,
        createdAt: i.createdAt,
      }));
    },
  });

  useFocusEffect(useCallback(() => {
    focused.current = true;
    if (user) issuesQuery.refetch();
    return () => { focused.current = false; };
  }, [issuesQuery, user]));

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === "active" && focused.current && user) {
        issuesQuery.refetch();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [issuesQuery, user]);

  const display = useMemo(() => {
    const allIssues = issuesQuery.data ?? [];
    const visible = allIssues.filter(i => i.authorId !== user?.id);
    const q = query.trim().toLowerCase();
    if (!q) return visible;
    return visible.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.content.toLowerCase().includes(q)
    );
  }, [issuesQuery.data, query, user?.id]);

  if (issuesQuery.isLoading) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={display}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <IssueCard issue={item} />}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={issuesQuery.isRefetching} onRefresh={() => issuesQuery.refetch()} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-lx-bold text-foreground">Xin chào, {user?.displayName?.split(" ").pop() ?? "bạn"}!</Text>
              <Pressable onPress={() => router.push("/profile/edit")}>
                <Avatar uri={user?.avatarUrl} name={user?.displayName ?? user?.username ?? ""} size={36} />
              </Pressable>
            </View>
            <View className="bg-surface rounded-app border border-border px-3 py-2 mb-4">
              <TextInput
                className="text-sm font-lx text-foreground p-0"
                value={query}
                onChangeText={setQuery}
                placeholder="Tìm kiếm vấn đề..."
                placeholderTextColor={colors.textSecondary}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>
            <Text className="text-base font-lx-semi text-foreground mb-3">
              {query.trim() ? `${display.length} kết quả` : "Vấn đề cần hỗ trợ"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="text-center text-muted font-lx text-base mt-8">
            {query.trim() ? "Không tìm thấy" : "Chưa có vấn đề phù hợp"}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
