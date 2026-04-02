import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TagSelect } from "@/components/TagSelect";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Issue } from "@/types/issue";

const PRIORITIES = [
  { label: "Thấp", value: 3 },
  { label: "Trung bình", value: 5 },
  { label: "Cao", value: 8 },
];

const DURATIONS = [
  { label: "1 ngày", value: 1 },
  { label: "3 ngày", value: 3 },
  { label: "7 ngày", value: 7 },
  { label: "30 ngày", value: 30 },
  { label: "Không thời hạn", value: null },
];

export default function CreateIssueScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState(5);
  const [duration, setDuration] = useState<number | null>(7);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề");
      return;
    }
    setLoading(true);
    try {
      await api.post<Issue>(endpoints.issues.list, { title: title.trim(), description: description.trim(), tags, priority, durationDays: duration });
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
        <Input
          label="Tiêu đề"
          value={title}
          onChangeText={setTitle}
          placeholder="Mô tả ngắn gọn vấn đề"
        />

        <Input
          label="Chi tiết"
          value={description}
          onChangeText={setDescription}
          placeholder="Giải thích rõ hơn..."
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <TagSelect selected={tags} onChange={setTags} />

        <Text className="text-sm font-lx-md text-foreground mb-2">Độ ưu tiên</Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
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

        <Text className="text-sm font-lx-md text-foreground mb-2">Thời lượng</Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
          {DURATIONS.map(d => (
            <Pressable
              key={String(d.value)}
              className={`px-3 py-2 rounded-xl border ${duration === d.value ? "border-primary bg-primary-light" : "border-border bg-surface"}`}
              onPress={() => setDuration(d.value)}
            >
              <Text className={`text-sm font-lx-md ${duration === d.value ? "text-primary" : "text-muted"}`}>{d.label}</Text>
            </Pressable>
          ))}
        </View>

        <Button title={loading ? "Đang tạo..." : "Tạo vấn đề"} onPress={submit} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
