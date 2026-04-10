import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { createIdea } from "@dataconnect/generated";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TagSelect } from "@/components/TagSelect";
import { queryKeys } from "@/services/queryKeys";

export default function CreateIdeaScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề ý tưởng");
      return;
    }
    setLoading(true);
    try {
      await createIdea({
        title: title.trim(),
        description: description.trim(),
        tagIds,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.ideas.all });
      Alert.alert("Thành công", "Đã tạo ý tưởng mới", [{ text: "OK", onPress: () => router.back() }]);
    } catch {
      Alert.alert("Lỗi", "Không thể tạo ý tưởng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Text className="text-2xl font-lx-bold text-foreground mb-5">Tạo ý tưởng mới</Text>
        <Input
          label="Tiêu đề"
          value={title}
          onChangeText={setTitle}
          placeholder="Tên ý tưởng hoặc dự án"
        />
        <Input
          label="Mô tả"
          value={description}
          onChangeText={setDescription}
          placeholder="Mô tả chi tiết ý tưởng..."
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />
        <TagSelect selected={tagIds} onChange={setTagIds} />
        <Button title={loading ? "Đang tạo..." : "Tạo ý tưởng"} onPress={submit} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
