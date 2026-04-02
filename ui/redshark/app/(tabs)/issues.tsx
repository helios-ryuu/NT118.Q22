import { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { IssueCard } from "@/components/IssueCard";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Issue } from "@/types/issue";
import { colors } from "@/constants/theme";

export default function IssuesScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const issuesQuery = useQuery({
    queryKey: queryKeys.issues.all,
    queryFn: () => api.get<Issue[]>(endpoints.issues.list),
  });

  const issues = useMemo(() => {
    const all = issuesQuery.data ?? [];
    return [...all.filter(i => i.authorId === user?.id)]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [issuesQuery.data, user?.id]);

  useFocusEffect(useCallback(() => { issuesQuery.refetch(); }, [issuesQuery]));

  if (issuesQuery.isLoading) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={issues}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <IssueCard issue={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={issuesQuery.isRefetching} onRefresh={() => issuesQuery.refetch()} tintColor={colors.primary} />}
        ListHeaderComponent={<Text className="text-2xl font-lx-bold text-foreground mb-4">Vấn đề của tôi</Text>}
        ListEmptyComponent={<Text className="text-center text-muted font-lx text-base mt-8">Chưa có vấn đề nào. Nhấn + để tạo mới.</Text>}
      />
      <Pressable
        className="absolute bg-primary justify-center items-center rounded-full"
        style={{ right: 20, bottom: 32, width: 56, height: 56, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }}
        onPress={() => router.push("/issue/create")}
      >
        <Text className="text-white" style={{ fontSize: 28, lineHeight: 32 }}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
