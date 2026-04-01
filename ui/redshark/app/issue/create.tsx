// Tao van de moi — form day du: tieu de, mo ta, tags, priority slider, duration
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { TagSelect } from "@/components/issue/TagSelect";
import { useMutation } from "@/hooks/useMutation";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import type { Issue } from "@/types/issue";
import { colors, borderRadius, fonts, fontSize, spacing } from "@/constants/theme";

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
  const [durationDays, setDurationDays] = useState<number | null>(7);
  const { loading: submitting, mutate: createIssue } = useMutation((body: unknown) => api.post<Issue>(endpoints.issues.list, body));

  const submit = async () => {
    if (!title.trim()) return Alert.alert("Lỗi", "Vui lòng nhập tiêu đề");
    try {
      await createIssue({
        title: title.trim(),
        description: description.trim(),
        tags,
        priority,
        durationDays,
      });
      Alert.alert("Thành công", "Đã tạo vấn đề mới", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Lỗi", "Không thể tạo vấn đề");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Tạo vấn đề mới</Text>

        <Input label="Tiêu đề" value={title} onChangeText={setTitle} placeholder="Mô tả ngắn gọn vấn đề" />
        <Input
          label="Chi tiết"
          value={description}
          onChangeText={setDescription}
          placeholder="Giải thích rõ hơn..."
          multiline
          numberOfLines={4}
          style={styles.multiline}
        />

        <TagSelect selected={tags} onChange={setTags} />

        {/* Priority slider */}
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

        {/* Duration */}
        <Text style={styles.label}>Thời lượng</Text>
        <View style={styles.durationRow}>
          {DURATIONS.map((d) => (
            <Pressable
              key={String(d.value)}
              style={[styles.durationBtn, durationDays === d.value && styles.durationActive]}
              onPress={() => setDurationDays(d.value)}
            >
              <Text style={[styles.durationText, durationDays === d.value && styles.durationTextActive]}>
                {d.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Button title={submitting ? "Đang tạo..." : "Tạo vấn đề"} onPress={submit} disabled={submitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[5], paddingBottom: spacing[8] },
  heading: { fontSize: fontSize.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[5] },
  multiline: { height: 100, textAlignVertical: "top" },
  label: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.text, marginBottom: spacing[2] },
  sliderSection: { marginBottom: spacing[4] },
  slider: { width: "100%", height: 40 },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between" },
  sliderLabelText: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textSecondary },
  priorityValue: { color: colors.primary, fontFamily: fonts.semiBold },
  priorityHint: { color: colors.textSecondary, fontFamily: fonts.regular },
  durationRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2], marginBottom: spacing[5] },
  durationBtn: {
    paddingHorizontal: spacing[3], paddingVertical: spacing[2],
    borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  durationActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  durationText: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.textSecondary },
  durationTextActive: { color: colors.primary },
});
