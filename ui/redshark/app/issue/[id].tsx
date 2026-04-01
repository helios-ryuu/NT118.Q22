// Chi tiet van de — phan quyen Owner vs Non-owner
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "@/components/common/Button";
import { Avatar } from "@/components/common/Avatar";
import { priorityLabel, statusLabel } from "@/constants/labels";
import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { useAuth } from "@/hooks/useAuth";
import type { Issue } from "@/types/issue";
import type { Session } from "@/types/workspace";
import { colors, borderRadius, fonts, fontSize, spacing } from "@/constants/theme";

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [issueResult, sessionResult, appliedResult] = await Promise.allSettled([
        api.get<Issue>(endpoints.issues.byId(id)),
        api.get<Session>(endpoints.sessions.byIssue(id)),
        api.get<{ applied: boolean }>(endpoints.issues.applied(id)),
      ]);

      if (issueResult.status !== "fulfilled") {
        throw issueResult.reason;
      }

      setIssue(issueResult.value);

      if (sessionResult.status === "fulfilled") {
        setSessionId(sessionResult.value.id);
      } else {
        setSessionId(null);
      }

      if (appliedResult.status === "fulfilled") {
        setHasApplied(appliedResult.value.applied);
      }
    } catch (e) {
      console.error("[IssueDetail] load:", e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleDelete = () => {
    Alert.alert("Xóa vấn đề", "Bạn chắc chắn muốn xóa vấn đề này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa", style: "destructive",
        onPress: async () => {
          await api.delete(endpoints.issues.byId(id as string));
          router.back();
        },
      },
    ]);
  };

  const handleApply = async () => {
    try {
      await api.post(endpoints.issues.apply(id as string), {});
      setHasApplied(true);
      Alert.alert("Đã ứng cử", "Chủ sở hữu sẽ xem xét và chấp nhận bạn");
    } catch {
      Alert.alert("Lỗi", "Không thể ứng cử");
    }
  };

  const handleClose = () => {
    Alert.alert("Đóng vấn đề", "Đóng vấn đề này? Workspace vẫn có thể đọc được.", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đóng",
        onPress: async () => {
          await api.put(endpoints.issues.status(id as string), { status: "closed" });
          router.replace("/(tabs)/issues");
        },
      },
    ]);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (!issue) {
    return <View style={styles.center}><Text style={styles.notFound}>Không tìm thấy vấn đề</Text></View>;
  }

  const isOwner = user?.id === issue.authorId;
  const isMember = !isOwner && sessionId !== null;
  const priorityTone = issue.priority <= 3 ? styles.chipLow : issue.priority <= 7 ? styles.chipMid : styles.chipHigh;
  const isActiveStatus = issue.status === "open" || issue.status === "in_progress";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Status chips */}
      <View style={styles.row}>
        <View style={[styles.chip, priorityTone]}>
          <Text style={[styles.chipText, styles.chipTextDark]}>{priorityLabel(issue.priority)}</Text>
        </View>
        <View style={[styles.chip, isActiveStatus ? styles.chipActive : styles.chipMuted]}>
          <Text style={[styles.chipText, isActiveStatus ? styles.chipTextLight : styles.chipTextDark]}>
            {statusLabel[issue.status]}
          </Text>
        </View>
      </View>

      {/* Title + description */}
      <Text style={styles.title}>{issue.title}</Text>
      <Text style={styles.desc}>{issue.description}</Text>

      {/* Tags */}
      {issue.tags.length > 0 && (
        <View style={styles.tags}>
          {issue.tags.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Author */}
      <View style={styles.authorRow}>
        <Avatar uri={issue.authorAvatar} name={issue.authorName} size={32} />
        <Text style={styles.authorName}>{issue.authorName}</Text>
      </View>

      {/* Time info */}
      <View style={styles.timeSection}>
        <Text style={styles.timeLabel}>Tạo lúc: {new Date(issue.createdAt).toLocaleString("vi-VN")}</Text>
        {issue.expiresAt && (
          <Text style={styles.timeLabel}>Hết hạn: {new Date(issue.expiresAt).toLocaleString("vi-VN")}</Text>
        )}
      </View>

      {/* === OWNER ACTIONS === */}
      {isOwner && issue.status === "open" && (
        <View style={styles.actionGroup}>
          {sessionId && <Button title="Vào thảo luận" onPress={() => router.push(`/workspace/${sessionId}`)} />}
          <Button title="Chỉnh sửa" variant="outline" onPress={() => router.push(`/issue/edit?id=${issue.id}`)} />
          <Button title="Xóa" variant="ghost" onPress={handleDelete} />
          <Button title="Danh sách ứng cử" onPress={() => router.push(`/issue/${issue.id}/applications`)} />
        </View>
      )}

      {isOwner && issue.status === "in_progress" && sessionId && (
        <View style={styles.actionGroup}>
          <Button title="Vào thảo luận" onPress={() => router.push(`/workspace/${sessionId}`)} />
          <Button title="Đóng vấn đề" variant="outline" onPress={handleClose} />
        </View>
      )}

      {/* === NON-OWNER ACTIONS === */}
      {!isOwner && issue.status === "open" && (
        <View style={styles.actionGroup}>
          {sessionId && <Button title="Vào thảo luận" variant="outline" onPress={() => router.push(`/workspace/${sessionId}`)} />}
          <Button
            title={hasApplied ? "Đã ứng cử" : "Ứng cử"}
            onPress={hasApplied ? () => {} : handleApply}
            disabled={hasApplied}
          />
        </View>
      )}

      {!isOwner && issue.status === "in_progress" && isMember && sessionId && (
        <Button title="Vào thảo luận" onPress={() => router.push(`/workspace/${sessionId}`)} />
      )}

      {(issue.status === "closed" || issue.status === "cancelled") && sessionId && (
        <Button title="Xem workspace (chỉ đọc)" onPress={() => router.push(`/workspace/${sessionId}`)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[5], paddingBottom: spacing[8] },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  notFound: { fontSize: fontSize.md, fontFamily: fonts.regular, color: colors.textSecondary },
  row: { flexDirection: "row", gap: spacing[2], marginBottom: spacing[3] },
  chip: { paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 999 },
  chipLow: { backgroundColor: colors.border },
  chipMid: { backgroundColor: "#FEF3C7" },
  chipHigh: { backgroundColor: "#FEE2E2" },
  chipActive: { backgroundColor: colors.primary },
  chipMuted: { backgroundColor: colors.border },
  chipText: { fontSize: fontSize.xs, fontFamily: fonts.semiBold },
  chipTextLight: { color: "#fff" },
  chipTextDark: { color: colors.text },
  title: { fontSize: fontSize.xl, fontFamily: fonts.bold, color: colors.text, marginBottom: spacing[2] },
  desc: { fontSize: fontSize.md, fontFamily: fonts.regular, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing[4] },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2], marginBottom: spacing[4] },
  tag: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: borderRadius.sm },
  tagText: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.primary },
  authorRow: { flexDirection: "row", alignItems: "center", gap: spacing[3], marginBottom: spacing[4] },
  authorName: { fontSize: fontSize.md, fontFamily: fonts.medium, color: colors.text },
  timeSection: { marginBottom: spacing[5] },
  timeLabel: { fontSize: fontSize.sm, fontFamily: fonts.regular, color: colors.textSecondary, marginBottom: spacing[1] },
  actionGroup: { gap: spacing[3] },
});
