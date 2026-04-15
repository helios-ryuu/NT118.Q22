import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getIdea, updateIdea } from "@dataconnect/generated";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TagSelect } from "@/components/TagSelect";
import { queryKeys } from "@/services/queryKeys";
import { colors } from "@/constants/theme";

export default function EditIdeaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const ideaQuery = useQuery({
    queryKey: queryKeys.ideas.detail(id ?? ""),
    enabled: !!id,
    queryFn: async () => {
      const result = await getIdea({ id: id as string });
      return result.data.idea ?? null;
    },
  });

  useEffect(() => {
    if (!ideaQuery.data || hydrated) return;
    setTitle(ideaQuery.data.title);
    setDescription(ideaQuery.data.description);
    setTagIds(ideaQuery.data.tagIds ?? []);
    setHydrated(true);
  }, [hydrated, ideaQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (body: { title: string; description: string; tagIds: number[] }) =>
      updateIdea({ id: id as string, title: body.title, description: body.description, tagIds: body.tagIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.detail(id as string) });
      router.back();
    },
  });

  const submit = async () => {
    if (!title.trim()) { Alert.alert("Lỗi", "Vui lòng nhập tiêu đề"); return; }
    if (!description.trim()) { Alert.alert("Lỗi", "Vui lòng nhập mô tả"); return; }
    try {
      await updateMutation.mutateAsync({ title: title.trim(), description: description.trim(), tagIds });
    } catch {
      Alert.alert("Lỗi", "Không thể lưu thay đổi");
    }
  };

  if (ideaQuery.isLoading) {
    return <View className="flex-1 justify-center items-center bg-background"><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Text className="text-2xl font-lx-bold text-foreground mb-5">Chỉnh sửa ý tưởng</Text>
        <Input label="Tiêu đề" value={title} onChangeText={setTitle} placeholder="Tên ý tưởng hoặc dự án" />
        <Input
          label="Mô tả"
          value={description}
          onChangeText={setDescription}
          placeholder="Mô tả chi tiết ý tưởng..."
          multiline
          numberOfLines={4}
          style={{ height: 120, textAlignVertical: "top" }}
        />
        <TagSelect selected={tagIds} onChange={setTagIds} />
        <Button title={updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"} onPress={submit} disabled={updateMutation.isPending} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
