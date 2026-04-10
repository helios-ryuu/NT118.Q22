import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { countMyActiveIssues, createIssue } from "@dataconnect/generated";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function CreateIssueScreen() {
  const { ideaId } = useLocalSearchParams<{ ideaId: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề");
      return;
    }
    if (!ideaId) {
      Alert.alert("Lỗi", "Không xác định được ý tưởng");
      return;
    }
    setLoading(true);
    try {
      // Kiem tra gioi han 20 van de dang hoat dong
      const countResult = await countMyActiveIssues();
      if ((countResult.data.issues?.length ?? 0) >= 20) {
        Alert.alert("Giới hạn", "Bạn đã đạt giới hạn 20 vấn đề đang hoạt động");
        return;
      }
      await createIssue({
        ideaId,
        title: title.trim(),
        content: content.trim(),
      });
      Alert.alert("Thành công", "Đã tạo vấn đề mới", [{ text: "OK", onPress: () => router.back() }]);
    } catch {
      Alert.alert("Lỗi", "Không thể tạo vấn đề");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Text className="text-2xl font-lx-bold text-foreground mb-5">Tạo vấn đề mới</Text>
        <Input
          label="Tiêu đề"
          value={title}
          onChangeText={setTitle}
          placeholder="Mô tả ngắn gọn vấn đề"
        />
        <Input
          label="Nội dung"
          value={content}
          onChangeText={setContent}
          placeholder="Mô tả chi tiết vấn đề..."
          multiline
          numberOfLines={5}
          style={{ height: 120, textAlignVertical: "top" }}
        />
        <Button title={loading ? "Đang tạo..." : "Tạo vấn đề"} onPress={submit} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
