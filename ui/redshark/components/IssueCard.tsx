import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, text, radius, spacing } from "@/constants/theme";
import { priorityLabel, statusLabel } from "@/constants/labels";
import type { Issue } from "@/types/issue";

export function IssueCard({ issue }: { issue: Issue }) {
  const router = useRouter();
  return (
    <Pressable style={s.card} onPress={() => router.push(`/issue/${issue.id}`)}>
      <View style={s.chips}>
        <Text style={[s.chip, issue.priority >= 8 ? s.chipHigh : issue.priority >= 5 ? s.chipMid : s.chipLow]}>
          {priorityLabel(issue.priority)}
        </Text>
        <Text style={[s.chip, issue.status === "open" || issue.status === "in_progress" ? s.chipActive : s.chipMuted]}>
          {statusLabel[issue.status]}
        </Text>
      </View>
      <Text style={s.title} numberOfLines={2}>{issue.title}</Text>
      <Text style={s.desc} numberOfLines={2}>{issue.description}</Text>
      {issue.tags.length > 0 && (
        <View style={s.tags}>
          {issue.tags.slice(0, 4).map(t => <Text key={t} style={s.tag}>{t}</Text>)}
        </View>
      )}
      <Text style={s.author}>{issue.authorName}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing[4],
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
  },
  chips: { flexDirection: "row", gap: spacing[2], marginBottom: spacing[2] },
  chip: { fontSize: text.xs, fontFamily: fonts.semiBold, paddingHorizontal: spacing[2], paddingVertical: 2, borderRadius: 99 },
  chipLow: { backgroundColor: colors.border, color: colors.text },
  chipMid: { backgroundColor: "#FEF3C7", color: "#92400E" },
  chipHigh: { backgroundColor: "#FEE2E2", color: "#991B1B" },
  chipActive: { backgroundColor: colors.primary, color: "#fff" },
  chipMuted: { backgroundColor: colors.border, color: colors.text },
  title: { fontSize: text.md, fontFamily: fonts.semiBold, color: colors.text, marginBottom: spacing[1] },
  desc: { fontSize: text.sm, fontFamily: fonts.regular, color: colors.textSecondary, marginBottom: spacing[2] },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing[1], marginBottom: spacing[2] },
  tag: { fontSize: text.xs, fontFamily: fonts.medium, color: colors.primary, backgroundColor: colors.primaryLight, paddingHorizontal: spacing[2], paddingVertical: 2, borderRadius: 99 },
  author: { fontSize: text.xs, fontFamily: fonts.regular, color: colors.textSecondary },
});
