// The ung vien — hien avatar, ten, trang thai va nut accept/reject
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/common/Avatar";
import { Card } from "@/components/common/Card";
import type { IssueApplication } from "@/types/issue";
import { colors, borderRadius, fonts, fontSize, spacing } from "@/constants/theme";

const statusConfig = {
  pending: { label: "Đang chờ", bg: "#FEF3C7", text: colors.text },
  accepted: { label: "Đã nhận", bg: "#D1FAE5", text: colors.success },
  rejected: { label: "Đã từ chối", bg: colors.border, text: colors.text },
};

interface Props {
  application: IssueApplication;
  onAccept: () => void;
  onReject: () => void;
}

export function ApplicantCard({ application, onAccept, onReject }: Props) {
  const cfg = statusConfig[application.status];

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Avatar uri={application.applicantAvatar} name={application.applicantName} size={40} />
        <View style={styles.info}>
          <Text style={styles.name}>{application.applicantName}</Text>
          <Text style={styles.time}>{new Date(application.createdAt).toLocaleString("vi-VN")}</Text>
        </View>
        <View style={[styles.statusChip, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.statusChipText, { color: cfg.text }]}>{cfg.label}</Text>
        </View>
      </View>

      {application.status === "pending" && (
        <View style={styles.actions}>
          <Pressable style={styles.rejectBtn} onPress={onReject}>
            <Text style={styles.rejectText}>Từ chối</Text>
          </Pressable>
          <Pressable style={styles.acceptBtn} onPress={onAccept}>
            <Text style={styles.acceptText}>Nhận vào workspace</Text>
          </Pressable>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing[3] },
  row: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  info: { flex: 1 },
  name: { fontSize: fontSize.md, fontFamily: fonts.semiBold, color: colors.text },
  time: { fontSize: fontSize.xs, fontFamily: fonts.regular, color: colors.textSecondary },
  statusChip: { paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: borderRadius.full },
  statusChipText: { fontSize: fontSize.xs, fontFamily: fonts.semiBold },
  actions: { flexDirection: "row", gap: spacing[2], marginTop: spacing[3] },
  rejectBtn: {
    flex: 1, paddingVertical: spacing[2], borderRadius: borderRadius.sm,
    borderWidth: 1, borderColor: colors.border, alignItems: "center",
  },
  rejectText: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.textSecondary },
  acceptBtn: {
    flex: 2, paddingVertical: spacing[2], borderRadius: borderRadius.sm,
    backgroundColor: colors.primary, alignItems: "center",
  },
  acceptText: { fontSize: fontSize.sm, fontFamily: fonts.medium, color: colors.surface },
});
