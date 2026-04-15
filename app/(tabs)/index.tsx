import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, AppState, type AppStateStatus, FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { listMyIssues, listOpenIssues } from "@dataconnect/generated";
import { IssueCard } from "@/components/IssueCard";
import { Avatar } from "@/components/Avatar";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Issue } from "@/types/issue";
import { colors } from "@/constants/theme";

type Tab = "all" | "mine";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const focused = useRef(false);
  const appState = useRef(AppState.currentState);

  const allIssuesQuery = useQuery({
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

  const myIssuesQuery = useQuery({
    queryKey: queryKeys.issues.mine,
    enabled: !!user,
    queryFn: async () => {
      const result = await listMyIssues();
      return result.data.issues.map<Issue>(i => ({
        id: i.id,
        ideaId: i.idea.id,
        title: i.title,
        content: i.content,
        status: i.status as Issue["status"],
        authorId: user!.id,
        authorDisplayName: user?.displayName ?? null,
        authorAvatarUrl: user?.avatarUrl ?? null,
        createdAt: i.createdAt,
      }));
    },
  });

  const activeQuery = tab === "all" ? allIssuesQuery : myIssuesQuery;

  useFocusEffect(useCallback(() => {
    focused.current = true;
    if (user) {
      allIssuesQuery.refetch();
      myIssuesQuery.refetch();
    }
    return () => { focused.current = false; };
  }, [allIssuesQuery, myIssuesQuery, user]));

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === "active" && focused.current && user) {
        allIssuesQuery.refetch();
        myIssuesQuery.refetch();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [allIssuesQuery, myIssuesQuery, user]);

  const display = useMemo(() => {
    const allIssues = activeQuery.data ?? [];
    const visible = tab === "all" ? allIssues.filter(i => i.authorId !== user?.id) : allIssues;
    const q = query.trim().toLowerCase();
    if (!q) return visible;
    return visible.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.content.toLowerCase().includes(q)
    );
  }, [activeQuery.data, query, user?.id, tab]);

  if (activeQuery.isLoading) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={display}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <IssueCard issue={item} />}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={activeQuery.isRefetching} onRefresh={() => activeQuery.refetch()} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-lx-bold text-foreground">Xin chào, {user?.displayName?.split(" ").pop() ?? "bạn"}!</Text>
              <Pressable onPress={() => router.push("/profile/edit")}>
                <Avatar uri={user?.avatarUrl} name={user?.displayName ?? user?.username ?? ""} size={36} />
              </Pressable>
            </View>

            {/* Segment filter */}
            <View className="flex-row bg-surface border border-border rounded-app mb-4 p-1">
              <Pressable
                className={`flex-1 py-1.5 rounded-md items-center ${tab === "all" ? "bg-primary" : ""}`}
                onPress={() => setTab("all")}
              >
                <Text className={`text-sm font-lx-semi ${tab === "all" ? "text-white" : "text-muted"}`}>Mọi người</Text>
              </Pressable>
              <Pressable
                className={`flex-1 py-1.5 rounded-md items-center ${tab === "mine" ? "bg-primary" : ""}`}
                onPress={() => setTab("mine")}
              >
                <Text className={`text-sm font-lx-semi ${tab === "mine" ? "text-white" : "text-muted"}`}>Của tôi</Text>
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
              {query.trim() ? `${display.length} kết quả` : tab === "all" ? "Vấn đề cần hỗ trợ" : "Vấn đề của tôi"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="text-center text-muted font-lx text-base mt-8">
            {query.trim() ? "Không tìm thấy" : tab === "all" ? "Chưa có vấn đề phù hợp" : "Bạn chưa tạo vấn đề nào"}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
