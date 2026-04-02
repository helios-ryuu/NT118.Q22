import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { queryKeys } from "@/services/queryKeys";
import type { Issue } from "@/types/issue";

const PRIORITIES = [
  { label: "Thấp", value: 3 },
  { label: "Trung bình", value: 5 },
  { label: "Cao", value: 8 },
];

export default function EditIssueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState(5);
  const [hydrated, setHydrated] = useState(false);

  const issueQuery = useQuery({
    queryKey: queryKeys.issues.detail(id ?? ""),
    enabled: !!id,
    queryFn: () => api.get<Issue>(endpoints.issues.byId(id as string)),
  });

  useEffect(() => {
    if (!issueQuery.data || hydrated) return;
    setTitle(issueQuery.data.title);
    setDescription(issueQuery.data.description);
    setTags(issueQuery.data.tags);
    setPriority(issueQuery.data.priority);
    setHydrated(true);
  }, [hydrated, issueQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (body: { title: string; description: string; tags: string[]; priority: number }) =>
      api.put<Issue>(endpoints.issues.byId(id as string), body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.detail(id as string) });
      router.back();
    },
  });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(""); }
  };

  const submit = async () => {
    if (!title.trim()) { Alert.alert("Lỗi", "Vui lòng nhập tiêu đề"); return; }
    try {
      await updateMutation.mutateAsync({ title: title.trim(), description: description.trim(), tags, priority });
    } catch {
      Alert.alert("Lỗi", "Không thể lưu thay đổi");
    }
  };

  if (issueQuery.isLoading) return null;

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Input label="Tiêu đề" value={title} onChangeText={setTitle} placeholder="Mô tả ngắn gọn vấn đề" />
        <Input label="Chi tiết" value={description} onChangeText={setDescription} placeholder="Giải thích rõ hơn..." multiline numberOfLines={4} style={{ height: 100, textAlignVertical: "top" }} />

        <Input label="Kỹ năng cần" value={tagInput} onChangeText={setTagInput} placeholder="VD: React Native" onSubmitEditing={addTag} returnKeyType="done" />
        {tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-4 -mt-2">
            {tags.map(t => (
              <Pressable key={t} className="bg-primary-light px-3 py-1 rounded-md" onPress={() => setTags(tags.filter(x => x !== t))}>
                <Text className="text-sm font-lx-md text-primary">{t} ×</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text className="text-sm font-lx-md text-foreground mb-2">Độ ưu tiên</Text>
        <View className="flex-row gap-2 mb-5">
          {PRIORITIES.map(p => (
            <Pressable
              key={p.value}
              className={`px-3 py-2 rounded-xl border ${priority === p.value ? "border-primary bg-primary-light" : "border-border bg-surface"}`}
              onPress={() => setPriority(p.value)}
            >
              <Text className={`text-sm font-lx-md ${priority === p.value ? "text-primary" : "text-muted"}`}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        <Button title={updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"} onPress={submit} disabled={updateMutation.isPending} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
