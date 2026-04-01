// Chinh sua van de — form pre-filled voi du lieu hien tai
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useMutation } from "@/hooks/useMutation";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Issue } from "@/types/issue";
import { colors, borderRadius, fonts, fontSize, spacing } from "@/constants/theme";

export default function EditIssueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState(5);
  const { loading: submitting, mutate: updateIssue } = useMutation((payload: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    priority: number;
  }) => {
    const { id: issueId, ...body } = payload;
    return api.put<Issue>(endpoints.issues.byId(issueId), body);
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get<Issue>(endpoints.issues.byId(id))
      .then((i) => {
        setTitle(i.title);
        setDescription(i.description);
        setTags(i.tags);
        setPriority(i.priority);
      })
      .catch((e: unknown) => console.error("[EditIssue] load:", e))
      .finally(() => setLoading(false));
  }, [id]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const submit = async () => {
    if (!title.trim()) return Alert.alert("Lỗi", "Vui lòng nhập tiêu đề");
    try {
      await updateIssue({
        id: id as string,
        title,
        description,
        tags,
        priority,
      });
      router.back();
    } catch {
      Alert.alert("Lỗi", "Không thể lưu thay đổi");
    }
  };

  if (loading) return null;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Input label="Tiêu đề" value={title} onChangeText={setTitle} placeholder="Mô tả ngắn gọn vấn đề" />
        <Input label="Chi tiết" value={description} onChangeText={setDescription} placeholder="Giải thích rõ hơn..."
          multiline numberOfLines={4} style={styles.multiline} />

        <Input label="Kỹ năng cần" value={tagInput} onChangeText={setTagInput} placeholder="VD: React Native"
          onSubmitEditing={addTag} returnKeyType="done" />
        {tags.length > 0 && (
          <View style={styles.tags}>
            {tags.map((t) => (
              <Pressable key={t} onPress={() => setTags(tags.filter((x) => x !== t))} style={styles.tag}>
                <Text style={styles.tagText}>{t} ×</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.sliderSection}>
          <Text style={styles.label}>
            Độ ưu tiên: <Text style={styles.priorityValue}>{priority}</Text>
            <Text style={styles.priorityHint}> ({priority <= 3 ? "Thấp" : priority <= 7 ? "Trung bình" : "Cao"})</Text>
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={priority}
            onValueChange={setPriority}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>1</Text>
            <Text style={styles.sliderLabelText}>10</Text>
          </View>
        </View>
        <Button title={submitting ? "Đang lưu..." : "Lưu thay đổi"} onPress={submit} disabled={submitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[5], paddingBottom: spacing[8] },
  multiline: { height: 100, textAlignVertical: "top" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2], marginBottom: spacing[4], marginTop: -spacing[2] },
  tag: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: borderRadius.sm },
  tagText: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.primary },
  label: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.text, marginBottom: spacing[2] },
  sliderSection: { marginBottom: spacing[4] },
  slider: { width: "100%", height: 40 },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between" },
  sliderLabelText: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textSecondary },
  priorityValue: { color: colors.primary, fontFamily: fonts.semiBold },
  priorityHint: { color: colors.textSecondary, fontFamily: fonts.regular },
});
