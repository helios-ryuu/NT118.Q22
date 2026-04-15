import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getIssue, updateIssue } from "@dataconnect/generated";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { queryKeys } from "@/services/queryKeys";
import { colors } from "@/constants/theme";

export default function EditIssueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const issueQuery = useQuery({
    queryKey: queryKeys.issues.detail(id ?? ""),
    enabled: !!id,
    queryFn: async () => {
      const result = await getIssue({ id: id as string });
      return result.data.issue ?? null;
    },
  });

  useEffect(() => {
    if (!issueQuery.data || hydrated) return;
    setTitle(issueQuery.data.title);
    setContent(issueQuery.data.content);
    setHydrated(true);
  }, [hydrated, issueQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (body: { title: string; content: string }) =>
      updateIssue({ id: id as string, title: body.title, content: body.content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.detail(id as string) });
      router.back();
    },
  });

  const submit = async () => {
    if (!title.trim()) { Alert.alert("Lỗi", "Vui lòng nhập tiêu đề"); return; }
    try {
      await updateMutation.mutateAsync({ title: title.trim(), content: content.trim() });
    } catch {
      Alert.alert("Lỗi", "Không thể lưu thay đổi");
    }
  };

  if (issueQuery.isLoading) {
    return <View className="flex-1 justify-center items-center bg-background"><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Text className="text-2xl font-lx-bold text-foreground mb-5">Chỉnh sửa vấn đề</Text>
        <Input label="Tiêu đề" value={title} onChangeText={setTitle} placeholder="Mô tả ngắn gọn vấn đề" />
        <Input
          label="Nội dung"
          value={content}
          onChangeText={setContent}
          placeholder="Mô tả chi tiết..."
          multiline
          numberOfLines={5}
          style={{ height: 120, textAlignVertical: "top" }}
        />
        <Button title={updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"} onPress={submit} disabled={updateMutation.isPending} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
