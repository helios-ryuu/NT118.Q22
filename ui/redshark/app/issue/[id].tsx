// Chi tiet van de — phan quyen Owner vs Non-owner
import { useCallback } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { priorityLabel, statusLabel } from "@/constants/labels";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
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
    queryFn: () => api.get<Issue>(endpoints.issues.byId(id as string)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete<void>(endpoints.issues.byId(id as string)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
      router.back();
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => api.put<Issue>(endpoints.issues.status(id as string), { status: "closed" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.detail(id as string) });
      router.replace("/(tabs)/issues");
    },
  });

  useFocusEffect(useCallback(() => { issueQuery.refetch(); }, [issueQuery]));

  const handleDelete = () => {
    Alert.alert("Xóa vấn đề", "Bạn chắc chắn muốn xóa vấn đề này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: async () => {
        await deleteMutation.mutateAsync();
      }},
    ]);
  };

  const handleClose = () => {
    Alert.alert("Đóng vấn đề", "Đóng vấn đề này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đóng", onPress: async () => {
        await closeMutation.mutateAsync();
      }},
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
  const priorityChip =
    issue.priority <= 3 ? "bg-border" : issue.priority <= 7 ? "bg-[#FEF3C7]" : "bg-[#FEE2E2]";
  const isActiveStatus = issue.status === "open" || issue.status === "in_progress";

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
      <View className="flex-row gap-2 mb-3">
        <View className={`px-3 py-1 rounded-full ${priorityChip}`}>
          <Text className="text-xs font-lx-semi text-foreground">{priorityLabel(issue.priority)}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${isActiveStatus ? "bg-primary" : "bg-border"}`}>
          <Text className={`text-xs font-lx-semi ${isActiveStatus ? "text-white" : "text-foreground"}`}>
            {statusLabel[issue.status]}
          </Text>
        </View>
      </View>

      <Text className="text-2xl font-lx-bold text-foreground mb-2">{issue.title}</Text>
      <Text className="text-base font-lx text-muted leading-6 mb-4">{issue.description}</Text>

      {issue.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-4">
          {issue.tags.map(t => (
            <View key={t} className="bg-primary-light px-3 py-1 rounded-md">
              <Text className="text-sm font-lx-md text-primary">{t}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="flex-row items-center gap-3 mb-4">
        <Avatar uri={issue.authorAvatar} name={issue.authorName} size={32} />
        <Text className="text-base font-lx-md text-foreground">{issue.authorName}</Text>
      </View>

      <View className="mb-5">
        <Text className="text-sm font-lx text-muted mb-1">Tạo lúc: {new Date(issue.createdAt).toLocaleString("vi-VN")}</Text>
        {issue.expiresAt && (
          <Text className="text-sm font-lx text-muted mb-1">Hết hạn: {new Date(issue.expiresAt).toLocaleString("vi-VN")}</Text>
        )}
      </View>

      {isOwner && issue.status === "open" && (
        <View className="gap-3">
          <Button title="Chỉnh sửa" variant="outline" onPress={() => router.push(`/issue/edit?id=${issue.id}`)} />
          <Button title="Xóa" variant="ghost" onPress={handleDelete} />
        </View>
      )}

      {isOwner && issue.status === "in_progress" && (
        <View className="gap-3">
          <Button title="Đóng vấn đề" variant="outline" onPress={handleClose} />
        </View>
      )}
    </ScrollView>
  );
}
