import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TagSelect } from "@/components/TagSelect";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Issue } from "@/types/issue";
import { colors, fonts, text, radius, spacing } from "@/constants/theme";

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
    if (!title.trim()) { Alert.alert("Lỗi", "Vui lòng nhập tiêu đề"); return; }
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
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={s.screen} contentContainerStyle={s.content}>
        <Input label="Tiêu đề" value={title} onChangeText={setTitle} placeholder="Mô tả ngắn gọn vấn đề" />
        <Input label="Chi tiết" value={description} onChangeText={setDescription} placeholder="Giải thích rõ hơn..." multiline numberOfLines={4} style={s.multiline} />

        <TagSelect selected={tags} onChange={setTags} />

        <Text style={s.label}>Độ ưu tiên</Text>
        <View style={s.chips}>
          {PRIORITIES.map(p => (
            <Pressable key={p.value} style={[s.chip, priority === p.value && s.chipActive]} onPress={() => setPriority(p.value)}>
              <Text style={[s.chipText, priority === p.value && s.chipTextActive]}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Thời lượng</Text>
        <View style={s.chips}>
          {DURATIONS.map(d => (
            <Pressable key={String(d.value)} style={[s.chip, duration === d.value && s.chipActive]} onPress={() => setDuration(d.value)}>
              <Text style={[s.chipText, duration === d.value && s.chipTextActive]}>{d.label}</Text>
            </Pressable>
          ))}
        </View>

        <Button title={loading ? "Đang tạo..." : "Tạo vấn đề"} onPress={submit} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[5], paddingBottom: spacing[8] },
  multiline: { height: 100, textAlignVertical: "top" },
  label: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.text, marginBottom: spacing[2] },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2], marginBottom: spacing[5] },
  chip: { paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.textSecondary },
  chipTextActive: { color: colors.primary },
});
