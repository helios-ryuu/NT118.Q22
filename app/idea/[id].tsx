// Chi tiet y tuong — hien thi danh sach van de ben trong
import { useCallback } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteIdea, getIdea, listIssuesByIdea } from "@dataconnect/generated";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { IssueCard } from "@/components/IssueCard";
import { ideaStatusLabel } from "@/constants/labels";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Idea } from "@/types/idea";
import type { Issue } from "@/types/issue";
import { colors } from "@/constants/theme";

export default function IdeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const ideaQuery = useQuery({
    queryKey: queryKeys.ideas.detail(id ?? ""),
    enabled: !!id,
    queryFn: async () => {
      const result = await getIdea({ id: id as string });
      const i = result.data.idea;
      if (!i) return null;
      return {
        id: i.id,
        title: i.title,
        description: i.description,
        status: i.status as Idea["status"],
        tagIds: i.tagIds ?? [],
        collaboratorIds: i.collaboratorIds ?? [],
        authorId: i.author.id,
        authorDisplayName: i.author.displayName ?? null,
        authorAvatarUrl: i.author.avatarUrl ?? null,
        lastActivityAt: i.lastActivityAt,
        createdAt: i.createdAt,
      } satisfies Idea;
    },
  });

  const issuesQuery = useQuery({
    queryKey: queryKeys.issues.byIdea(id ?? ""),
    enabled: !!id,
    queryFn: async () => {
      const result = await listIssuesByIdea({ ideaId: id as string });
      return result.data.issues.map<Issue>(i => ({
        id: i.id,
        ideaId: id as string,
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

  const deleteMutation = useMutation({
    mutationFn: () => deleteIdea({ id: id as string }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.all });
      router.back();
    },
  });

  useFocusEffect(useCallback(() => {
    ideaQuery.refetch();
    issuesQuery.refetch();
  }, [ideaQuery, issuesQuery]));

  const handleDelete = () => {
    Alert.alert("Xóa ý tưởng", "Bạn chắc chắn muốn xóa ý tưởng này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: async () => { await deleteMutation.mutateAsync(); }},
    ]);
  };

  if (ideaQuery.isLoading) {
    return <View className="flex-1 justify-center items-center bg-background"><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const idea = ideaQuery.data;
  if (!idea) {
    return <View className="flex-1 justify-center items-center bg-background"><Text className="text-base font-lx text-muted">Không tìm thấy ý tưởng</Text></View>;
  }

  const isOwner = user?.id === idea.authorId;
  const isActive = idea.status === "ACTIVE";
  const issueList = issuesQuery.data ?? [];

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
      <View className="flex-row gap-2 mb-3">
        <View className={`px-3 py-1 rounded-full ${isActive ? "bg-primary" : "bg-border"}`}>
          <Text className={`text-xs font-lx-semi ${isActive ? "text-white" : "text-foreground"}`}>
            {ideaStatusLabel[idea.status]}
          </Text>
        </View>
      </View>

      <Text className="text-2xl font-lx-bold text-foreground mb-2">{idea.title}</Text>
      <Text className="text-base font-lx text-muted leading-6 mb-4">{idea.description}</Text>

      <View className="flex-row items-center gap-3 mb-4">
        <Avatar uri={idea.authorAvatarUrl} name={idea.authorDisplayName ?? ""} size={32} />
        <Text className="text-base font-lx-md text-foreground">{idea.authorDisplayName ?? idea.authorId}</Text>
      </View>

      <Text className="text-sm font-lx text-muted mb-5">Cập nhật: {new Date(idea.lastActivityAt).toLocaleString("vi-VN")}</Text>

      {isOwner && (
        <View className="gap-3 mb-6">
          <Button title="Xóa ý tưởng" variant="ghost" onPress={handleDelete} />
        </View>
      )}

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-lx-bold text-foreground">Vấn đề ({issueList.length})</Text>
        <Pressable
          className="bg-primary px-4 py-2 rounded-full"
          onPress={() => router.push(`/issue/create?ideaId=${idea.id}`)}
        >
          <Text className="text-white text-sm font-lx-md">+ Thêm</Text>
        </Pressable>
      </View>

      {issuesQuery.isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : issueList.length === 0 ? (
        <Text className="text-center text-muted font-lx text-base mt-4">Chưa có vấn đề nào.</Text>
      ) : (
        issueList.map(issue => <IssueCard key={issue.id} issue={issue} />)
      )}
    </ScrollView>
  );
}
