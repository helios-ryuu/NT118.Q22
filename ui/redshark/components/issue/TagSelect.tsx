// TagSelect — multi-select chips tu danh sach predefined skill tags
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, borderRadius, fonts, fontSize, spacing } from "@/constants/theme";

const PREDEFINED_TAGS = [
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
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Kỹ năng cần</Text>
      <View style={styles.chips}>
        {PREDEFINED_TAGS.map((tag) => {
          const active = selected.includes(tag);
          return (
            <Pressable
              key={tag}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => toggle(tag)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{tag}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing[4] },
  label: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.text, marginBottom: spacing[2] },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2] },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  chipText: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.textSecondary },
  chipTextActive: { color: colors.primary },
});
