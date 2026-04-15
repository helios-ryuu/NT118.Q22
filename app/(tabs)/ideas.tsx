import { useCallback } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { listMyIdeas } from "@dataconnect/generated";
import { IdeaCard } from "@/components/IdeaCard";
import { FAB } from "@/components/FAB";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Idea } from "@/types/idea";
import { colors } from "@/constants/theme";

export default function IdeasScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const ideasQuery = useQuery({
    queryKey: queryKeys.ideas.all,
    enabled: !!user,
    queryFn: async () => {
      const result = await listMyIdeas();
      return result.data.ideas.map<Idea>(i => ({
        id: i.id,
        title: i.title,
        description: i.description,
        status: i.status,
        tagIds: i.tagIds ?? [],
        collaboratorIds: i.collaboratorIds ?? [],
        lastActivityAt: i.lastActivityAt,
        createdAt: i.createdAt,
        authorId: i.author.id,
        authorDisplayName: i.author.displayName ?? null,
        authorAvatarUrl: i.author.avatarUrl ?? null,
      }));
    },
  });

  useFocusEffect(useCallback(() => { if (user) ideasQuery.refetch(); }, [ideasQuery, user]));

  if (ideasQuery.isLoading) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={ideasQuery.data ?? []}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <IdeaCard idea={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={ideasQuery.isRefetching} onRefresh={() => ideasQuery.refetch()} tintColor={colors.primary} />}
        ListHeaderComponent={<Text className="text-2xl font-lx-bold text-foreground mb-4">Ý tưởng của tôi</Text>}
        ListEmptyComponent={<Text className="text-center text-muted font-lx text-base mt-8">Chưa có ý tưởng nào. Nhấn + để tạo mới.</Text>}
      />
      <FAB onPress={() => router.push("/idea/create")} />
    </SafeAreaView>
  );
}
