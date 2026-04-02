import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts, text, radius, spacing } from "@/constants/theme";

const TAGS = [
  "React Native", "React", "Vue", "Angular", "Flutter",
  "iOS", "Android", "Java", "Kotlin", "Swift",
  "Node.js", "Python", "Go", "Rust", "C++",
  "Spring Boot", "Django", "FastAPI", "PostgreSQL", "MongoDB",
  "Docker", "Kubernetes", "AWS", "Firebase", "Supabase",
  "UI/UX", "Figma", "Machine Learning", "Data Science", "DevOps",
];

interface Props {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelect({ selected, onChange }: Props) {
  const toggle = (tag: string) =>
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);

  return (
    <View style={s.wrap}>
      <Text style={s.label}>Kỹ năng cần ({selected.length})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
        {TAGS.map(tag => {
          const active = selected.includes(tag);
          return (
            <Pressable key={tag} style={[s.chip, active && s.chipActive]} onPress={() => toggle(tag)}>
              <Text style={[s.chipText, active && s.chipTextActive]}>{tag}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: spacing[4] },
  label: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.text, marginBottom: spacing[2] },
  row: { gap: spacing[2], paddingVertical: spacing[1] },
  chip: { paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { fontSize: text.sm, fontFamily: fonts.medium, color: colors.textSecondary },
  chipTextActive: { color: colors.primary },
});
