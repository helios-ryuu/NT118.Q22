import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { listMyIdeas } from "@dataconnect/generated";
import { IdeaCard } from "@/components/IdeaCard";
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
      <Pressable
        className="absolute bg-primary justify-center items-center rounded-full"
        style={{ right: 20, bottom: 32, width: 56, height: 56, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }}
        onPress={() => router.push("/idea/create")}
      >
        <Text className="text-white" style={{ fontSize: 28, lineHeight: 32 }}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
