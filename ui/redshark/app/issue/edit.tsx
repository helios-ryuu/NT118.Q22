import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Issue } from "@/types/issue";
import { colors, fonts, text, radius, spacing } from "@/constants/theme";

const PRIORITIES = [
  { label: "Thấp", value: 3 },
  { label: "Trung bình", value: 5 },
  { label: "Cao", value: 8 },
];

export default function EditIssueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<Issue>(endpoints.issues.byId(id))
      .then(i => { setTitle(i.title); setDescription(i.description); setTags(i.tags); setPriority(i.priority); })
      .catch(e => console.error("[EditIssue]", e))
      .finally(() => setLoading(false));
  }, [id]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(""); }
  };

  const submit = async () => {
    if (!title.trim()) { Alert.alert("Lỗi", "Vui lòng nhập tiêu đề"); return; }
    setSaving(true);
    try {
      await api.put<Issue>(endpoints.issues.byId(id as string), { title, description, tags, priority });
      router.back();
    } catch {
      Alert.alert("Lỗi", "Không thể lưu thay đổi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={s.screen} contentContainerStyle={s.content}>
        <Input label="Tiêu đề" value={title} onChangeText={setTitle} placeholder="Mô tả ngắn gọn vấn đề" />
        <Input label="Chi tiết" value={description} onChangeText={setDescription} placeholder="Giải thích rõ hơn..." multiline numberOfLines={4} style={s.multiline} />

        <Input label="Kỹ năng cần" value={tagInput} onChangeText={setTagInput} placeholder="VD: React Native" onSubmitEditing={addTag} returnKeyType="done" />
        {tags.length > 0 && (
          <View style={s.tags}>
            {tags.map(t => (
              <Pressable key={t} style={s.tag} onPress={() => setTags(tags.filter(x => x !== t))}>
                <Text style={s.tagText}>{t} ×</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={s.label}>Độ ưu tiên</Text>
        <View style={s.chips}>
          {PRIORITIES.map(p => (
            <Pressable key={p.value} style={[s.chip, priority === p.value && s.chipActive]} onPress={() => setPriority(p.value)}>
              <Text style={[s.chipText, priority === p.value && s.chipTextActive]}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        <Button title={saving ? "Đang lưu..." : "Lưu thay đổi"} onPress={submit} disabled={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[5], paddingBottom: spacing[8] },
  multiline: { height: 100, textAlignVertical: "top" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2], marginBottom: spacing[4], marginTop: -spacing[2] },
  tag: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: radius.sm },
  tagText: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.primary },
  label: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.text, marginBottom: spacing[2] },
  chips: { flexDirection: "row", gap: spacing[2], marginBottom: spacing[5] },
  chip: { paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.textSecondary },
  chipTextActive: { color: colors.primary },
});
