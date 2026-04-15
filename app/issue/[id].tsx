// Chi tiet van de
import { useCallback } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteIssue, getIssue, updateIssueStatus } from "@dataconnect/generated";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { statusLabel } from "@/constants/labels";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Issue } from "@/types/issue";
import { colors } from "@/constants/theme";

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const issueQuery = useQuery({
    queryKey: queryKeys.issues.detail(id ?? ""),
    enabled: !!id,
    queryFn: async () => {
      const result = await getIssue({ id: id as string });
      const i = result.data.issue;
      if (!i) return null;
      return {
        id: i.id,
        ideaId: i.idea.id,
        title: i.title,
        content: i.content,
        status: i.status as Issue["status"],
        authorId: i.author.id,
        authorDisplayName: i.author.displayName ?? null,
        authorAvatarUrl: i.author.avatarUrl ?? null,
        createdAt: i.createdAt,
      } satisfies Issue;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteIssue({ id: id as string }),
    onSuccess: () => {
      const ideaId = issueQuery.data?.ideaId;
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
      if (ideaId) queryClient.invalidateQueries({ queryKey: queryKeys.issues.byIdea(ideaId) });
      router.back();
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => updateIssueStatus({ id: id as string, status }),
    onSuccess: () => {
      const ideaId = issueQuery.data?.ideaId;
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.detail(id as string) });
      if (ideaId) queryClient.invalidateQueries({ queryKey: queryKeys.issues.byIdea(ideaId) });
    },
  });

  useFocusEffect(useCallback(() => { issueQuery.refetch(); }, [issueQuery]));

  const handleDelete = () => {
    Alert.alert("Xóa vấn đề", "Bạn chắc chắn muốn xóa vấn đề này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: async () => { await deleteMutation.mutateAsync(); }},
    ]);
  };

  const handleStartProgress = () => {
    Alert.alert("Bắt đầu xử lý", "Chuyển vấn đề sang trạng thái đang xử lý?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xác nhận", onPress: async () => { await statusMutation.mutateAsync("IN_PROGRESS"); }},
    ]);
  };

  const handleClose = () => {
    Alert.alert("Đóng vấn đề", "Đóng vấn đề này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đóng", onPress: async () => { await statusMutation.mutateAsync("CLOSED"); }},
    ]);
  };

  const handleCancel = () => {
    Alert.alert("Huỷ vấn đề", "Huỷ vấn đề này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xác nhận", style: "destructive", onPress: async () => { await statusMutation.mutateAsync("CANCELLED"); }},
    ]);
  };

  if (issueQuery.isLoading) {
    return <View className="flex-1 justify-center items-center bg-background"><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const issue = issueQuery.data;
  if (!issue) {
    return <View className="flex-1 justify-center items-center bg-background"><Text className="text-base font-lx text-muted">Không tìm thấy vấn đề</Text></View>;
  }

  const isOwner = user?.id === issue.authorId;
  const isActive = issue.status === "OPEN" || issue.status === "IN_PROGRESS";

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
      <View className="flex-row gap-2 mb-3">
        <View className={`px-3 py-1 rounded-full ${isActive ? "bg-primary" : "bg-border"}`}>
          <Text className={`text-xs font-lx-semi ${isActive ? "text-white" : "text-foreground"}`}>
            {statusLabel[issue.status]}
          </Text>
        </View>
      </View>

      <Text className="text-2xl font-lx-bold text-foreground mb-2">{issue.title}</Text>
      <Text className="text-base font-lx text-muted leading-6 mb-4">{issue.content}</Text>

      <Pressable className="flex-row items-center gap-3 mb-4" onPress={() => router.push(`/profile/${issue.authorId}`)}>
        <Avatar uri={issue.authorAvatarUrl} name={issue.authorDisplayName ?? ""} size={32} />
        <Text className="text-base font-lx-md text-primary">{issue.authorDisplayName ?? issue.authorId}</Text>
      </Pressable>

      <Text className="text-sm font-lx text-muted mb-5">Tạo lúc: {new Date(issue.createdAt).toLocaleString("vi-VN")}</Text>

      {isOwner && issue.status === "OPEN" && (
        <View className="gap-3">
          <Button title="Bắt đầu xử lý" onPress={handleStartProgress} />
          <Button title="Chỉnh sửa" variant="outline" onPress={() => router.push(`/issue/edit?id=${issue.id}`)} />
          <Button title="Huỷ vấn đề" variant="ghost" onPress={handleCancel} />
          <Button title="Xóa" variant="ghost" onPress={handleDelete} />
        </View>
      )}

      {isOwner && issue.status === "IN_PROGRESS" && (
        <View className="gap-3">
          <Button title="Đóng vấn đề" onPress={handleClose} />
        </View>
      )}
    </ScrollView>
  );
}
