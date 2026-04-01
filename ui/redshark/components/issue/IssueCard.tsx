// The van de — hien tieu de, tags, do uu tien, trang thai
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "@/components/common/Card";
import { priorityLabel, statusLabel } from "@/constants/labels";
import type { Issue } from "@/types/issue";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";

interface Props {
  issue: Issue;
}

export function IssueCard({ issue }: Props) {
  const router = useRouter();
  const priorityTone = issue.priority <= 3 ? styles.chipLow : issue.priority <= 7 ? styles.chipMid : styles.chipHigh;
  const statusTone =
    issue.status === "open"
      ? styles.chipOpen
      : issue.status === "in_progress"
        ? styles.chipInProgress
        : styles.chipMuted;
  const isMutedStatus = issue.status === "closed" || issue.status === "cancelled";

  return (
    <Pressable onPress={() => router.push(`/issue/${issue.id}`)}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <View style={[styles.chip, priorityTone]}>
            <Text style={[styles.chipText, styles.chipTextDark]}>{priorityLabel(issue.priority)}</Text>
          </View>
          <View style={[styles.chip, statusTone]}>
            <Text style={[styles.chipText, isMutedStatus ? styles.chipTextDark : styles.chipTextLight]}>
              {statusLabel[issue.status]}
            </Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>{issue.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{issue.description}</Text>
        <View style={styles.tags}>
          {issue.tags.slice(0, 3).map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.author}>{issue.authorName}</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing[3] },
  topRow: { flexDirection: "row", gap: spacing[2], marginBottom: spacing[2] },
  chip: { paddingHorizontal: spacing[2], paddingVertical: 4, borderRadius: 999 },
  chipLow: { backgroundColor: colors.border },
  chipMid: { backgroundColor: "#FEF3C7" },
  chipHigh: { backgroundColor: "#FEE2E2" },
  chipOpen: { backgroundColor: colors.primary },
  chipInProgress: { backgroundColor: colors.success },
  chipMuted: { backgroundColor: colors.border },
  chipText: { fontSize: fontSize.xs, fontFamily: fonts.semiBold },
  chipTextLight: { color: "#fff" },
  chipTextDark: { color: colors.text },
  title: { fontSize: fontSize.md, fontFamily: fonts.semiBold, color: colors.text, marginBottom: spacing[1] },
  desc: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textSecondary, marginBottom: spacing[2] },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing[1], marginBottom: spacing[2] },
  tag: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing[2], paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: fontSize.xs, fontFamily: fonts.medium, color: colors.primary },
  author: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textSecondary },
});
